# AssignBusinessUnitFromTeamPlugin

## Descripción
Plugin de Dataverse que gestiona automáticamente la asignación de Business Unit (BU) a usuarios según su pertenencia a equipos de tipo **Grupo de Seguridad de Entra ID**.

## Funcionalidad

### Al ASOCIAR un usuario a un equipo (mensaje Associate):
1. Verifica si el equipo es de tipo "Grupo de Seguridad de Entra ID" (teamtype = 2)
2. Si es de este tipo, asigna la BU del equipo al usuario
3. Si no es de este tipo, no realiza ninguna acción

### Al DESASOCIAR un usuario de un equipo (mensaje Disassociate):
1. Verifica si el equipo es de tipo "Grupo de Seguridad de Entra ID" (teamtype = 2)
2. Si es de este tipo, asigna la BU raíz de la organización al usuario
3. Si no es de este tipo, no realiza ninguna acción

## ¿Qué es un Grupo de Seguridad de Entra ID?

En Dataverse, los equipos pueden ser de diferentes tipos:
- **Owner (0)**: Equipo propietario
- **Access (1)**: Equipo de acceso
- **AAD Security Group (2)**: Grupo de Seguridad de Azure Active Directory (Entra ID) ? **Este plugin solo actúa sobre este tipo**
- **AAD Office Group (3)**: Grupo de Office 365

El plugin **SOLO** procesa equipos de tipo **AAD Security Group (teamtype = 2)**.

## Configuración del Registro del Plugin

### Información del Registro

Necesitas registrar **DOS steps** para este plugin:

#### Step 1: Associate
- **Entidad**: `team`
- **Mensaje**: `Associate`
- **Relación**: `teammembership_association`
- **Etapa de Ejecución**: `PostOperation`
- **Modo de Ejecución**: `Asynchronous` (recomendado)
- **Orden de Ejecución**: 1

#### Step 2: Disassociate
- **Entidad**: `team`
- **Mensaje**: `Disassociate`
- **Relación
