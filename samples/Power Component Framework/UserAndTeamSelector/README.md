# Smart User Team Picker - PCF Control

> **Read this in other languages**: [🇺🇸 English](README.en.md) | [🇪🇸 Español](README.md)

[![Power Apps](https://img.shields.io/badge/Power%20Apps-PCF-742774?style=flat-square)](https://powerapps.microsoft.com/)
[![React](https://img.shields.io/badge/React-16.14.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Language](https://img.shields.io/badge/lang-es-red?style=flat-square)](README.md)
[![Language](https://img.shields.io/badge/lang-en-blue?style=flat-square)](README.en.md)

Un componente PCF (PowerApps Component Framework) inteligente para seleccionar usuarios y equipos en Dynamics 365 / Power Apps con memoria de selecciones recientes.

## 📋 Índice

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Cómo Funciona](#-cómo-funciona)
- [Uso](#-uso)
- [Desarrollo](#-desarrollo)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

- **🔍 Búsqueda Inteligente**: Busca usuarios y equipos por nombre o correo electrónico en tiempo real
- **⏱️ Memoria de Selecciones Recientes**: Guarda automáticamente los últimos 10 usuarios/equipos seleccionados para acceso rápido
- **🎯 Soporte para Campos Polimórficos**: Funciona con lookups polimórficos que aceptan múltiples tipos de entidades
- **⚡ Búsqueda con Debounce**: Optimiza las consultas con un retraso de 300ms para mejorar el rendimiento
- **🎨 Interfaz Intuitiva con Tabs**: Organiza usuarios y equipos en pestañas separadas para una navegación clara
- **🔒 Modo Solo Lectura**: Respeta el estado de solo lectura del formulario
- **🌐 Multiidioma**: Soporta archivos de recursos en español (1034) e inglés (1033)
- **♿ Accesibilidad**: Diseñado siguiendo las pautas de Fluent UI
- **💾 Almacenamiento Local**: Utiliza localStorage del navegador para persistir selecciones recientes por usuario

## 📦 Requisitos Previos

Antes de instalar el componente, asegúrate de tener:

- **Power Apps CLI**: Versión 1.0 o superior
  ```powershell
  pac install latest
  ```
- **Node.js**: Versión 14.x o superior
- **npm**: Versión 6.x o superior
- **Entorno Dynamics 365 / Power Apps**: Con permisos de administrador para importar soluciones
- **.NET SDK**: Para la compilación del proyecto PCF

## 🚀 Instalación

### Opción 1: Instalación desde el Código Fuente

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd UserAndTeamSelector
   ```

2. **Instalar dependencias**
   ```powershell
   npm install
   ```

3. **Compilar el componente**
   ```powershell
   npm run build
   ```

4. **Crear el paquete de solución**
   ```powershell
   # Crear directorio temporal para la solución
   mkdir out
   pac solution init --publisher-name XXXXX --publisher-prefix xxxx
   pac solution add-reference --path .
   
   # Compilar la solución
   msbuild /t:build /restore
   ```

5. **Importar la solución en Power Apps**
   - Navega al [Centro de administración de Power Platform](https://admin.powerplatform.microsoft.com/)
   - Selecciona tu entorno
   - Ve a **Soluciones** > **Importar solución**
   - Selecciona el archivo `.zip` generado en la carpeta `bin\Debug`

### Opción 2: Instalación Directa con PAC CLI

```powershell
# Conectar al entorno
pac auth create --url https://tuorganizacion.crm.dynamics.com

# Importar directamente
pac pcf push --publisher-prefix mnst
```

## ⚙️ Configuración

### Paso 1: Agregar el Control a un Formulario

1. Abre tu entidad en el diseñador de formularios de Power Apps
2. Selecciona un campo de tipo **Lookup** que acepte usuarios y/o equipos (por ejemplo, un campo polimórfico personalizado o el campo Owner)
3. En las propiedades del campo, ve a **Controles**
4. Haz clic en **Agregar control**
5. Selecciona **Smart User Team Picker**
6. Configura las opciones del control

### Paso 2: Configurar las Propiedades

El componente tiene las siguientes propiedades configurables:

| Propiedad | Tipo | Descripción | Valor por Defecto |
|-----------|------|-------------|-------------------|
| **Field** | Lookup.Simple | Campo de lookup al que se vincula el control (requerido) | - |
| **Show Users** | TwoOptions | Permite la selección de usuarios | `true` |
| **Show Teams** | TwoOptions | Permite la selección de equipos | `true` |

### Paso 3: Configurar el Campo de Lookup

Para que el componente funcione correctamente con campos polimórficos:

1. El campo debe ser de tipo **Lookup**
2. Debe configurarse para aceptar tanto `systemuser` como `team` como tipos de entidad relacionados
3. Ejemplo de configuración en el XML del campo:

```xml
<attribute name="mnst_customlookup" displayname="Custom Lookup">
  <Type>Lookup</Type>
  <RequiredLevel>None</RequiredLevel>
  <Targets>
    <Target>systemuser</Target>
    <Target>team</Target>
  </Targets>
</attribute>
```

### Ejemplo de Configuración Completa

```json
{
  "boundField": "ownerid",
  "showUsers": true,
  "showTeams": true
}
```

## 🎯 Cómo Funciona

### Arquitectura del Componente

```
┌─────────────────────────────────────────────────────┐
│         UserAndTeamSelector (index.ts)              │
│  - Control Principal PCF                            │
│  - Gestiona el ciclo de vida del componente         │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│    UserAndTeamSelectorComponent (React)             │
│  - Interfaz de usuario con React 16                 │
│  - Gestión de estado con hooks                      │
│  - Búsqueda y filtrado de resultados                │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  Web API     │  │ localStorage │
│  - Consultas │  │ - Recientes  │
│  - Updates   │  │ - Por usuario│
└──────────────┘  └──────────────┘
```

### Flujo de Funcionamiento

1. **Inicialización**
   - El componente se monta en el formulario
   - Carga el valor actual del campo lookup desde Dynamics 365
   - Recupera las selecciones recientes del usuario desde localStorage

2. **Búsqueda**
   - El usuario hace clic en el control para abrir el dropdown
   - El componente muestra las selecciones recientes primero
   - Al escribir en el campo de búsqueda, se realiza una búsqueda con debounce (300ms)
   - Los resultados se organizan en dos pestañas: **Usuarios** y **Equipos**

3. **Selección**
   - El usuario selecciona un usuario o equipo de la lista
   - El componente intenta actualizar el campo usando múltiples estrategias:
     - **Preferido**: Acceso directo al atributo del formulario (`Xrm.Page.getAttribute`)
     - **Fallback 1**: API de Xrm (`Xrm.WebApi.updateRecord`)
     - **Fallback 2**: Web API de PCF (`webAPI.updateRecord`)
   - Guarda la selección en localStorage como elemento reciente
   - Actualiza la interfaz del usuario
   - Cierra el dropdown

4. **Almacenamiento de Recientes**
   - Formato: `pcf_recent_users_teams_{userId}`
   - Estructura de datos:
     ```typescript
     {
       id: string,
       name: string,
       etn: string,  // 'systemuser' o 'team'
       email?: string,
       description?: string,
       lastUsed: number  // timestamp
     }
     ```
   - Límite: 10 elementos por usuario
   - Se eliminan duplicados automáticamente

### Características Técnicas

- **Búsqueda con OData**: Utiliza consultas OData para filtrar usuarios y equipos
- **Posicionamiento Dinámico**: El dropdown se posiciona automáticamente según el espacio disponible
- **Click Outside**: Cierra automáticamente el dropdown al hacer clic fuera
- **Scroll Handling**: Mantiene la posición del dropdown sincronizada al hacer scroll
- **Validación de Contexto**: Requiere que el registro esté guardado antes de permitir selecciones

## 📖 Uso

### Ejemplo Básico

Una vez configurado, el control funciona de manera similar a un lookup estándar pero con características mejoradas:

1. **Hacer clic** en el control para abrir el selector
2. **Ver elementos recientes** en la parte superior de cada pestaña (marcados con icono de reloj)
3. **Escribir** para buscar por nombre o correo electrónico
4. **Cambiar de pestaña** entre Usuarios y Equipos según necesites
5. **Hacer clic** en un elemento para seleccionarlo
6. **Eliminar** una selección haciendo clic en el botón `×`

### Capturas de Pantalla

```
┌──────────────────────────────────────────┐
│ [👤 John Doe]              [×]           │
├──────────────────────────────────────────┤
│ 🔍 Buscar...                             │
└──────────────────────────────────────────┘
           │ (click)
           ▼
┌──────────────────────────────────────────┐
│  Usuarios  │  Equipos                    │
├──────────────────────────────────────────┤
│ 🔍 Buscar usuarios o equipos...          │
├──────────────────────────────────────────┤
│ 🕐 Jane Smith (jane@example.com)         │ ← Reciente
│ 🕐 Mike Johnson (mike@example.com)       │ ← Reciente
│ ─────────────────────────────────────    │
│ 👤 Alice Brown (alice@example.com)       │
│ 👤 Bob Wilson (bob@example.com)          │
│ 👤 Carol Davis (carol@example.com)       │
└──────────────────────────────────────────┘
```

## 🛠️ Desarrollo

### Configuración del Entorno de Desarrollo

```powershell
# Instalar dependencias
npm install

# Iniciar en modo watch
npm run start watch

# Ejecutar linter
npm run lint

# Corregir problemas de linting automáticamente
npm run lint:fix

# Compilar para producción
npm run build

# Limpiar archivos de compilación
npm run clean

# Recompilar desde cero
npm run rebuild
```

### Ejecutar en Modo de Prueba

```powershell
# Iniciar el test harness
npm start watch
```

Esto abrirá una ventana del navegador donde puedes probar el componente de forma aislada.

### Estructura de Scripts

| Script | Descripción |
|--------|-------------|
| `build` | Compila el componente PCF |
| `clean` | Elimina archivos de compilación |
| `lint` | Ejecuta ESLint para verificar el código |
| `lint:fix` | Corrige automáticamente problemas de linting |
| `rebuild` | Limpia y recompila el proyecto |
| `start` | Inicia el test harness |
| `start:watch` | Inicia el test harness en modo watch |
| `refreshTypes` | Actualiza los tipos de TypeScript desde el manifest |

## 📁 Estructura del Proyecto

```
UserAndTeamSelector/
├── UserAndTeamSelector/              # Código fuente del componente
│   ├── ControlManifest.Input.xml    # Definición del componente (propiedades, recursos)
│   ├── index.ts                      # Punto de entrada del control PCF
│   ├── components/
│   │   └── UserAndTeamSelector.tsx   # Componente React principal
│   ├── generated/
│   │   └── ManifestTypes.d.ts        # Tipos TypeScript generados automáticamente
│   └── strings/
│       ├── UserAndTeamSelector.1033.resx  # Recursos en inglés
│       └── UserAndTeamSelector.1034.resx  # Recursos en español
├── obj/                              # Archivos de compilación temporales
├── eslint.config.mjs                 # Configuración de ESLint
├── package.json                      # Dependencias y scripts npm
├── pcfconfig.json                    # Configuración del proyecto PCF
├── tsconfig.json                     # Configuración de TypeScript
├── UserAndTeamSelector.pcfproj       # Archivo de proyecto MSBuild
└── README.md                         # Este archivo
```

### Archivos Clave

- **`ControlManifest.Input.xml`**: Define las propiedades, recursos y capacidades del control
- **`index.ts`**: Implementa la interfaz `StandardControl` de PCF y gestiona el ciclo de vida
- **`UserAndTeamSelector.tsx`**: Contiene toda la lógica de UI y negocio en React
- **`ManifestTypes.d.ts`**: Tipos generados automáticamente desde el manifest (no editar)

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **TypeScript** | 5.8.3 | Lenguaje de programación |
| **React** | 16.14.0 | Framework de UI |
| **React DOM** | 16.14.0 | Renderizado de React |
| **Fluent UI React Components** | 9.46.2 | Sistema de diseño |
| **Power Apps Component Framework** | 1.3.16 | Framework PCF |
| **ESLint** | 9.25.1 | Linter de código |
| **Power Apps ESLint Plugin** | 0.2.51 | Reglas específicas para PCF |
| **PCF Scripts** | 1.x | Herramientas de compilación |

## 🐛 Solución de Problemas

### El componente no actualiza el campo

**Problema**: Al seleccionar un usuario o equipo, el valor no se guarda.

**Solución**: 
- Asegúrate de que el registro esté guardado antes de intentar seleccionar
- Verifica que el campo sea de tipo Lookup y acepte los tipos `systemuser` y `team`
- Revisa la consola del navegador para ver mensajes de error específicos

### Los elementos recientes no se muestran

**Problema**: No aparecen las selecciones recientes.

**Solución**:
- Verifica que localStorage esté habilitado en el navegador
- Comprueba que no haya restricciones de cookies de terceros
- Los recientes son específicos por usuario (basados en `userId`)

### Error: "Missing required parameters"

**Problema**: Aparece un error indicando que faltan parámetros requeridos.

**Solución**:
- El registro debe estar guardado (debe tener un ID válido)
- Guarda el formulario antes de usar el control por primera vez
- Verifica que el campo esté correctamente vinculado al control

### El dropdown no se posiciona correctamente

**Problema**: El menú desplegable aparece en la posición incorrecta.

**Solución**:
- Puede ocurrir en formularios con mucho scroll o dentro de iframes
- El componente usa `position: fixed` con cálculos dinámicos
- Intenta hacer scroll al control antes de abrirlo

### No aparecen usuarios o equipos en la búsqueda

**Problema**: La búsqueda no devuelve resultados.

**Solución**:
- Verifica que el usuario actual tenga permisos de lectura en las entidades `systemuser` y `team`
- Comprueba que haya usuarios activos (`isdisabled eq false`)
- Revisa las propiedades `showUsers` y `showTeams` del control

### Error de compilación con tipos de TypeScript

**Problema**: Errores de tipos al compilar.

**Solución**:
```powershell
# Regenerar los tipos desde el manifest
npm run refreshTypes

# Limpiar y recompilar
npm run rebuild
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. **Fork** el repositorio
2. **Crea** una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guías de Contribución

- Sigue las convenciones de código establecidas (ESLint)
- Agrega pruebas si es aplicable
- Actualiza la documentación según sea necesario
- Escribe mensajes de commit descriptivos
- Asegúrate de que el código compile sin errores

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

**Alejandro Caravantes** - [https://www.linkedin.com/in/acaravantesmolina/](https://www.linkedin.com/in/acaravantesmolina/)

## 🙏 Agradecimientos

- Equipo de Power Apps Component Framework
- Comunidad de React
- Fluent UI Design System

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

- 🐛 **Issues**: [Reportar un bug](../../issues)
- 💡 **Discussions**: [Hacer una pregunta o sugerencia](../../discussions)
- 📧 **Email**: acaravantes@gmail.com

---

**Desarrollado con ❤️**

![Power Apps](https://img.shields.io/badge/Power%20Apps-742774?style=for-the-badge&logo=powerapps&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
