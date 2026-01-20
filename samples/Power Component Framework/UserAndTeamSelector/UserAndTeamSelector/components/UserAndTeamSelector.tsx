import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as ReactDOM from 'react-dom';

// Definiciones para trabajar con Xrm desde PCF
// Nota: solo incluimos lo minimo que necesitamos, no toda la API
interface XrmWebApi {
    updateRecord(entityLogicalName: string, id: string, data: Record<string, string | null>): Promise<{ id: string }>;
}

// Atributo del formulario - necesario para campos polimorficos
interface XrmAttribute {
    setValue(value: ComponentFramework.LookupValue[] | null): void;
    fireOnChange(): void;  // dispara eventos onchange del campo
}

interface XrmPage {
    getAttribute(attributeName: string): XrmAttribute | null;
}

// Objeto Xrm global del navegador
interface XrmGlobal {
    WebApi: XrmWebApi;
    Page?: XrmPage;  // puede no estar disponible en algunos contextos
}

declare global {
    interface Window {
        Xrm?: XrmGlobal;
    }
}

// Extension of entity ref for internal tracking - needed for recent items feature
interface InternalEntityReference extends ComponentFramework.EntityReference {
    etn: string;  // entity type name
    name: string;
    description?: string;
    email?: string;
    isRecent: boolean;  // flag para items recientes
    lastUsed?: number;
}

export interface IProps {
    utility: ComponentFramework.Utility;
    webAPI: ComponentFramework.WebApi;
    currentRecordId: string;
    entityName: string;
    fieldName: string;
    isDisabled: boolean;
    showUsers: boolean;
    showTeams: boolean;
    currentUserId: string;
    resources: ComponentFramework.Resources;
    onValueChange?: (value: ComponentFramework.LookupValue[]) => void;
}

interface UserEntity {
    systemuserid: string;
    fullname: string;
    internalemailaddress?: string;
}

interface TeamEntity {
    teamid: string;
    name: string;
    description?: string;
}

interface RecentItem {
    id: string;
    name: string;
    etn: string;
    email?: string;
    description?: string;
    lastUsed: number;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
    </svg>
);

const TeamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
);

const RecentIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7" fill="none" stroke="#666" strokeWidth="1.5"/>
        <path d="M8 4 L8 8 L11 11" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

// clave para almacenar recientes en localStorage del navegador
const LOCAL_STORAGE_PREFIX = 'pcf_recent_users_teams';

const getRecentItems = (userId: string): RecentItem[] => {
    try {
        const storageKey = `${LOCAL_STORAGE_PREFIX}_${userId}`;
        const stored = localStorage.getItem(storageKey);
        if(stored) {
            return JSON.parse(stored) as RecentItem[];
        }
        return [];
    } catch {
        // si falla el parse o algo, devolvemos array vacio
        return [];
    }
};

