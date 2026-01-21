# Sincronización de Grupos de Seguridad y Equipos - Power Automate Flow

[![Power Automate](https://img.shields.io/badge/Power%20Automate-Flow-0066FF?style=flat-square&logo=powerautomate&logoColor=white)](https://powerautomate.microsoft.com/)
[![Dataverse](https://img.shields.io/badge/Dataverse-DB-0078D4?style=flat-square&logo=microsoftdataverse&logoColor=white)](https://www.microsoft.com/en-us/microsoft-dataverse)
[![Azure](https://img.shields.io/badge/Azure-Cloud-0078D4?style=flat-square&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

Un flujo de Power Automate diseñado para sincronizar automáticamente grupos de seguridad de Azure Active Directory con equipos (teams) en Microsoft Dataverse, permitiendo la gestión centralizada de permisos y roles de seguridad.

##  Índice

- [Descripción General](#-descripción-general)
- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Reference](#-api-reference)
- [Flujo de Trabajo](#-flujo-de-trabajo)
- [Códigos de Error](#-códigos-de-error)
- [Solución de Problemas](#-solución-de-problemas)
- [Mejores Prácticas](#-mejores-prácticas)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

##  Descripción General

Este flujo automatizado permite sincronizar grupos de seguridad de Azure Active Directory con equipos en Microsoft Dataverse, facilitando la administración de permisos y roles de seguridad de forma programática. El flujo es especialmente útil para:

- **Automatizar la creación** de equipos en Dataverse basados en grupos de Azure AD
- **Asignar roles de seguridad** automáticamente a los equipos creados
- **Gestionar permisos** de Canvas Apps para grupos de seguridad
- **Mantener sincronización** entre Azure AD y Dataverse
- **Implementar gobierno** de accesos en múltiples entornos

### Casos de Uso Típicos

1. **Onboarding automatizado**: Crear equipos y asignar permisos cuando se crea un nuevo grupo de seguridad
2. **Gestión de Canvas Apps**: Compartir automáticamente aplicaciones con grupos específicos
3. **Multi-tenancy**: Gestionar equipos y permisos en múltiples entornos desde un flujo centralizado
4. **Auditoría y Compliance**: Mantener trazabilidad de creación y eliminación de equipos

##  Características

###  Operaciones Soportadas

- **CREATE**: Crea un nuevo equipo en Dataverse vinculado a un grupo de Azure AD
  -  Validación de existencia previa del equipo
  -  Consulta de Business Unit por División
  -  Consulta y asignación de Rol de Seguridad
  -  Configuración de administrador del equipo
  -  Compartir Canvas Apps con el grupo (opcional)

- **DELETE**: Elimina un equipo existente en Dataverse
  -  Validación de existencia del equipo
  -  Eliminación de permisos de Canvas Apps
  -  Eliminación del equipo y sus asociaciones

###  Características de Seguridad

- **Autenticación OAuth 2.0**: Utiliza Client Credentials Flow para acceso seguro
- **Tokens de Acceso**: Gestión automática de tokens para APIs de Dataverse y Power Apps
- **Validaciones de Negocio**: Comprobaciones exhaustivas antes de operaciones críticas
- **Manejo de Errores**: Sistema robusto de códigos de error y respuestas HTTP

###  Capacidades Multi-Entorno

- **Detección Automática**: Identifica el entorno de la aplicación de forma dinámica
- **API Dinámica**: Construcción de URLs de API basada en el entorno objetivo
- **Conexiones Flexibles**: Uso de referencias de conexión configurables

###  Integración

- **Center of Excellence (CoE) Kit**: Integrado con el CoE Starter Kit de Microsoft
- **Dataverse API**: Acceso completo a la Web API de Dataverse
- **Power Apps API**: Gestión de permisos de Canvas Apps
- **Azure AD Groups**: Sincronización con grupos de seguridad de Azure

##  Requisitos Previos

### Componentes Necesarios

1. **Entorno Power Platform**
   - Licencia: Power Automate Premium o Per User
   - Permisos: Administrador del sistema o creador de flujos

2. **Center of Excellence (CoE) Starter Kit**
   - Versión mínima: 4.50.2
   - Componentes requeridos:
     - Tabla `admin_app` (PowerApps App)
     - Referencia de conexión `admin_CoECoreDataverseForApps`

3. **Registro de Aplicación en Azure AD**
   ```
   Permisos API requeridos:
   - Dynamics CRM: user_impersonation
   - PowerApps Service: User (Read)
   ```

4. **Credenciales de Servicio**
   - Application (Client) ID
   - Client Secret
   - Tenant ID

5. **Usuario Administrador de Equipos**
   - Usuario de servicio en Dataverse
   - Rol: Administrador del sistema
   - Formato: usuario@dominio.onmicrosoft.com

### Software y Herramientas

- **Power Platform CLI**: Para despliegue automatizado
  ```powershell
  pac install latest
  ```
- **Postman** (opcional): Para pruebas de la API HTTP
- **Azure Portal**: Para gestión de aplicaciones Azure AD

##  Arquitectura

### Diagrama de Componentes

```
[Diagrama de arquitectura aquí]
```

### Flujo de Datos

```
[Diagrama de flujo de datos aquí]
```

### Modelo de Datos

#### Entrada (Request Body)

```json
{
  "Action": "create | delete",
  "AppId": "guid-de-la-aplicacion",
  "SecurityGroupId": "guid-del-grupo-azure-ad",
  "SecurityGroupName": "prefix_businessunit_rolename"
}
```

#### Nomenclatura del SecurityGroupName

El nombre del grupo de seguridad sigue una convención estructurada:

```
<Prefix>_<BusinessUnitDivision>_<SecurityRoleName>

Ejemplo: APP_BU001_CanvasUser
- Prefix: APP
- Business Unit Division: BU001
- Security Role: CanvasUser
```

##  Instalación

### Opción 1: Importar Solución Desempaquetada

```powershell
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd "samples/Power Automate/GruposDeSeguridadYEquipos"

# 2. Conectar al entorno
pac auth create --url https://tuorganizacion.crm.dynamics.com

# 3. Empaquetar la solución
pac solution pack `
    --folder . `
    --zipfile ../GruposDeSeguridadYEquipos.zip `
    --packagetype Both

# 4. Importar la solución
pac solution import `
    --path ../GruposDeSeguridadYEquipos.zip `
    --async `
    --force-overwrite
```

### Opción 2: Importar desde el Portal

1. Navega al [Power Platform Admin Center](https://admin.powerplatform.microsoft.com/)
2. Selecciona tu entorno
3. Ve a **Soluciones** > **Importar solución**
4. Sube el archivo `.zip` de la solución
5. Configura las **referencias de conexión**:
   - `admin_CoECoreDataverseForApps`: Conexión a Dataverse

### Opción 3: Despliegue Automatizado con GitHub Actions

```yaml
# .github/workflows/deploy-sync-flow.yml
name: Deploy Security Groups Sync Flow

on:
  push:
    branches: [ main ]
    paths:
      - 'samples/Power Automate/GruposDeSeguridadYEquipos/**'

jobs:
  deploy:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Pack and Deploy Solution
        uses: microsoft/powerplatform-actions/pack-solution@v1
        with:
          solution-folder: samples/Power Automate/GruposDeSeguridadYEquipos
          solution-file: out/GruposDeSeguridadYEquipos.zip
          
      - name: Import Solution
        uses: microsoft/powerplatform-actions/import-solution@v1
        with:
          environment-url: ${{ secrets.ENV_URL }}
          user-name: ${{ secrets.PP_USER }}
          password-secret: ${{ secrets.PP_PASSWORD }}
          solution-file: out/GruposDeSeguridadYEquipos.zip
```

##  Configuración

### Paso 1: Crear Registro de Aplicación en Azure AD

```powershell
# Opción A: Mediante Azure Portal
# 1. Azure Portal > Azure Active Directory > App registrations > New registration
# 2. Name: "Dataverse-SecurityGroups-Sync"
# 3. Supported account types: Single tenant
# 4. Click Register

# Opción B: Mediante Azure CLI
az ad app create `
    --display-name "Dataverse-SecurityGroups-Sync" `
    --sign-in-audience AzureADMyOrg
```

#### Configurar Permisos de API

```powershell
# En Azure Portal:
# API permissions > Add a permission

# 1. Dynamics CRM
#    - Delegated: user_impersonation

# 2. PowerApps Service  
#    - Application: User (Read)

# 3. Grant admin consent
```

#### Crear Client Secret

```powershell
# Certificates & secrets > New client secret
# Description: "Flow Sync Secret"
# Expires: 24 months (recomendado)
# 
#  IMPORTANTE: Copiar el valor del secret INMEDIATAMENTE
```

### Paso 2: Configurar Variables en el Flujo

Edita el flujo importado y actualiza las siguientes variables:

```javascript
// En las acciones "Declarar_*"

// 1. Declarar_AppId
{
  "name": "CredentialsAppId",
  "value": "YOUR_APPLICATION_CLIENT_ID"  // Obtener de Azure AD App Registration
}

// 2. Declarar_Secret
{
  "name": "CredentialsSecret",
  "value": "YOUR_CLIENT_SECRET"  //  IMPORTANTE: Considera usar Azure Key Vault
}

// 3. Declarar_TenantId
{
  "name": "TenantId",
  "value": "YOUR_TENANT_ID"  // Obtener de Azure AD
}

// 4. Declarar_TeamAdminUser
{
  "name": "TeamAdminUser",
  "value": "serviceaccount@yourdomain.onmicrosoft.com"  // Usuario administrador de equipos
}
```

### Paso 3: Configurar Conexiones

```powershell
# En Power Automate Portal:
# 1. Abrir el flujo
# 2. Edit > Click en cada acción de Dataverse
# 3. Configurar conexión "admin_CoECoreDataverseForApps"
# 4. Save
```

### Paso 4: Crear Usuario de Aplicación en Dataverse

```powershell
# 1. Navegar a: https://tuorg.crm.dynamics.com
# 2. Settings (gear icon) > Advanced Settings
# 3. Settings > Security > Users
# 4. Switch view to "Application Users"
# 5. New > Application User
# 6. Application ID: <Tu Application ID de Azure AD>
# 7. Assign Security Role: "System Administrator" (o rol personalizado)
```

### Paso 5: Configurar Center of Excellence (CoE) Kit

Si no tienes el CoE Kit instalado:

```powershell
# Descargar CoE Starter Kit
# https://aka.ms/CoEStarterKitDownload

# Importar solución "Core Components"
pac solution import --path CenterofExcellenceCoreComponents_x_x_x_x_managed.zip
```

### Paso 6: Activar el Flujo

```powershell
# En Power Automate Portal:
# 1. My flows > Cloud flows
# 2. Buscar "Sincronizacion Grupos De Seguridad Y Equipos"
# 3. Turn on
```

##  Uso

### Invocar el Flujo - Operación CREATE

#### Ejemplo con Postman

```http
POST {{FlowURL}}
Content-Type: application/json

{
  "Action": "create",
  "AppId": "12345678-1234-1234-1234-123456789abc",
  "SecurityGroupId": "87654321-4321-4321-4321-abcdef123456",
  "SecurityGroupName": "APP_BU_SalesManager"
}
```

#### Ejemplo con PowerShell

```powershell
$flowUrl = "https://prod-xx.westeurope.logic.azure.com/workflows/.../triggers/manual/paths/invoke..."

$body = @{
    Action = "create"
    AppId = "12345678-1234-1234-1234-123456789abc"
    SecurityGroupId = "87654321-4321-4321-4321-abcdef123456"
    SecurityGroupName = "APP_BU_SalesManager"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri $flowUrl `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

#### Ejemplo con cURL

```bash
curl -X POST "{{FlowURL}}" \
  -H "Content-Type: application/json" \
  -d '{
    "Action": "create",
    "AppId": "12345678-1234-1234-1234-123456789abc",
    "SecurityGroupId": "87654321-4321-4321-4321-abcdef123456",
    "SecurityGroupName": "APP_BU_SalesManager"
  }'
```

### Invocar el Flujo - Operación DELETE

```json
{
  "Action": "delete",
  "AppId": "12345678-1234-1234-1234-123456789abc",
  "SecurityGroupId": "87654321-4321-4321-4321-abcdef123456",
  "SecurityGroupName": "APP_BU_SalesManager"
}
```

### Integración desde Power Automate

```yaml
# Desde otro flujo de Power Automate
Action: HTTP
  Method: POST
  URI: {{URL del flujo de sincronización}}
  Headers:
    Content-Type: application/json
  Body:
    {
      "Action": "create",
      "AppId": "@{outputs('Get_App_Id')}",
      "SecurityGroupId": "@{triggerBody()['GroupId']}",
      "SecurityGroupName": "@{triggerBody()['GroupName']}"
    }
```

### Integración desde Logic Apps

```json
{
  "type": "Http",
  "inputs": {
    "method": "POST",
    "uri": "{{FlowURL}}",
    "body": {
      "Action": "create",
      "AppId": "@{variables('AppId')}",
      "SecurityGroupId": "@{triggerBody()['GroupId']}",
      "SecurityGroupName": "APP_@{variables('BU')}_@{variables('Role')}"
    }
  }
}
```

##  API Reference

### HTTP Trigger Endpoint

```
POST https://prod-{region}.logic.azure.com/workflows/{workflow-id}/triggers/manual/paths/invoke
```

### Request Schema

| Campo | Tipo | Requerido | Descripción | Validación |
|-------|------|-----------|-------------|------------|
| `Action` | string |  | Operación a realizar | Enum: `create`, `delete` |
| `AppId` | string |  | GUID de la aplicación | Formato GUID |
| `SecurityGroupId` | string | * | GUID del grupo de Azure AD | Formato GUID, requerido para CREATE |
| `SecurityGroupName` | string |  | Nombre del grupo con formato específico | Pattern: `*_*_*` |

*Nota: `SecurityGroupId` es requerido para la operación CREATE

### Response Schema

#### Success Response (200 OK)

```json
{
  "statusCode": 200,
  "body": null
}
```

#### Error Response (200 OK con Error Code en Header)

```json
{
  "statusCode": 200,
  "headers": {
    "ErrorCode": "1001_TeamAlreadyExists"
  },
  "body": "CREATE OPERATION FAILED: Team associated to APP_BU_SalesManager Security Group already exists with name APP_BU_SalesManager"
}
```

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200` | Request procesada (puede contener error de negocio en body) |
| `400` | Request inválida (schema incorrecto) |
| `500` | Error interno del flujo |

##  Flujo de Trabajo

### Operación CREATE - Diagrama Detallado

```
[Diagrama detallado de operación CREATE aquí]
```

### Operación DELETE - Diagrama Detallado

```
[Diagrama detallado de operación DELETE aquí]
```

##  Códigos de Error

| Código | Descripción | Acción Sugerida |
|--------|-------------|-----------------|
| `1001_TeamAlreadyExists` | El equipo asociado al grupo de seguridad ya existe | Verificar si es una operación duplicada. Si el equipo debe existir, ignorar el error. |
| `1002_TeamDoesntExists` | El equipo que se intenta eliminar no existe | Verificar el nombre del grupo. Puede haberse eliminado manualmente. |
| `1003_BUNotExists` | La Business Unit con la división especificada no existe | Revisar el segundo segmento del SecurityGroupName. Crear la BU si es necesaria. |
| `1004_RoleNotExists` | El rol de seguridad especificado no existe en la BU | Revisar el tercer segmento del SecurityGroupName. Verificar que el rol exista en esa BU. |

### Respuestas de Error Detalladas

#### Error 1001 - Team Already Exists

```http
HTTP/1.1 200 OK
ErrorCode: 1001_TeamAlreadyExists
Content-Type: application/json

"CREATE OPERATION FAILED: Team associated to APP_BU_SalesManager Security Group already exists with name APP_BU_SalesManager"
```

**Causas Comunes:**
- Ejecución duplicada del flujo
- El equipo se creó manualmente previamente
- Error en lógica de validación de existencia previa

**Resolución:**
```powershell
# Opción 1: Eliminar el equipo existente (si es apropiado)
# Power Platform Admin Center > Environments > Settings > Users + permissions > Teams

# Opción 2: Modificar el nombre del grupo de seguridad
# Azure Portal > Azure AD > Groups > Rename group

# Opción 3: Ignorar el error si el equipo ya debe existir
```

#### Error 1002 - Team Doesn't Exist

```http
HTTP/1.1 200 OK
ErrorCode: 1002_TeamDoesntExists
Content-Type: application/json

"DELETE OPERATION FAILED: Team with name APP_BU_SalesManager does not exists"
```

**Causas Comunes:**
- El equipo ya fue eliminado
- Nombre incorrecto del grupo
- El equipo nunca se creó

**Resolución:**
```powershell
# Verificar equipos existentes
GET {{DataverseURL}}/api/data/v9.2/teams$filter=contains(name,'APP_BU')
Authorization: Bearer {{AccessToken}}
```

#### Error 1003 - Business Unit Not Exists

```http
HTTP/1.1 200 OK
ErrorCode: 1003_BUNotExists
Content-Type: application/json

"CREATE OPERATION FAILED: Business Unit with Division: BU001 does not exists"
```

**Causas Comunes:**
- División incorrecta en el nombre del grupo
- Business Unit no creada en el entorno objetivo
- BU deshabilitada

**Resolución:**
```powershell
# Listar Business Units disponibles
GET {{DataverseURL}}/api/data/v9.2/businessunits$select=name,divisionname&$filter=isdisabled eq false

# Si la BU debe existir, crearla primero
```

#### Error 1004 - Security Role Not Exists

```http
HTTP/1.1 200 OK
ErrorCode: 1004_RoleNotExists
Content-Type: application/json

"CREATE OPERATION FAILED: Security Role: SalesManager does not exists"
```

**Causas Comunes:**
- Rol no existe en la Business Unit especificada
- Nombre del rol incorrecto
- Rol no copiado a la BU child

**Resolución:**
```powershell
# Listar roles en la Business Unit
GET {{DataverseURL}}/api/data/v9.2/roles$select=name&$filter=businessunitid/businessunitid eq {{BUId}}

# Crear/copiar el rol si es necesario
# Settings > Security > Security Roles > Copy Role to Business Unit
```

##  Solución de Problemas

### Problema: "Unauthorized" al invocar el flujo

**Síntomas:**
```json
{
  "error": {
    "code": "Unauthorized",
    "message": "The request authorization is missing or invalid"
  }
}
```

**Solución:**
1. Verificar que el flujo tenga trigger type `HTTP` con `All` como authentication type
2. Usar la URL completa del flujo incluyendo el `sig` parameter
3. No agregar headers de autenticación adicionales si el flujo es público

### Problema: "Invalid token" en acceso a Dataverse

**Síntomas:**
```json
{
  "error": {
    "code": "0x80040217",
    "message": "Principal user is missing"
  }
}
```

**Solución:**
```powershell
# 1. Verificar que el usuario de aplicación existe en Dataverse
# Dataverse > Settings > Security > Users > Application Users

# 2. Verificar que el Application ID coincide
# Azure AD App Registration Application (client) ID

# 3. Verificar permisos del usuario de aplicación
# Debe tener rol "System Administrator" o permisos suficientes

# 4. Re-generar access token
# Puede haber expirado (tiempo de vida típico: 1 hora)
```

### Problema: El flujo no encuentra la aplicación (AppId)

**Síntomas:**
```
"No s'ha trobat l'aplicació: {AppId}"
```

**Solución:**
```powershell
# 1. Verificar que el CoE Kit está instalado
Get-AdminPowerApp | Where-Object {$_.AppName -eq $AppId}

# 2. Verificar que la app está en la tabla admin_apps
GET {{DataverseURL}}/api/data/v9.2/admin_apps$filter=admin_appidstring eq '{AppId}'

# 3. Ejecutar inventario del CoE Kit si la app no aparece
# Flujo: "Admin | Sync Template v4"
```

### Problema: Business Unit query devuelve resultados vacíos

**Síntomas:**
```
"CREATE OPERATION FAILED: Business Unit with Division: BU001 does not exists"
```

**Solución:**
```powershell
# 1. Verificar convención de nomenclatura
# División debe coincidir exactamente con el campo divisionname

# 2. Listar divisiones disponibles
GET {{DataverseURL}}/api/data/v9.2/businessunits$select=name,divisionname,isdisabled

# 3. Verificar que la BU no está deshabilitada
# isdisabled debe ser false

# 4. Ajustar la query si usas un campo diferente
# Modificar: divisionname eq '{businessUnitId}'
# Por: name eq '{businessUnitId}' (o el campo apropiado)
```

### Problema: No se comparte la Canvas App con el grupo

**Síntomas:**
- El equipo se crea correctamente
- El rol se asigna correctamente
- Pero los miembros del grupo no tienen acceso a la Canvas App

**Solución:**
```powershell
# 1. Verificar que el AppId corresponde a una Canvas App
GET {{DataverseURL}}/api/data/v9.2/canvasapps({AppId})

# 2. Verificar que el flujo tiene permisos para compartir apps
# El usuario de aplicación debe tener permisos en PowerApps Service API

# 3. Compartir manualmente para validar
POST https://api.powerapps.com/providers/Microsoft.PowerApps/apps/{AppId}/permissions
Authorization: Bearer {{AccessToken}}
Content-Type: application/json

{
  "put": [{
    "properties": {
      "principal": {
        "id": "{SecurityGroupId}",
        "type": "Group",
        "tenantId": "{TenantId}"
      },
      "roleName": "CanView"
    }
  }]
}

# 4. Revisar la sección "Si_AppId_es_CanvasApp,_dar_acceso_al_grupo"
# Puede requerir ajustes según tu escenario
```

### Problema: Timeout en creación de equipo

**Síntomas:**
```
"Flow run timed out. The flow exceeded the timeout limit of 30 days."
```

**Solución:**
```powershell
# 1. Revisar acciones HTTP que puedan estar bloqueadas
# - Firewall rules
# - IP restrictions
# - Network connectivity

# 2. Agregar timeout a acciones HTTP
# En el JSON de la acción HTTP:
{
  "inputs": {
    "method": "POST",
    "uri": "...",
    "retryPolicy": {
      "type": "fixed",
      "count": 3,
      "interval": "PT10S"
    }
  },
  "operationOptions": "DisableAsyncPattern"
}

# 3. Dividir operaciones pesadas en múltiples pasos
```

##  Mejores Prácticas

### Seguridad

#### 1. Gestión de Secretos

```powershell
#  MAL - Hardcodear secretos en el flujo
"CredentialsSecret": "YOUR_CLIENT_SECRET_HERE"

#  BIEN - Usar Azure Key Vault
# Crear acción HTTP para obtener secret
GET https://{keyvault-name}.vault.azure.net/secrets/{secret-name}api-version=7.3
Authorization: Bearer @{variables('KeyVaultToken')}

# Usar el output en lugar del valor hardcodeado
"CredentialsSecret": "@{body('Get_Secret_from_KeyVault')['value']}"
```

#### 2. Principio de Mínimos Privilegios

```powershell
# Crear rol de seguridad personalizado con permisos específicos
# En lugar de System Administrator

# Permisos mínimos necesarios:
# - Team: Create, Read, Write, Delete, Append, Append To
# - Role: Read, Append
# - Business Unit: Read
# - System User: Read
# - Canvas App: Read (si aplica)
```

#### 3. Auditoría y Logging

```javascript
// Agregar acciones de logging al inicio y fin del flujo

// Al inicio
{
  "type": "Compose",
  "inputs": {
    "timestamp": "@utcNow()",
    "action": "@triggerBody()['Action']",
    "appId": "@triggerBody()['AppId']",
    "groupName": "@triggerBody()['SecurityGroupName']",
    "correlationId": "@workflow()['run']['name']"
  }
}

// Enviar log a Application Insights, Log Analytics o tabla Dataverse
```

### Rendimiento

#### 1. Caching de Tokens

```javascript
// Evitar múltiples llamadas para obtener tokens
// Considerar almacenar token en variable y reutilizar si no ha expirado

// Agregar validación de expiración
{
  "type": "If",
  "expression": {
    "or": [
      {
        "equals": ["@variables('AccessToken')", ""]
      },
      {
        "less": [
          "@variables('TokenExpiry')",
          "@utcNow()"
        ]
      }
    ]
  },
  "actions": {
    "Obtener_Nuevo_Token": { /* ... */ }
  }
}
```

#### 2. Consultas Optimizadas

```javascript
//  MAL - Obtener todos los campos
GET /api/data/v9.2/teams

//  BIEN - Seleccionar solo campos necesarios
GET /api/data/v9.2/teams$select=teamid,name&$filter=azureactivedirectoryobjectid eq '{guid}'
```

#### 3. Procesamiento Paralelo

Si necesitas procesar múltiples operaciones, considera usar acciones paralelas:

```javascript
// Usar Scope y configurar como paralelas
{
  "type": "Scope",
  "actions": {
    "Parallel_Branch_1": { /* ... */ },
    "Parallel_Branch_2": { /* ... */ }
  },
  "runAfter": {},
  "operationOptions": "Parallel"
}
```

### Mantenibilidad

#### 1. Nombres Descriptivos

```javascript
//  MAL
"Action_1": { /* ... */ }

//  BIEN
"Obtener_Business_Unit_Por_Division": { /* ... */ }
```

#### 2. Uso de Scope para Agrupación Lógica

```javascript
// Agrupar acciones relacionadas en Scopes
{
  "type": "Scope",
  "name": "Consultas_Previas_a_la_Creacion_del_Equipo",
  "actions": {
    "Obtener_Business_Unit": { /* ... */ },
    "Obtener_RolSeguridad": { /* ... */ },
    "Obtener_Administrador_del_Equipo": { /* ... */ }
  }
}
```

#### 3. Documentación en Comments

```javascript
// Agregar anotaciones en acciones complejas
{
  "type": "Http",
  "metadata": {
    "operationMetadataId": "...",
    "comment": "Obtiene el Business Unit filtrando por el campo divisionname extraído del SecurityGroupName. El formato esperado es PREFIX_DIVISION_ROLE."
  }
}
```

### Escalabilidad

#### 1. Parametrización

Convertir valores hardcodeados en variables de entorno:

```javascript
// Usar Environment Variables en lugar de valores fijos
"TeamAdminUser": "@{parameters('EnvVar_TeamAdminUser')}"
"CredentialsAppId": "@{parameters('EnvVar_AppId')}"
```

#### 2. Gestión de Límites

```javascript
// Power Automate tiene límites de:
// - Acciones por flujo: 500
// - Duración de ejecución: 30 días
// - Tamaño de inputs/outputs: 100 MB

// Para operaciones masivas, considera:
// - Dividir en múltiples flujos child
// - Usar batching
// - Implementar pagination si consultas grandes volúmenes
```

#### 3. Retry Policy

```javascript
// Configurar reintentos en acciones HTTP críticas
{
  "type": "Http",
  "inputs": {
    "method": "POST",
    "uri": "...",
    "retryPolicy": {
      "type": "exponential",
      "count": 4,
      "interval": "PT10S",
      "minimumInterval": "PT5S",
      "maximumInterval": "PT1H"
    }
  }
}
```

##  Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

### Guía de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu característica (`git checkout -b feature/MejoraSincronizacion`)
3. **Commit** tus cambios (`git commit -m 'feat: Agregar soporte para Teams privados'`)
4. **Push** a la rama (`git push origin feature/MejoraSincronizacion`)
5. **Abre** un Pull Request

### Estándares de Código

- Usar nombres descriptivos en español para acciones y variables
- Documentar todas las acciones HTTP con metadata apropiada
- Incluir manejo de errores para todos los casos conocidos
- Agregar comentarios para lógica compleja
- Seguir el patrón de Scope para agrupación lógica

### Testing

Antes de enviar un PR, prueba los siguientes escenarios:

```powershell
# 1. CREATE - Happy Path
POST {{FlowURL}}
Body: { "Action": "create", "AppId": "...", "SecurityGroupId": "...", "SecurityGroupName": "TEST_BU_Role" }

# 2. CREATE - Team Already Exists
# Ejecutar dos veces el mismo request

# 3. CREATE - Business Unit Not Found
Body: { "Action": "create", "SecurityGroupName": "TEST_INVALID_Role" }

# 4. CREATE - Security Role Not Found
Body: { "Action": "create", "SecurityGroupName": "TEST_BU_InvalidRole" }

# 5. DELETE - Happy Path
Body: { "Action": "delete", "AppId": "...", "SecurityGroupName": "TEST_BU_Role" }

# 6. DELETE - Team Doesn't Exist
# Ejecutar dos veces el mismo request DELETE
```

##  Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](../../../LICENSE) para más detalles.

##  Autores

**Alejandro Caravantes Molina**
- LinkedIn: [https://www.linkedin.com/in/acaravantesmolina/](https://www.linkedin.com/in/acaravantesmolina/)
- Blog: [https://acaravantes.wixsite.com/misitio](https://acaravantes.wixsite.com/misitio)
- Email: acaravantes@gmail.com

##  Agradecimientos

- **Microsoft Power Platform Team**: Por el increíble ecosistema de Power Automate
- **Center of Excellence (CoE) Team**: Por el CoE Starter Kit que inspiró este componente
- **Community**: Por feedback y contribuciones continuas

##  Recursos Adicionales

### Documentación Oficial

- [Power Automate Documentation](https://docs.microsoft.com/power-automate/)
- [Dataverse Web API Reference](https://docs.microsoft.com/power-apps/developer/data-platform/webapi/reference/about)
- [Microsoft Graph API - Groups](https://docs.microsoft.com/graph/api/resources/group)
- [Azure AD Application Registration](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)
- [Center of Excellence Starter Kit](https://aka.ms/CoEStarterKit)

### Artículos Relacionados

- [Invocar API de Dataverse con OAuth](../../../technical-articles/invocar-api-dataverse.md)
- [Business Events en Dataverse](../../../technical-articles/business-events-en-dataverse.md)
- [Azure Key Vault para Securizar Environment Variables](../../../technical-articles/azure-key-vault-para-securizar-environment-variables.md)
- [Exponer Flujos de Power Automate detrás de API Management](../../../technical-articles/exponer-flujos-de-power-automate-detras-de-api-management.md)

### Herramientas Útiles

- [Postman](https://www.postman.com/): Para testing de APIs
- [XrmToolBox](https://www.xrmtoolbox.com/): Herramientas para Dataverse
- [Power Platform CLI](https://aka.ms/PowerPlatformCLI): Automatización de despliegues
- [Dataverse REST Builder](https://github.com/GuidoPreite/DRB): Construcción de queries OData

##  Soporte

Si encuentras algún problema o tienes preguntas:

-  **Issues**: [Reportar un bug](../../../../issues)
-  **Discussions**: [Hacer una pregunta o sugerencia](../../../../discussions)
-  **Email**: acaravantes@gmail.com
-  **LinkedIn**: [Contactar por LinkedIn](https://www.linkedin.com/in/acaravantesmolina/)

**Desarrollado con  usando Power Platform**

![Power Automate](https://img.shields.io/badge/Power%20Automate-0066FFstyle=for-the-badge&logo=powerautomate&logoColor=white)
![Dataverse](https://img.shields.io/badge/Dataverse-742774style=for-the-badge&logo=microsoft&logoColor=white)
![Azure AD](https://img.shields.io/badge/Azure%20AD-0078D4style=for-the-badge&logo=microsoftazure&logoColor=white)

---

> **Nota**: Este flujo es parte de un ecosistema más amplio de automatizaciones para Power Platform. Visita la [carpeta de samples](../) para más componentes relacionados.
