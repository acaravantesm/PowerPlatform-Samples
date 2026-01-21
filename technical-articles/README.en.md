# Technical Articles - Microsoft Power Platform

> **Read this in other languages**: [en English](README.en.md) | [es Español](README.md)

[![Power Platform](https://img.shields.io/badge/Power%20Platform-742774?style=flat-square&logo=microsoft&logoColor=white)](https://powerplatform.microsoft.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Language](https://img.shields.io/badge/lang-en-blue?style=flat-square)](README.en.md)
[![Language](https://img.shields.io/badge/lang-es-red?style=flat-square)](README.md)

This repository contains a complete collection of technical articles about Microsoft Power Platform, Dataverse, Power Apps, Power Automate, and related technologies. The articles are written by Alejandro Caravantes Molina and cover everything from fundamental concepts to advanced implementations.

## Table of Contents

- [Power Apps](#power-apps)
- [Power Automate](#power-automate)
- [Microsoft Dataverse](#microsoft-dataverse)
- [Custom APIs](#custom-apis)
- [Security and Governance](#security-and-governance)
- [Integration and APIs](#integration-and-apis)
- [RPA and Automation](#rpa-and-automation)
- [AI Builder](#ai-builder)
- [Administration and PowerShell](#administration-and-powershell)

---

## Power Apps

### [Clone Records with PowerFx](clonar-registros-powerfx.md)

Learn to implement record cloning functionality in Dataverse using PowerFx through the customizable command bar. Includes:
- Command bar editing in preview
- Using the `Patch` function to clone records
- Cloning records with child relationships
- Custom notifications

**Topics:** Power Apps, PowerFx, Model Driven Apps, Command Bar

---

### [Display Related Record Data in Main Form](mostrar-datos-de-un-registro-relacionado-en-el-formulario-principal-de-otra-tabla.md)

Techniques for displaying related record information directly in main forms without additional subgrids.

**Topics:** Power Apps, Model Driven Apps, Forms

---

### [Model Driven + AI Builder + Custom Page: How to Maximize the Platform](model-driven-ai-builder-custom-page-o-como-exprimir-la-plataforma-al-maximo.md)

Advanced combination of Power Platform technologies to create rich user experiences using Model Driven Apps, AI Builder, and Custom Pages.

**Topics:** Power Apps, AI Builder, Custom Pages, Model Driven Apps

---

## ? Power Automate

### [Power Automate Desktop and Web Application Data Loading](power-automate-desktop-y-carga-de-datos-en-aplicaciones-web.md)

Complete guide to automate data loading from CSV files to web applications using Power Automate Desktop. Includes:
- Reading CSV files
- Capturing web interface elements
- Working with jQuery selectors
- Automating file uploads via system dialogs
- Handling complex fields (dropdowns, file uploads)

**Topics:** Power Automate, Power Automate Desktop, RPA, Web Automation

---

### [Testing Web Selectors with Power Automate Desktop](probar-selectores-web-con-power-automate-desktop.md)

Techniques to validate and optimize web selectors in automations with Power Automate Desktop.

**Topics:** Power Automate Desktop, Web Selectors, RPA

---

### [Dataverse Word Templates from Power Automate](dataverse-word-templates-desde-power-automate.md)

Learn to automatically generate Word documents from Power Automate using templates stored in Dataverse. Includes:
- Creating Word templates with XML Mapping
- Using Custom Actions `SetWordTemplate`
- Generating documents with data from multiple related tables
- Converting to PDF with Word Online connector
- Automated storage in SharePoint/OneDrive

**Topics:** Power Automate, Dataverse, Word Templates, Document Generation

---

### [Pagination of Large Data Volumes in Power Automate](paginacion-grandes-volumenes-datos-power-automate.md)

Strategies to handle and process large data volumes avoiding pagination limitations in Power Automate.

**Topics:** Power Automate, Dataverse, Performance, Best Practices

---

### [Expose Power Automate Flows Behind API Management](exponer-flujos-de-power-automate-detras-de-api-management.md)

Implementation of an Azure API Management layer to expose Power Automate flows as enterprise APIs.

**Topics:** Power Automate, Azure API Management, Integration

---

### [Secure Calls to Power Automate Flows Exposed by API Management](securizar-las-llamadas-a-flujos-de-power-automate-expuestos-por-api-management.md)

Security best practices to protect Power Automate flows exposed through Azure API Management.

**Topics:** Power Automate, Azure API Management, Security

---

## ??? Microsoft Dataverse

### [Polymorphic Columns or Multi-table Lookups](columnas-polimorficas-o-multi-table-lookups.md)

Complete guide on how to implement lookups that can reference multiple tables (similar to the Customer lookup). Includes:
- Creating multi-table lookups via Dataverse API
- Using the XrmToolBox plugin
- Configuring polymorphic relationships
- User experience in forms
- Integration with Power Automate

**Topics:** Dataverse, Data Modeling, API, Polymorphic Lookups

---

### [Business Events in Dataverse](business-events-en-dataverse.md)

Learn to create and organize custom business events in Dataverse. Includes:
- Creating Custom APIs as events
- Using Catalog and CatalogAssignment to organize events
- Triggering events from Power Automate
- Subscribing to events with Power Automate
- Integration with WebHooks

**Topics:** Dataverse, Custom APIs, Events, Integration, Power Automate

---

### [Business Units Modernization](modernizacion-business-units.md)

Strategies and best practices to modernize Business Units structure in Dataverse.

**Topics:** Dataverse, Administration, Security, Business Units

---

### [Impersonate Another User Using Microsoft Dataverse API](suplantar-a-otro-usuario-utilizando-la-api-de-microsoft-dataverse.md)

Techniques to perform operations in Dataverse on behalf of other users using API impersonation.

**Topics:** Dataverse, API, Security, Impersonation

---

### [IP Firewall Restriction in Microsoft Dataverse](ip-firewall-restriction-en-microsoft-dataverse.md)

Configuration of IP-based firewall restrictions to increase security of Dataverse environments.

**Topics:** Dataverse, Security, Networking

---

## ?? Custom APIs

### [Custom API in Dataverse (Part I)](custom-api-en-dataverse-parte-i.md)

Complete introduction to Custom APIs in Dataverse. Includes:
- Custom API definition via Dataverse tables
- Creating input and output parameters
- Plugin development as processors
- Registration with Plugin Registration Tool
- Invocation via Postman with OAuth authentication

**Topics:** Dataverse, Custom APIs, Plugins, API Development

---

### [Custom API in Dataverse and Custom Response (Part II)](custom-api-en-dataverse-y-response-customizada-parte-ii.md)

Learn to create custom responses in Custom APIs without needing Dataverse tables. Includes:
- Using EntityCollection as response
- Dynamic construction of Entity objects
- Creating nested data structures
- Query optimization with LINQ

**Topics:** Dataverse, Custom APIs, Advanced Development

---

### [Debug Custom API in Dataverse](debug-de-custom-api-en-dataverse.md)

Step-by-step guide to debug Custom APIs and Plugins. Includes:
- Configuring `Allowed Custom Processing Step Type`
- Installing and using Plugin Profiler
- Registering Steps for debugging
- Attaching Visual Studio debugger
- Analyzing captured requests

**Topics:** Dataverse, Custom APIs, Debugging, Development Tools

---

### [Execute Custom APIs from Canvas Without Power Automate](ejecutar-custom-api-s-desde-canvas-sin-necesidad-de-power-automate.md)

Techniques to invoke Custom APIs directly from Canvas Apps without intermediaries.

**Topics:** Power Apps, Canvas Apps, Custom APIs, Dataverse

---

## ?? Security and Governance

### [Azure Key Vault to Secure Environment Variables](azure-key-vault-para-securizar-environment-variables.md)

Implementation of Azure Key Vault to secure environment variables in Power Platform. Includes:
- Registering Microsoft.PowerPlatform as Resource Provider
- Key Vault configuration and access policies
- Creating secrets in Azure Key Vault
- Secret-type environment variables
- Consumption via unbound action `RetrieveEnvironmentVariableSecretValue`

**Topics:** Security, Azure Key Vault, Environment Variables, Power Platform

---

### [DLP Exemptions on Specific Resources](exenciones-de-dlp-s-sobre-recursos-especificos.md)

Learn to create specific exceptions in DLP policies for concrete applications and flows using PowerShell.

**Topics:** DLP, Governance, PowerShell, Administration

---

### [Custom Error Messages in DLP Violations](mensajes-de-error-personalizados-en-errores-de-incumplimiento-de-dlp-s.md)

Customizing error messages when data loss prevention policies are violated.

**Topics:** DLP, Governance, User Experience

---

### [Enable Application Development for External Users](habilitar-el-desarrollo-de-aplicaciones-a-usuarios-externos.md)

Configuration and best practices to allow external users (B2B) to develop applications in Power Platform.

**Topics:** Security, B2B, External Users, Governance

---

## ?? Integration and APIs

### [How to Invoke the Dataverse API with OAuth Authentication](invocar-api-dataverse.md)

Complete guide to authenticate and consume the Dataverse API. Includes:
- Application registration in Azure AD
- Client Credentials Flow configuration
- Creating Application Users in Dataverse
- Configuring OAuth 2.0 authentication in Postman
- OData query examples

**Topics:** Dataverse, API, OAuth, Azure AD, Authentication

---

## ?? RPA and Automation

### [Scale-out Virtual Machines for RPA with Azure Virtual Desktop](scale-out-de-maquinas-virtuales-para-rpa-con-azure-virtual-desktop.md)

Implementation of scalable infrastructure to run RPA automations using Azure Virtual Desktop.

**Topics:** RPA, Azure Virtual Desktop, Infrastructure, Power Automate Desktop

---

## ?? AI Builder

### [Continuous Improvement of AI Builder Models](mejora-continua-de-modelos-ai-builder.md)

Techniques to implement continuous improvement cycles in AI Builder models using Feedback Loop for form processing.

**Topics:** AI Builder, Machine Learning, Form Processing, Power Automate

---

## ?? Administration and PowerShell

### [Get Power Platform Components Across Tenant with PowerShell](componentes-powerplatform-powershell.md)

PowerShell scripts to get complete inventory of Power Platform components. Includes:
- Installing Microsoft.PowerApps modules
- Authentication with credentials
- Getting Power Apps, Flows, and other components
- Data export for analysis
- Blocking Developer environment creation

**Topics:** PowerShell, Administration, Governance, Inventory

---

## ??? Advanced Development

### [Plugin Execution with Dependencies on Other Libraries](ejecucion-de-plugins-con-dependencias-de-otras-librerias.md)

How to manage external dependencies in Dataverse plugins using ILMerge and other techniques.

**Topics:** Dataverse, Plugins, Development, Dependencies

---

### [Sending Traces from Plugins to Application Insights](envio-de-trazas-desde-plugins-hacia-application-insights.md)

Application Insights integration for monitoring and telemetry of plugins in Dataverse.

**Topics:** Dataverse, Plugins, Monitoring, Application Insights, Azure

---

## ?? Conventions

Each article includes:
- ? Description of the problem or scenario
- ? Detailed implementation steps
- ? Screenshots and code examples
- ? Best practices and considerations
- ? Tags for easy search

## ??? Main Tags

- **Power Apps**: Canvas and Model Driven app development
- **Power Automate**: Cloud and desktop flows
- **Dataverse**: Data management, data model, APIs
- **Security**: Security, authentication, authorization
- **API**: API development and consumption
- **PowerShell**: Administrative automation
- **AI Builder**: Artificial intelligence and machine learning
- **Governance**: DLP, policies, administration

## ?? Author

**Alejandro Caravantes Molina**
- LinkedIn: [https://www.linkedin.com/in/acaravantesmolina/](https://www.linkedin.com/in/acaravantesmolina/)
- Blog: [https://acaravantes.wixsite.com/misitio](https://acaravantes.wixsite.com/misitio)
- Email: acaravantes@gmail.com

## ?? Support

If you encounter any issues or have questions:

- ?? **Issues**: [Report a bug](../../issues)
- ?? **Discussions**: [Ask a question or make a suggestion](../../discussions)
- ?? **Email**: acaravantes@gmail.com

---

**Developed with ?? using Power Platform**

![Power Platform](https://img.shields.io/badge/Power%20Platform-742774?style=for-the-badge&logo=microsoft&logoColor=white)

---

> **Note**: Most articles are currently available in Spanish only. English translations are being progressively added. Check the [Spanish version](README.md) for the complete catalog.
