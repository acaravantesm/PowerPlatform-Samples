# Security Groups and Teams Synchronization - Power Automate Flow

> **Read this in other languages**: [en English](README.en.md) | [es Español](README.md)

[![Power Automate](https://img.shields.io/badge/Power%20Automate-Flow-0066FF?style=flat-square&logo=powerautomate&logoColor=white)](https://powerautomate.microsoft.com/)
[![Dataverse](https://img.shields.io/badge/Dataverse-DV-green?style=flat-square&logo=microsoftdataverse&logoColor=white)](https://www.microsoft.com/en-us/microsoft-dataverse)
[![Azure](https://img.shields.io/badge/Azure-Cloud-0078D4?style=flat-square&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Language](https://img.shields.io/badge/lang-en-blue?style=flat-square)](README.en.md)
[![Language](https://img.shields.io/badge/lang-es-red?style=flat-square)](README.md)

A Power Automate flow designed to automatically synchronize Azure Active Directory security groups with teams in Microsoft Dataverse, enabling centralized management of permissions and security roles.

## ?? Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Workflow](#-workflow)
- [Error Codes](#-error-codes)
- [Troubleshooting](#-troubleshooting)
- [Best Practices](#-best-practices)
- [Contributing](#-contributing)
- [License](#-license)

## ?? Overview

This automated flow enables synchronization of Azure Active Directory security groups with teams in Microsoft Dataverse, facilitating programmatic administration of permissions and security roles. The flow is especially useful for:

- **Automate team creation** in Dataverse based on Azure AD groups
- **Automatically assign security roles** to created teams
- **Manage Canvas App permissions** for security groups
- **Maintain synchronization** between Azure AD and Dataverse
- **Implement governance** of access across multiple environments

### Typical Use Cases

1. **Automated Onboarding**: Create teams and assign permissions when a new security group is created
2. **Canvas App Management**: Automatically share applications with specific groups
3. **Multi-tenancy**: Manage teams and permissions across multiple environments from a centralized flow
4. **Audit and Compliance**: Maintain traceability of team creation and deletion

## ? Features

### ?? Supported Operations

- **CREATE**: Creates a new team in Dataverse linked to an Azure AD group
  - ? Pre-existence validation of the team
  - ? Business Unit query by Division
  - ? Security Role query and assignment
  - ? Team administrator configuration
  - ? Share Canvas Apps with the group (optional)

- **DELETE**: Deletes an existing team in Dataverse
  - ? Team existence validation
  - ? Canvas App permissions removal
  - ? Team and associations deletion

### ?? Security Features

- **OAuth 2.0 Authentication**: Uses Client Credentials Flow for secure access
- **Access Tokens**: Automatic token management for Dataverse and Power Apps APIs
- **Business Validations**: Exhaustive checks before critical operations
- **Error Handling**: Robust system of error codes and HTTP responses

### ?? Multi-Environment Capabilities

- **Automatic Detection**: Identifies the application environment dynamically
- **Dynamic API**: API URL construction based on target environment
- **Flexible Connections**: Use of configurable connection references

### ?? Integration

- **Center of Excellence (CoE) Kit**: Integrated with Microsoft's CoE Starter Kit
- **Dataverse API**: Full access to Dataverse Web API
- **Power Apps API**: Canvas App permissions management
- **Azure AD Groups**: Synchronization with Azure security groups

## ?? Prerequisites

### Required Components

1. **Power Platform Environment**
   - License: Power Automate Premium or Per User
   - Permissions: System Administrator or flow creator

2. **Center of Excellence (CoE) Starter Kit**
   - Minimum version: 4.50.2
   - Required components:
     - `admin_app` table (PowerApps App)
     - `admin_CoECoreDataverseForApps` connection reference

3. **Azure AD Application Registration**
   ```
   Required API Permissions:
   - Dynamics CRM: user_impersonation
   - PowerApps Service: User (Read)
   ```

4. **Service Credentials**
   - Application (Client) ID
   - Client Secret
   - Tenant ID

5. **Team Administrator User**
   - Service user in Dataverse
   - Role: System Administrator
   - Format: user@domain.onmicrosoft.com

### Software and Tools

- **Power Platform CLI**: For automated deployment
  ```powershell
  pac install latest
  ```
- **Postman** (optional): For HTTP API testing
- **Azure Portal**: For Azure AD application management

## ??? Architecture

### Component Diagram

```
?????????????????????????????????????????????????????
?          External System / Scheduler              ?
?         (HTTP POST Request Trigger)               ?
?????????????????????????????????????????????????????
                   ?
                   ?
?????????????????????????????????????????????????????
?          Power Automate Flow (Main)               ?
?  ???????????????????????????????????????????????  ?
?  ?  1. Get App Environment                     ?  ?
?  ?     - Query admin_app table (CoE Kit)      ?  ?
?  ?     - Extract Dataverse environment URL    ?  ?
?  ???????????????????????????????????????????????  ?
?  ???????????????????????????????????????????????  ?
?  ?  2. Variable Initialization                 ?  ?
?  ?     - Target Environment URL               ?  ?
?  ?     - Business Unit ID (from group name)   ?  ?
?  ?     - Security Role Name (from group name) ?  ?
?  ?     - Credentials (App ID, Secret, Tenant) ?  ?
?  ???????????????????????????????????????????????  ?
?  ???????????????????????????????????????????????  ?
?  ?  3. Get Access Token                        ?  ?
?  ?     - POST to login.microsoftonline.com    ?  ?
?  ?     - Client Credentials Flow (OAuth 2.0)  ?  ?
?  ???????????????????????????????????????????????  ?
?  ???????????????????????????????????????????????  ?
?  ?  4. Switch by Action (CREATE / DELETE)     ?  ?
?  ???????????????????????????????????????????????  ?
?????????????????????????????????????????????????????
                   ?
        ???????????????????????
        ?                     ?
????????????????      ????????????????
? CREATE       ?      ? DELETE       ?
? BRANCH       ?      ? BRANCH       ?
????????????????      ????????????????
? 1. Validate  ?      ? 1. Find      ?
?    team      ?      ?    existing  ?
?    doesn't   ?      ?    team      ?
?    exist     ?      ? 2. Validate  ?
? 2. Get       ?      ?    exists    ?
?    Business  ?      ? 3. Remove    ?
?    Unit      ?      ?    Canvas    ?
? 3. Get       ?      ?    App       ?
?    Security  ?      ?    perms     ?
?    Role      ?      ? 4. Delete    ?
? 4. Get Admin ?      ?    team      ?
?    User      ?      ????????????????
? 5. Create    ?
?    Team      ?
? 6. Associate ?
?    Role      ?
? 7. Share     ?
?    Canvas    ?
?    App       ?
????????????????
```

### Data Model

#### Input (Request Body)

```json
{
  "Action": "create | delete",
  "AppId": "application-guid",
  "SecurityGroupId": "azure-ad-group-guid",
  "SecurityGroupName": "prefix_businessunit_rolename"
}
```

#### SecurityGroupName Naming Convention

The security group name follows a structured convention:

```
<Prefix>_<BusinessUnitDivision>_<SecurityRoleName>

Example: APP_BU001_CanvasUser
- Prefix: APP
- Business Unit Division: BU001
- Security Role: CanvasUser
```

## ?? Installation

### Option 1: Import Unpacked Solution

```powershell
# 1. Clone the repository
git clone <repository-url>
cd "samples/Power Automate/GruposDeSeguridadYEquipos"

# 2. Connect to the environment
pac auth create --url https://yourorganization.crm.dynamics.com

# 3. Pack the solution
pac solution pack `
    --folder . `
    --zipfile ../GruposDeSeguridadYEquipos.zip `
    --packagetype Both

# 4. Import the solution
pac solution import `
    --path ../GruposDeSeguridadYEquipos.zip `
    --async `
    --force-overwrite
```

### Option 2: Import from Portal

1. Navigate to [Power Platform Admin Center](https://admin.powerplatform.microsoft.com/)
2. Select your environment
3. Go to **Solutions** > **Import solution**
4. Upload the solution `.zip` file
5. Configure **connection references**:
   - `admin_CoECoreDataverseForApps`: Dataverse connection

### Option 3: Automated Deployment with GitHub Actions

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

## ?? Configuration

### Step 1: Create Azure AD Application Registration

```powershell
# Option A: Via Azure Portal
# 1. Azure Portal > Azure Active Directory > App registrations > New registration
# 2. Name: "Dataverse-SecurityGroups-Sync"
# 3. Supported account types: Single tenant
# 4. Click Register

# Option B: Via Azure CLI
az ad app create `
    --display-name "Dataverse-SecurityGroups-Sync" `
    --sign-in-audience AzureADMyOrg
```

#### Configure API Permissions

```powershell
# In Azure Portal:
# API permissions > Add a permission

# 1. Dynamics CRM
#    - Delegated: user_impersonation

# 2. PowerApps Service  
#    - Application: User (Read)

# 3. Grant admin consent
```

#### Create Client Secret

```powershell
# Certificates & secrets > New client secret
# Description: "Flow Sync Secret"
# Expires: 24 months (recommended)
# 
# ?? IMPORTANT: Copy the secret value IMMEDIATELY
```

### Step 2: Configure Variables in the Flow

Edit the imported flow and update the following variables:

```javascript
// In the "Declarar_*" actions

// 1. Declarar_AppId
{
  "name": "CredentialsAppId",
  "value": "YOUR_APPLICATION_CLIENT_ID"  // Get from Azure AD App Registration
}

// 2. Declarar_Secret
{
  "name": "CredentialsSecret",
  "value": "YOUR_CLIENT_SECRET"  // ?? IMPORTANT: Consider using Azure Key Vault
}

// 3. Declarar_TenantId
{
  "name": "TenantId",
  "value": "YOUR_TENANT_ID"  // Get from Azure AD
}

// 4. Declarar_TeamAdminUser
{
  "name": "TeamAdminUser",
  "value": "serviceaccount@yourdomain.onmicrosoft.com"  // Team administrator user
}
```

### Step 3: Configure Connections

```powershell
# In Power Automate Portal:
# 1. Open the flow
# 2. Edit > Click on each Dataverse action
# 3. Configure "admin_CoECoreDataverseForApps" connection
# 4. Save
```

### Step 4: Create Application User in Dataverse

```powershell
# 1. Navigate to: https://yourorg.crm.dynamics.com
# 2. Settings (gear icon) > Advanced Settings
# 3. Settings > Security > Users
# 4. Switch view to "Application Users"
# 5. New > Application User
# 6. Application ID: <Your Azure AD Application ID>
# 7. Assign Security Role: "System Administrator" (or custom role)
```

### Step 5: Configure Center of Excellence (CoE) Kit

If you don't have the CoE Kit installed:

```powershell
# Download CoE Starter Kit
# https://aka.ms/CoEStarterKitDownload

# Import "Core Components" solution
pac solution import --path CenterofExcellenceCoreComponents_x_x_x_x_managed.zip
```

### Step 6: Activate the Flow

```powershell
# In Power Automate Portal:
# 1. My flows > Cloud flows
# 2. Search "Sincronizacion Grupos De Seguridad Y Equipos"
# 3. Turn on
```

## ?? Usage

### Invoke the Flow - CREATE Operation

#### Example with Postman

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

#### Example with PowerShell

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

#### Example with cURL

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

### Invoke the Flow - DELETE Operation

```json
{
  "Action": "delete",
  "AppId": "12345678-1234-1234-1234-123456789abc",
  "SecurityGroupId": "87654321-4321-4321-4321-abcdef123456",
  "SecurityGroupName": "APP_BU_SalesManager"
}
```

## ?? API Reference

### HTTP Trigger Endpoint

```
POST https://prod-{region}.logic.azure.com/workflows/{workflow-id}/triggers/manual/paths/invoke
```

### Request Schema

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `Action` | string | ? | Operation to perform | Enum: `create`, `delete` |
| `AppId` | string | ? | Application GUID | GUID format |
| `SecurityGroupId` | string | ??* | Azure AD group GUID | GUID format, required for CREATE |
| `SecurityGroupName` | string | ? | Group name with specific format | Pattern: `*_*_*` |

*Note: `SecurityGroupId` is required for CREATE operation

### Response Schema

#### Success Response (200 OK)

```json
{
  "statusCode": 200,
  "body": null
}
```

#### Error Response (200 OK with Error Code in Header)

```json
{
  "statusCode": 200,
  "headers": {
    "ErrorCode": "1001_TeamAlreadyExists"
  },
  "body": "CREATE OPERATION FAILED: Team associated to APP_BU_SalesManager Security Group already exists with name APP_BU_SalesManager"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Request processed (may contain business error in body) |
| `400` | Invalid request (incorrect schema) |
| `500` | Internal flow error |

## ?? Error Codes

| Code | Description | Suggested Action |
|------|-------------|------------------|
| `1001_TeamAlreadyExists` | The team associated with the security group already exists | Verify if it's a duplicate operation. If the team should exist, ignore the error. |
| `1002_TeamDoesntExists` | The team to delete doesn't exist | Check the group name. It may have been manually deleted. |
| `1003_BUNotExists` | The Business Unit with the specified division doesn't exist | Review the second segment of SecurityGroupName. Create the BU if necessary. |
| `1004_RoleNotExists` | The specified security role doesn't exist in the BU | Review the third segment of SecurityGroupName. Verify the role exists in that BU. |

## ?? Troubleshooting

### Problem: "Unauthorized" when invoking the flow

**Symptoms:**
```json
{
  "error": {
    "code": "Unauthorized",
    "message": "The request authorization is missing or invalid"
  }
}
```

**Solution:**
1. Verify the flow has trigger type `HTTP` with `All` as authentication type
2. Use the complete flow URL including the `sig` parameter
3. Don't add additional authentication headers if the flow is public

### Problem: "Invalid token" accessing Dataverse

**Symptoms:**
```json
{
  "error": {
    "code": "0x80040217",
    "message": "Principal user is missing"
  }
}
```

**Solution:**
```powershell
# 1. Verify the application user exists in Dataverse
# Dataverse > Settings > Security > Users > Application Users

# 2. Verify the Application ID matches
# Azure AD App Registration Application (client) ID

# 3. Verify application user permissions
# Must have "System Administrator" role or sufficient permissions

# 4. Re-generate access token
# May have expired (typical lifetime: 1 hour)
```

## ?? Best Practices

### Security

#### 1. Secrets Management

```powershell
# ? BAD - Hardcode secrets in the flow
"CredentialsSecret": "YOUR_CLIENT_SECRET_HERE"

# ? GOOD - Use Azure Key Vault
# Create HTTP action to get secret
GET https://{keyvault-name}.vault.azure.net/secrets/{secret-name}?api-version=7.3
Authorization: Bearer @{variables('KeyVaultToken')}

# Use the output instead of hardcoded value
"CredentialsSecret": "@{body('Get_Secret_from_KeyVault')['value']}"
```

#### 2. Least Privilege Principle

```powershell
# Create custom security role with specific permissions
# Instead of System Administrator

# Minimum required permissions:
# - Team: Create, Read, Write, Delete, Append, Append To
# - Role: Read, Append
# - Business Unit: Read
# - System User: Read
# - Canvas App: Read (if applicable)
```

## ?? Contributing

Contributions are welcome. Please follow these steps:

### Contribution Guidelines

1. **Fork** the repository
2. **Create** a branch for your feature (`git checkout -b feature/SyncImprovement`)
3. **Commit** your changes (`git commit -m 'feat: Add support for private Teams'`)
4. **Push** to the branch (`git push origin feature/SyncImprovement`)
5. **Open** a Pull Request

### Code Standards

- Use descriptive names in English for actions and variables
- Document all HTTP actions with appropriate metadata
- Include error handling for all known cases
- Add comments for complex logic
- Follow the Scope pattern for logical grouping

## ?? License

This project is licensed under the MIT License. See the [LICENSE](../../../LICENSE) file for more details.

## ?? Authors

**Alejandro Caravantes Molina**
- LinkedIn: [https://www.linkedin.com/in/acaravantesmolina/](https://www.linkedin.com/in/acaravantesmolina/)
- Blog: [https://acaravantes.wixsite.com/misitio](https://acaravantes.wixsite.com/misitio)
- Email: acaravantes@gmail.com

## ?? Acknowledgments

- **Microsoft Power Platform Team**: For the incredible Power Automate ecosystem
- **Center of Excellence (CoE) Team**: For the CoE Starter Kit that inspired this component
- **Community**: For continuous feedback and contributions

## ?? Additional Resources

### Official Documentation

- [Power Automate Documentation](https://docs.microsoft.com/power-automate/)
- [Dataverse Web API Reference](https://docs.microsoft.com/power-apps/developer/data-platform/webapi/reference/about)
- [Microsoft Graph API - Groups](https://docs.microsoft.com/graph/api/resources/group)
- [Azure AD Application Registration](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)
- [Center of Excellence Starter Kit](https://aka.ms/CoEStarterKit)

### Related Articles

- [Invoke Dataverse API with OAuth](../../../technical-articles/invocar-api-dataverse.md)
- [Business Events in Dataverse](../../../technical-articles/business-events-en-dataverse.md)
- [Azure Key Vault to Secure Environment Variables](../../../technical-articles/azure-key-vault-para-securizar-environment-variables.md)
- [Expose Power Automate Flows behind API Management](../../../technical-articles/exponer-flujos-de-power-automate-detras-de-api-management.md)

### Useful Tools

- [Postman](https://www.postman.com/): For API testing
- [XrmToolBox](https://www.xrmtoolbox.com/): Dataverse tools
- [Power Platform CLI](https://aka.ms/PowerPlatformCLI): Deployment automation
- [Dataverse REST Builder](https://github.com/GuidoPreite/DRB): OData query building

## ?? Support

If you encounter any issues or have questions:

- ?? **Issues**: [Report a bug](../../../../issues)
- ?? **Discussions**: [Ask a question or make a suggestion](../../../../discussions)
- ?? **Email**: acaravantes@gmail.com
- ?? **LinkedIn**: [Contact on LinkedIn](https://www.linkedin.com/in/acaravantesmolina/)

---

**Developed with ?? using Power Platform**

![Power Automate](https://img.shields.io/badge/Power%20Automate-0066FF?style=for-the-badge&logo=powerautomate&logoColor=white)
![Dataverse](https://img.shields.io/badge/Dataverse-742774?style=for-the-badge&logo=microsoft&logoColor=white)
![Azure AD](https://img.shields.io/badge/Azure%20AD-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)

---

> **Note**: This flow is part of a broader ecosystem of automations for Power Platform. Visit the [samples folder](../) for more related components.
