# Artículos Técnicos - Microsoft Power Platform

Este repositorio contiene una colección completa de artículos técnicos sobre Microsoft Power Platform, Dataverse, Power Apps, Power Automate y tecnologías relacionadas. Los artículos están escritos por Alejandro Caravantes Molina y cubren desde conceptos fundamentales hasta implementaciones avanzadas.

## ?? Tabla de Contenidos

- [Power Apps](#power-apps)
- [Power Automate](#power-automate)
- [Microsoft Dataverse](#microsoft-dataverse)
- [Custom APIs](#custom-apis)
- [Seguridad y Gobierno](#seguridad-y-gobierno)
- [Integración y APIs](#integración-y-apis)
- [RPA y Automatización](#rpa-y-automatización)
- [AI Builder](#ai-builder)
- [Administración y PowerShell](#administración-y-powershell)

---

## ?? Power Apps

### [Clonar registros con PowerFx](clonar-registros-powerfx.md)
**Fecha:** 1 dic 2021 | **Actualizado:** 5 dic 2021

Aprende a implementar funcionalidad de clonación de registros en Dataverse utilizando PowerFx a través de la barra de comandos personalizable. Incluye:
- Edición de barras de comando en vista previa
- Uso de la función `Patch` para clonar registros
- Clonación de registros con relaciones hijo
- Notificaciones personalizadas

**Temas:** Power Apps, PowerFx, Model Driven Apps, Command Bar

---

### [Mostrar datos de un registro relacionado en el formulario principal](mostrar-datos-de-un-registro-relacionado-en-el-formulario-principal-de-otra-tabla.md)

Técnicas para mostrar información de registros relacionados directamente en formularios principales sin necesidad de subgrids adicionales.

**Temas:** Power Apps, Model Driven Apps, Formularios

---

### [Llamar desde una Canvas App a través de Microsoft Teams](llamar-desde-una-canvas-app-a-traves-de-microsoft-teams.md)

Integración de funcionalidades de llamadas de Microsoft Teams dentro de aplicaciones Canvas.

**Temas:** Power Apps, Canvas Apps, Microsoft Teams

---

### [Organizar reuniones de MS Teams desde una aplicación Model Driven](organizar-reuniones-de-ms-teams-desde-una-aplicacion-model-driven.md)

Implementación de funcionalidad para crear y gestionar reuniones de Microsoft Teams directamente desde aplicaciones Model Driven.

**Temas:** Power Apps, Model Driven Apps, Microsoft Teams, Graph API

---

### [Model Driven + AI Builder + Custom Page: Cómo exprimir la plataforma al máximo](model-driven-ai-builder-custom-page-o-como-exprimir-la-plataforma-al-maximo.md)

Combinación avanzada de tecnologías Power Platform para crear experiencias de usuario ricas utilizando Model Driven Apps, AI Builder y Custom Pages.

**Temas:** Power Apps, AI Builder, Custom Pages, Model Driven Apps

---

## ? Power Automate

### [Power Automate Desktop y carga de datos en aplicaciones web](power-automate-desktop-y-carga-de-datos-en-aplicaciones-web.md)
**Fecha:** 17 ene 2022

Guía completa para automatizar la carga de datos desde archivos CSV hacia aplicaciones web utilizando Power Automate Desktop. Incluye:
- Lectura de archivos CSV
- Captura de elementos de interfaz web
- Trabajo con selectores jQuery
- Automatización de carga de archivos mediante diálogos del sistema
- Manejo de campos complejos (dropdowns, file uploads)

**Temas:** Power Automate, Power Automate Desktop, RPA, Web Automation

---

### [Probar selectores web con Power Automate Desktop](probar-selectores-web-con-power-automate-desktop.md)

Técnicas para validar y optimizar selectores web en automatizaciones con Power Automate Desktop.

**Temas:** Power Automate Desktop, Web Selectors, RPA

---

### [Dataverse Word Templates desde Power Automate](dataverse-word-templates-desde-power-automate.md)
**Fecha:** 11 abr 2023

Aprende a generar documentos Word automáticamente desde Power Automate utilizando plantillas almacenadas en Dataverse. Incluye:
- Creación de plantillas Word con XML Mapping
- Uso de Custom Actions `SetWordTemplate`
- Generación de documentos con datos de múltiples tablas relacionadas
- Conversión a PDF con Word Online connector
- Almacenamiento automatizado en SharePoint/OneDrive

**Temas:** Power Automate, Dataverse, Word Templates, Document Generation

---

### [Paginación de grandes volúmenes de datos en Power Automate](paginacion-grandes-volumenes-datos-power-automate.md)

Estrategias para manejar y procesar grandes volúmenes de datos evitando limitaciones de paginación en Power Automate.

**Temas:** Power Automate, Dataverse, Performance, Best Practices

---

### [Exponer flujos de Power Automate detrás de API Management](exponer-flujos-de-power-automate-detras-de-api-management.md)

Implementación de una capa de Azure API Management para exponer flujos de Power Automate como APIs empresariales.

**Temas:** Power Automate, Azure API Management, Integration

---

### [Securizar las llamadas a flujos de Power Automate expuestos por API Management](securizar-las-llamadas-a-flujos-de-power-automate-expuestos-por-api-management.md)

Mejores prácticas de seguridad para proteger flujos de Power Automate expuestos a través de Azure API Management.

**Temas:** Power Automate, Azure API Management, Security

---

## ??? Microsoft Dataverse

### [Columnas polimórficas o multi-table lookups](columnas-polimorficas-o-multi-table-lookups.md)
**Fecha:** 11 ene 2023

Guía completa sobre cómo implementar lookups que pueden referenciar múltiples tablas (similar al lookup Customer). Incluye:
- Creación de multi-table lookups mediante API de Dataverse
- Uso del plugin de XrmToolBox
- Configuración de relaciones polimórficas
- Experiencia de usuario en formularios
- Integración con Power Automate

**Temas:** Dataverse, Data Modeling, API, Polymorphic Lookups

---

### [Business Events en Dataverse](business-events-en-dataverse.md)
**Fecha:** 30 jun 2022

Aprende a crear y organizar eventos empresariales customizados en Dataverse. Incluye:
- Creación de Custom APIs como eventos
- Uso de Catalog y CatalogAssignment para organizar eventos
- Disparo de eventos desde Power Automate
- Suscripción a eventos con Power Automate
- Integración con WebHooks

**Temas:** Dataverse, Custom APIs, Events, Integration, Power Automate

---

### [Modernización de Business Units](modernizacion-business-units.md)

Estrategias y mejores prácticas para modernizar la estructura de Business Units en Dataverse.

**Temas:** Dataverse, Administration, Security, Business Units

---

### [Suplantar a otro usuario utilizando la API de Microsoft Dataverse](suplantar-a-otro-usuario-utilizando-la-api-de-microsoft-dataverse.md)

Técnicas para realizar operaciones en Dataverse en nombre de otros usuarios utilizando impersonation en la API.

**Temas:** Dataverse, API, Security, Impersonation

---

### [IP Firewall Restriction en Microsoft Dataverse](ip-firewall-restriction-en-microsoft-dataverse.md)

Configuración de restricciones de firewall basadas en IP para aumentar la seguridad de entornos Dataverse.

**Temas:** Dataverse, Security, Networking

---

## ?? Custom APIs

### [Custom API en Dataverse (Parte I)](custom-api-en-dataverse-parte-i.md)
**Fecha:** 22 dic 2021

Introducción completa a las Custom APIs en Dataverse. Incluye:
- Definición de Custom API mediante tablas de Dataverse
- Creación de parámetros de entrada y salida
- Desarrollo de Plugins como procesadores
- Registro con Plugin Registration Tool
- Invocación mediante Postman con autenticación OAuth

**Temas:** Dataverse, Custom APIs, Plugins, API Development

---

### [Custom API en Dataverse y response customizada (Parte II)](custom-api-en-dataverse-y-response-customizada-parte-ii.md)
**Fecha:** 29 dic 2021

Aprende a crear respuestas personalizadas en Custom APIs sin necesidad de tablas en Dataverse. Incluye:
- Uso de EntityCollection como respuesta
- Construcción dinámica de objetos Entity
- Creación de estructuras de datos anidadas
- Optimización de consultas con LINQ

**Temas:** Dataverse, Custom APIs, Advanced Development

---

### [Debug de Custom API en Dataverse](debug-de-custom-api-en-dataverse.md)
**Fecha:** 15 feb 2022

Guía paso a paso para depurar Custom APIs y Plugins. Incluye:
- Configuración de `Allowed Custom Processing Step Type`
- Instalación y uso de Plugin Profiler
- Registro de Steps para debugging
- Asociación del depurador de Visual Studio
- Análisis de requests capturadas

**Temas:** Dataverse, Custom APIs, Debugging, Development Tools

---

### [Ejecutar Custom APIs desde Canvas sin necesidad de Power Automate](ejecutar-custom-api-s-desde-canvas-sin-necesidad-de-power-automate.md)

Técnicas para invocar Custom APIs directamente desde Canvas Apps sin intermediarios.

**Temas:** Power Apps, Canvas Apps, Custom APIs, Dataverse

---

## ?? Seguridad y Gobierno

### [Azure Key Vault para securizar Environment Variables](azure-key-vault-para-securizar-environment-variables.md)
**Fecha:** 10 ene 2022

Implementación de Azure Key Vault para securizar variables de entorno en Power Platform. Incluye:
- Registro de Microsoft.PowerPlatform como Resource Provider
- Configuración de Key Vault y políticas de acceso
- Creación de secretos en Azure Key Vault
- Variables de entorno tipo Secret
- Consumo mediante unbound action `RetrieveEnvironmentVariableSecretValue`

**Temas:** Security, Azure Key Vault, Environment Variables, Power Platform

---

### [Exenciones de DLP sobre recursos específicos](exenciones-de-dlp-s-sobre-recursos-especificos.md)
**Fecha:** 15 nov 2022

Aprende a crear excepciones específicas en políticas DLP para aplicaciones y flujos concretos utilizando PowerShell.

**Temas:** DLP, Governance, PowerShell, Administration

---

### [Mensajes de error personalizados en errores de incumplimiento de DLPs](mensajes-de-error-personalizados-en-errores-de-incumplimiento-de-dlp-s.md)

Personalización de mensajes de error cuando se incumplen políticas de prevención de pérdida de datos.

**Temas:** DLP, Governance, User Experience

---

### [Habilitar el desarrollo de aplicaciones a usuarios externos](habilitar-el-desarrollo-de-aplicaciones-a-usuarios-externos.md)

Configuración y mejores prácticas para permitir que usuarios externos (B2B) desarrollen aplicaciones en Power Platform.

**Temas:** Security, B2B, External Users, Governance

---

## ?? Integración y APIs

### [Cómo invocar a la API de Dataverse con autenticación OAuth](invocar-api-dataverse.md)
**Fecha:** 1 dic 2021 | **Actualizado:** 2 dic 2021

Guía completa para autenticar y consumir la API de Dataverse. Incluye:
- Registro de aplicación en Azure AD
- Configuración de Client Credentials Flow
- Creación de Application Users en Dataverse
- Configuración de autenticación OAuth 2.0 en Postman
- Ejemplos de queries OData

**Temas:** Dataverse, API, OAuth, Azure AD, Authentication

---

## ?? RPA y Automatización

### [Scale-out de máquinas virtuales para RPA con Azure Virtual Desktop](scale-out-de-maquinas-virtuales-para-rpa-con-azure-virtual-desktop.md)

Implementación de infraestructura escalable para ejecutar automatizaciones RPA utilizando Azure Virtual Desktop.

**Temas:** RPA, Azure Virtual Desktop, Infrastructure, Power Automate Desktop

---

## ?? AI Builder

### [Mejora continua de modelos AI Builder](mejora-continua-de-modelos-ai-builder.md)

Técnicas para implementar ciclos de mejora continua en modelos de AI Builder utilizando Feedback Loop para procesamiento de formularios.

**Temas:** AI Builder, Machine Learning, Form Processing, Power Automate

---

## ?? Administración y PowerShell

### [Obtener componentes Power Platform de todo el tenant con PowerShell](componentes-powerplatform-powershell.md)
**Fecha:** 2 dic 2021

Scripts de PowerShell para obtener inventario completo de componentes Power Platform. Incluye:
- Instalación de módulos Microsoft.PowerApps
- Autenticación con credenciales
- Obtención de Power Apps, Flows y otros componentes
- Exportación de datos para análisis
- Bloqueo de creación de entornos Developer

**Temas:** PowerShell, Administration, Governance, Inventory

---

## ?? Desarrollo Avanzado

### [Ejecución de plugins con dependencias de otras librerías](ejecucion-de-plugins-con-dependencias-de-otras-librerias.md)

Cómo gestionar dependencias externas en plugins de Dataverse utilizando ILMerge y otras técnicas.

**Temas:** Dataverse, Plugins, Development, Dependencies

---

### [Envío de trazas desde plugins hacia Application Insights](envio-de-trazas-desde-plugins-hacia-application-insights.md)

Integración de Application Insights para monitorización y telemetría de plugins en Dataverse.

**Temas:** Dataverse, Plugins, Monitoring, Application Insights, Azure

---

## ?? Convenciones

Cada artículo incluye:
- ? Descripción del problema o escenario
- ? Pasos detallados de implementación
- ? Capturas de pantalla y ejemplos de código
- ? Mejores prácticas y consideraciones
- ? Etiquetas para facilitar la búsqueda

## ??? Etiquetas Principales

- **Power Apps**: Desarrollo de aplicaciones Canvas y Model Driven
- **Power Automate**: Flujos cloud y desktop
- **Dataverse**: Gestión de datos, modelo de datos, APIs
- **Security**: Seguridad, autenticación, autorización
- **API**: Desarrollo y consumo de APIs
- **PowerShell**: Automatización administrativa
- **AI Builder**: Inteligencia artificial y machine learning
- **Governance**: DLP, políticas, administración

## ?? Autor

**Alejandro Caravantes Molina**
- Blog original: https://acaravantes.wixsite.com/misitio

## ?? Notas

Los artículos originales fueron publicados en el blog personal del autor. Este repositorio contiene versiones en Markdown para facilitar su acceso y consulta.

---

**Última actualización:** 2023
**Total de artículos:** 29