const saveRecentItem = (userId: string, item: InternalEntityReference): void => {
    try {
        const storageKey = `${LOCAL_STORAGE_PREFIX}_${userId}`;
        const recents = getRecentItems(userId);
        // quitar el item si ya existe para evitar duplicados
        const filtered = recents.filter(r => r.id !== item.id.guid);
        
        const newItem: RecentItem = {
            id: item.id.guid,
            name: item.name,
            etn: item.etn,
            email: item.email,
            description: item.description,
            lastUsed: Date.now()
        };
        
        filtered.unshift(newItem);  // añadir al principio
        const maxRecentItems = 10;
        const top10 = filtered.slice(0, maxRecentItems);  // mantener solo top 10
        localStorage.setItem(storageKey, JSON.stringify(top10));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};

export const UserAndTeamSelectorComponent: React.FC<IProps> = ({ webAPI, currentRecordId, entityName, fieldName, isDisabled, showUsers, showTeams, currentUserId, resources }) => {
    
    // Estado del componente - separado por tipo de dato
    const [currentSelection, setCurrentSelection] = useState<InternalEntityReference | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Resultados de busqueda separados por tipo
    const [userResults, setUserResults] = useState<InternalEntityReference[]>([]);
    const [teamResults, setTeamResults] = useState<InternalEntityReference[]>([]);
    
    // Estados de UI
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const defaultTab: 'users' | 'teams' = 'users';
    const [activeTab, setActiveTab] = useState<'users' | 'teams'>(defaultTab);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    
    // Referencias para manejar el DOM
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Verificar si tenemos contexto valido antes de hacer nada
    let hasValidContext = false;
    if(currentRecordId && entityName && fieldName) {
        hasValidContext = true;
    }


    // cargar valor actual del campo cuando se monta el componente
    useEffect(() => {
        const loadCurrentValue = async () => {
            if (!currentRecordId || !entityName || !fieldName) {
                return;  // faltan parametros requeridos
            }

            try {
                // Para campos polimorficos, no usar $select - recuperar el registro completo
                // Los lookups polimorficos se devuelven automaticamente con _fieldname_value
                const result = await webAPI.retrieveRecord(
                    entityName,
                    currentRecordId
                );

                const lookupValue = result[`_${fieldName}_value`] as string | undefined;
                const lookupType = result[`_${fieldName}_value@Microsoft.Dynamics.CRM.lookuplogicalname`] as string | undefined;
                
                if (lookupValue && lookupType) {
                    // determinar el entityset segun el tipo
                    let entitySet: string;
                    let selectFields: string;
                    if(lookupType === 'systemuser') {
                        entitySet = 'systemusers';
                        selectFields = '$select=fullname,internalemailaddress';
                    } else {
                        entitySet = 'teams';
                        selectFields = '$select=name,description';
                    }
                    
                    const details = await webAPI.retrieveRecord(entitySet, lookupValue, `?${selectFields}`) as { fullname?: string; name?: string; internalemailaddress?: string; description?: string };
                    
                    setCurrentSelection({
                        id: { guid: lookupValue },
                        name: (lookupType === 'systemuser' ? details.fullname : details.name) ?? '',
                        etn: lookupType,
                        email: details.internalemailaddress,
                        description: details.description,
                        isRecent: false
                    });
                }
            } catch (error) {
                console.error("Error loading current value:", error);
            }
        };

        void loadCurrentValue();
    }, [currentRecordId, entityName, fieldName, webAPI]);
    
    const performSearch = useCallback(async (query: string) => {
        // no hacer busquedas si el control esta deshabilitado
        if (isDisabled) {
            return;
        }
        
        setIsLoading(true);

        try {
            // Paso 1: cargar items que el usuario ha usado recientemente
            const recents = getRecentItems(currentUserId);
            const recentItems: InternalEntityReference[] = [];

            // Filtrar los recientes basado en la configuracion del control
            for (const recent of recents) {
                // verificar si este tipo esta permitido
                let shouldSkip = false;
                if(recent.etn === 'systemuser' && !showUsers) {
                    shouldSkip = true;
                }
                if(recent.etn === 'team' && !showTeams) {
                    shouldSkip = true;
                }
                
                if (shouldSkip) {
                    continue;
                }

                if (query && !recent.name.toLowerCase().includes(query.toLowerCase()) && 
                    !(recent.email && recent.email.toLowerCase().includes(query.toLowerCase()))) {
                    continue;
                }

                recentItems.push({
                    id: { guid: recent.id },
                    name: recent.name,
                    etn: recent.etn,
                    email: recent.email,
                    description: recent.description,
                    isRecent: true,
                    lastUsed: recent.lastUsed
                });
            }

            const userResultsList: InternalEntityReference[] = [];
            const recentUserIds = new Set<string>();
            
            // separar recientes por tipo (users primero)
            for (const item of recentItems) {
                if (item.etn === 'systemuser') {
                    userResultsList.push(item);
                    recentUserIds.add(item.id.guid);
                }
            }

            // buscar users en el sistema si esta habilitado
            if (showUsers) {
                let userFilter: string;
                if(query) {
                    userFilter = `contains(fullname,'${query}') or contains(internalemailaddress,'${query}')`;
                } else {
                    userFilter = 'isdisabled eq false';
                }
                
                const usersResult = await webAPI.retrieveMultipleRecords(
                    "systemuser",
                    `?$select=systemuserid,fullname,internalemailaddress&$filter=${userFilter} and isdisabled eq false&$top=20`
                );

                userResultsList.push(...usersResult.entities
                    .filter(e => !recentUserIds.has((e as UserEntity).systemuserid))
                    .map(e => ({
                        id: { guid: (e as UserEntity).systemuserid },
                        name: (e as UserEntity).fullname,
                        etn: 'systemuser',
                        email: (e as UserEntity).internalemailaddress,
                        isRecent: false
                    }))
                );
            }

            // ahora procesamos teams
            const teamResultsList: InternalEntityReference[] = [];
            const recentTeamIds = new Set<string>();
            
            for (const item of recentItems) {
                if (item.etn === 'team') {
                    teamResultsList.push(item);
                    recentTeamIds.add(item.id.guid);
                }
            }

            if (showTeams) {
                let teamFilter = '';
                if(query) {
                    teamFilter = `contains(name,'${query}')`;
                }
                
                const filterQuery = teamFilter ? `&$filter=${teamFilter}` : '';
                const teamsResult = await webAPI.retrieveMultipleRecords(
                    "team",
                    `?$select=teamid,name,description${filterQuery}&$top=20`
                );

                teamResultsList.push(...teamsResult.entities
                    .filter(e => !recentTeamIds.has((e as TeamEntity).teamid))
                    .map(e => ({
                        id: { guid: (e as TeamEntity).teamid },
                        name: (e as TeamEntity).name,
                        etn: 'team',
                        description: (e as TeamEntity).description,
                        isRecent: false
                    }))
                );
            }

            setUserResults(userResultsList.slice(0, 20));
            setTeamResults(teamResultsList.slice(0, 20));

        } catch (error) {
            console.error("Search error:", error);
            setUserResults([]);
            setTeamResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [webAPI, currentUserId, isDisabled, showUsers, showTeams]);

    useEffect(() => {
        if (isDropdownOpen) {
            const handler = setTimeout(() => {
                void performSearch(searchQuery);
            }, 300);
            return () => clearTimeout(handler);
        }
    }, [isDropdownOpen, searchQuery, performSearch]);

    useEffect(() => {
        if (isDropdownOpen && containerRef.current) {
            const updatePosition = () => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setDropdownPosition({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX,
                        width: rect.width
                    });
                }
            };
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isDropdownOpen]);

    useEffect(() => {
        if (!isDropdownOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
            const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
            
            if (isOutsideContainer && isOutsideDropdown) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    const handleSelectItem = async (item: InternalEntityReference) => {
        // debug: ver que se esta intentando seleccionar
        console.log("handleSelectItem called", { 
            currentRecordId, 
            entityName, 
            fieldName, 
            item 
        });
        
        // Validacion: necesitamos estos 3 parametros para actualizar
        const hasMissingParams = !currentRecordId || !entityName || !fieldName;
        if (hasMissingParams) {
            console.error("Missing required parameters", { 
                currentRecordId, 
                entityName, 
                fieldName 
            });
            // informar al usuario que debe guardar primero
            const errorMsg = "Cannot select item: The record must be saved first. Please save the form and try again.";
            alert(errorMsg);
            return;
        }

        try {
            // Los campos polimorficos custom tienen problemas con Web API
            // Por eso intentamos primero acceder directo al atributo del formulario
            const xrmAvailable = typeof window.Xrm !== 'undefined' && window.Xrm;
            if (xrmAvailable) {
                // acceder a la ventana padre donde esta el formulario
                // eslint-disable-next-line @microsoft/power-apps/do-not-make-parent-assumption
                const parentWindow = window.parent as Window & { Xrm?: XrmGlobal };
                const hasParentXrm = parentWindow?.Xrm?.Page;
                
                if (hasParentXrm && parentWindow.Xrm && parentWindow.Xrm.Page) {
                    const formAttribute = parentWindow.Xrm.Page.getAttribute(fieldName);
                    
                    if (formAttribute) {
                        console.log("Using form attribute setValue for polymorphic field", {
                            fieldName,
                            item
                        });
                        
                        // Construir objeto lookup con el formato que espera Dynamics
                        const itemId = item.id.guid;
                        const itemName = item.name;
                        const itemType = item.etn;
                        
                        const singleLookup: ComponentFramework.LookupValue = {
                            id: itemId,
                            name: itemName,
                            entityType: itemType
                        };
                        
                        // Los lookups siempre van en array aunque sea uno solo
                        const lookupValue: ComponentFramework.LookupValue[] = [singleLookup];
                        
                        formAttribute.setValue(lookupValue);
                        formAttribute.fireOnChange();  // importante para disparar logica del formulario
                        
                        console.log("Update successful via form attribute");
                        setCurrentSelection(item);
                        saveRecentItem(currentUserId, item);
                        setSearchQuery('');
                        setIsDropdownOpen(false);
                        return;
                    }
                }
                
                // Si no funciona el acceso al formulario, intentar con Web API
                const xrm = window.Xrm;
                if(xrm) {
                    const entitySet = item.etn === 'systemuser' ? 'systemusers' : 'teams';
                    const bindValue = `/${entitySet}(${item.id.guid})`;
                    
                    console.log("Fallback: Using Xrm.WebApi.updateRecord with @odata.bind", {
                        entityName,
                        currentRecordId,
                        fieldName,
                        entitySet,
                        bindValue
                    });
                    
                    const updateData: Record<string, string> = {};
                    updateData[`${fieldName}@odata.bind`] = bindValue;
                    
                    await xrm.WebApi.updateRecord(entityName, currentRecordId, updateData);
                    
                    console.log("Update successful via Xrm.WebApi");
                }
            } else {
                // Fallback: usar ComponentFramework WebAPI (puede no funcionar con polimorficos)
                const odataType = item.etn === 'systemuser' ? 'systemusers' : 'teams';
                const lookupAttributeName = `${fieldName}@odata.bind`;
                const bindValue = `/${odataType}(${item.id.guid})`;
                
                console.log("Fallback: using PCF WebAPI", {
                    lookupAttributeName,
                    bindValue
                });
                
                const updatePayload: Record<string, string> = {};
                updatePayload[lookupAttributeName] = bindValue;
                
                await webAPI.updateRecord(
                    entityName,
                    currentRecordId,
                    updatePayload as ComponentFramework.WebApi.Entity
                );
                
                console.log("Update successful via PCF WebAPI");
            }
            setCurrentSelection(item);
            saveRecentItem(currentUserId, item);
            setSearchQuery('');
            setIsDropdownOpen(false);

        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleClearSelection = async () => {
        if (!currentRecordId || !entityName || !fieldName) return;

        try {
            // Intentar usar el atributo del formulario directamente
            if (typeof window.Xrm !== 'undefined' && window.Xrm) {
                // eslint-disable-next-line @microsoft/power-apps/do-not-make-parent-assumption
                const parentWindow = window.parent as Window & { Xrm?: XrmGlobal };
                if (parentWindow?.Xrm?.Page) {
                    const formAttribute = parentWindow.Xrm.Page.getAttribute(fieldName);
                    
                    if (formAttribute) {
                        console.log("Using form attribute to clear field");
                        formAttribute.setValue(null);
                        formAttribute.fireOnChange();
                        setCurrentSelection(null);
                        return;
                    }
                }
                
                // Fallback: usar Web API
                const xrm = window.Xrm;
                if(xrm) {
                    const updateData: Record<string, null> = {};
                    updateData[fieldName] = null;
                    
                    await xrm.WebApi.updateRecord(entityName, currentRecordId, updateData);
                    console.log("Clear successful via Xrm");
                }
            } else {
                // Fallback: usar PCF WebAPI
                const updatePayload: Record<string, null> = {};
                updatePayload[`${fieldName}@odata.bind`] = null;
                
                await webAPI.updateRecord(
                    entityName,
                    currentRecordId,
                    updatePayload as ComponentFramework.WebApi.Entity
                );
                console.log("Clear successful via PCF WebAPI");
            }

            setCurrentSelection(null);
        } catch (error) {
            console.error("Clear error:", error);
        }
    };

    // Paleta de colores del componente
    // Usamos los colores de Fluent UI para mantener consistencia
    const primaryBgColor = '#EBF3FC';  // azul claro para items
    const hoverBgColor = '#CFE4FA';    // azul mas oscuro al hover
    const borderColor = '#ccc';         // gris para bordes
    const disabledBg = '#f4f4f4';       // fondo cuando esta deshabilitado
    
    const styles = {
        container: { fontFamily: 'Segoe UI, Segoe UI Web (West European), -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif', border: `1px solid ${borderColor}`, borderRadius: '4px', position: 'relative' as 'relative', backgroundColor: isDisabled ? disabledBg : 'transparent' },
        selectionContainer: { display: 'flex', alignItems: 'center', padding: '8px', minHeight: '40px' },
        pill: { display: 'flex', alignItems: 'center', backgroundColor: primaryBgColor, borderRadius: '4px', padding: '5px 10px', fontSize: '14px', transition: 'background-color 0.2s' },
        pillIcon: { marginRight: '5px', display: 'flex', alignItems: 'center', width: '16px', justifyContent: 'center' },
        removeButton: { marginLeft: '8px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', fontWeight: 'bold', padding: '0 4px', fontSize: '16px' },
        inputWrapper: { borderTop: '1px solid #eee', padding: '5px' },
        input: { border: 'none', outline: 'none', fontSize: '14px', padding: '4px', width: '90%', backgroundColor: isDisabled ? 'transparent' : 'inherit' },
        dropdown: { position: 'fixed' as 'fixed', top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px`, width: `${dropdownPosition.width}px`, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxHeight: '300px', zIndex: 2147483647, display: 'flex', flexDirection: 'column' as 'column' },
        tabsContainer: { display: 'flex', borderBottom: '1px solid #ccc', backgroundColor: '#f5f5f5', borderRadius: '4px 4px 0 0' },
        tab: { flex: 1, padding: '8px 12px', textAlign: 'center' as 'center', cursor: 'pointer', fontSize: '13px', fontWeight: '500', border: 'none', backgroundColor: 'transparent', transition: 'all 0.2s' },
        tabActive: { backgroundColor: 'white', borderBottom: '2px solid #115EA3', color: '#115EA3' },
        tabInactive: { color: '#666', backgroundColor: 'transparent' },
        resultsContainer: { overflowY: 'auto' as 'auto', maxHeight: '250px' },
        dropdownItem: { display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee', backgroundColor: '#EBF3FC', transition: 'background-color 0.2s', color: '#115EA3' },
        dropdownItemIcon: { marginRight: '8px', width: '16px', textAlign: 'center' as 'center' },
        placeholder: { color: '#666', fontSize: '14px' },
        noResults: { padding: '16px', textAlign: 'center' as 'center', color: '#666', fontSize: '14px' }
    }; 

    const showDropdown = isDropdownOpen;

    const renderDropdownIcon = (item: InternalEntityReference) => {
        if (item.isRecent) {
            return <RecentIcon />;
        }
        return item.etn === 'systemuser' ? <UserIcon /> : <TeamIcon />;
    };

    // si no hay contexto valido mostrar mensaje de error
    if (!hasValidContext) {
        return (
            <div style={{
                ...styles.container,
                padding: '12px',
                backgroundColor: '#FFF4CE',
                border: '1px solid #FFB900',
                color: '#323130'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <span style={{ fontSize: '13px' }}>
                        Please save the record before using this field.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container} ref={containerRef}>
            <div style={styles.selectionContainer}>
                {currentSelection ? (
                    <div 
                        style={styles.pill} 
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBgColor} 
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = primaryBgColor} 
                        title={currentSelection.etn === 'systemuser' ? currentSelection.email ?? currentSelection.name : currentSelection.description ?? currentSelection.name}
                    >
                        <span style={styles.pillIcon}>
                            {currentSelection.etn === 'systemuser' ? <UserIcon /> : <TeamIcon />}
                        </span>
                        <span style={{textDecoration: 'underline'}}>{currentSelection.name}</span>
                        {!isDisabled && (
                            <button 
                                style={styles.removeButton} 
                                onClick={e => { 
                                    e.stopPropagation(); 
                                    void handleClearSelection(); 
                                }} 
                            >×</button>
                        )}
                    </div>
                ) : (
                    !isDisabled && <span style={styles.placeholder}>No selection</span>
                )}
            </div>
            
            {!isDisabled && (
                <div 
                    style={styles.inputWrapper}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) {
                            setIsDropdownOpen(true);
                        }
                    }}
                >
                    <input 
                        type="text" 
                        style={styles.input} 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)} 
                        onFocus={() => { if (!isDisabled) setIsDropdownOpen(true); }}
                        disabled={isDisabled} 
                        placeholder="Search users or teams..."
                    />
                </div>
            )}
            
            {showDropdown && ReactDOM.createPortal(
                <div ref={dropdownRef} style={styles.dropdown}>
                    <div style={styles.tabsContainer}>
                        <button
                            style={{
                                ...styles.tab,
                                ...(activeTab === 'users' ? styles.tabActive : styles.tabInactive)
                            }}
                            onClick={() => setActiveTab('users')}
                        >
                            Users ({userResults.length})
                        </button>
                        <button
                            style={{
                                ...styles.tab,
                                ...(activeTab === 'teams' ? styles.tabActive : styles.tabInactive)
                            }}
                            onClick={() => setActiveTab('teams')}
                        >
                            Teams ({teamResults.length})
                        </button>
                    </div>
                    
                    <div style={styles.resultsContainer}>
                        {isLoading && <div style={styles.noResults}>Loading...</div>}
                        
                        {!isLoading && activeTab === 'users' && userResults.length === 0 && (
                            <div style={styles.noResults}>No users found</div>
                        )}
                        
                        {!isLoading && activeTab === 'teams' && teamResults.length === 0 && (
                            <div style={styles.noResults}>No teams found</div>
                        )}
                        
                        {!isLoading && activeTab === 'users' && userResults.map(item => (
                            <div 
                                key={item.id.guid} 
                                style={styles.dropdownItem} 
                                onClick={() => void handleSelectItem(item)} 
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBgColor} 
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = primaryBgColor} 
                                title={item.email ?? item.name}
                            >
                                <span style={styles.dropdownItemIcon}>{renderDropdownIcon(item)}</span>
                                <span style={{textDecoration: 'underline'}}>{item.name}</span>
                                {item.isRecent && <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#666' }}>Recent</span>}
                            </div>
                        ))}
                        
                        {!isLoading && activeTab === 'teams' && teamResults.map(item => (
                            <div 
                                key={item.id.guid} 
                                style={styles.dropdownItem} 
                                onClick={() => void handleSelectItem(item)} 
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBgColor} 
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = primaryBgColor} 
                                title={item.description ?? item.name}
                            >
                                <span style={styles.dropdownItemIcon}>{renderDropdownIcon(item)}</span>
                                <span style={{textDecoration: 'underline'}}>{item.name}</span>
                                {item.isRecent && <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#666' }}>Recent</span>}
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
