# Smart User Team Picker - PCF Control

> **Read this in other languages**: [???? English](README.en.md) | [???? Español](README.md)

[![Power Apps](https://img.shields.io/badge/Power%20Apps-PCF-742774?style=flat-square)](https://powerapps.microsoft.com/)
[![React](https://img.shields.io/badge/React-16.14.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Language](https://img.shields.io/badge/lang-en-blue?style=flat-square)](README.en.md)
[![Language](https://img.shields.io/badge/lang-es-red?style=flat-square)](README.md)

An intelligent PCF (PowerApps Component Framework) component for selecting users and teams in Dynamics 365 / Power Apps with recent selections memory.

## ?? Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [How It Works](#-how-it-works)
- [Usage](#-usage)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ? Features

- **?? Smart Search**: Search users and teams by name or email in real-time
- **?? Recent Selections Memory**: Automatically saves the last 10 selected users/teams for quick access
- **?? Polymorphic Field Support**: Works with polymorphic lookups that accept multiple entity types
- **? Debounced Search**: Optimizes queries with a 300ms delay to improve performance
- **?? Intuitive Tabbed Interface**: Organizes users and teams in separate tabs for clear navigation
- **?? Read-Only Mode**: Respects the read-only state of the form
- **?? Multilanguage**: Supports resource files in Spanish (1034) and English (1033)
- **? Accessibility**: Designed following Fluent UI guidelines
- **?? Local Storage**: Uses browser localStorage to persist recent selections per user

## ?? Prerequisites

Before installing the component, make sure you have:

- **Power Apps CLI**: Version 1.0 or higher
  ```powershell
  pac install latest
  ```
- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher
- **Dynamics 365 / Power Apps Environment**: With administrator permissions to import solutions
- **.NET SDK**: For PCF project compilation

## ?? Installation

### Option 1: Installation from Source Code

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UserAndTeamSelector
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Build the component**
   ```powershell
   npm run build
   ```

4. **Create the solution package**
   ```powershell
   # Create temporary directory for the solution
   mkdir out
   pac solution init --publisher-name XXXXX --publisher-prefix xxxx
   pac solution add-reference --path .
   
   # Build the solution
   msbuild /t:build /restore
   ```

5. **Import the solution into Power Apps**
   - Navigate to the [Power Platform Admin Center](https://admin.powerplatform.microsoft.com/)
   - Select your environment
   - Go to **Solutions** > **Import solution**
   - Select the `.zip` file generated in the `bin\Debug` folder

### Option 2: Direct Installation with PAC CLI

```powershell
# Connect to the environment
pac auth create --url https://yourorganization.crm.dynamics.com

# Import directly
pac pcf push --publisher-prefix mnst
```

## ?? Configuration

### Step 1: Add the Control to a Form

1. Open your entity in the Power Apps form designer
2. Select a **Lookup** type field that accepts users and/or teams (e.g., a custom polymorphic field or the Owner field)
3. In the field properties, go to **Controls**
4. Click **Add control**
5. Select **Smart User Team Picker**
6. Configure the control options

### Step 2: Configure Properties

The component has the following configurable properties:

| Property | Type | Description | Default Value |
|----------|------|-------------|---------------|
| **Field** | Lookup.Simple | Lookup field to which the control is bound (required) | - |
| **Show Users** | TwoOptions | Allows user selection | `true` |
| **Show Teams** | TwoOptions | Allows team selection | `true` |

### Step 3: Configure the Lookup Field

For the component to work correctly with polymorphic fields:

1. The field must be of type **Lookup**
2. It must be configured to accept both `systemuser` and `team` as related entity types
3. Example of field configuration in XML:

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

### Complete Configuration Example

```json
{
  "boundField": "ownerid",
  "showUsers": true,
  "showTeams": true
}
```

## ?? How It Works

### Component Architecture

```
???????????????????????????????????????????????????????
?         UserAndTeamSelector (index.ts)              ?
?  - Main PCF Control                                 ?
?  - Manages component lifecycle                      ?
???????????????????????????????????????????????????????
                 ?
                 ?
???????????????????????????????????????????????????????
?    UserAndTeamSelectorComponent (React)             ?
?  - User interface with React 16                     ?
?  - State management with hooks                      ?
?  - Search and result filtering                      ?
???????????????????????????????????????????????????????
                 ?
        ???????????????????
        ?                 ?
????????????????  ????????????????
?  Web API     ?  ? localStorage ?
?  - Queries   ?  ? - Recent     ?
?  - Updates   ?  ? - Per user   ?
????????????????  ????????????????
```

### Operation Flow

1. **Initialization**
   - The component mounts on the form
   - Loads the current value of the lookup field from Dynamics 365
   - Retrieves the user's recent selections from localStorage

2. **Search**
   - The user clicks on the control to open the dropdown
   - The component displays recent selections first
   - When typing in the search field, a debounced search is performed (300ms)
   - Results are organized in two tabs: **Users** and **Teams**

3. **Selection**
   - The user selects a user or team from the list
   - The component attempts to update the field using multiple strategies:
     - **Preferred**: Direct access to form attribute (`Xrm.Page.getAttribute`)
     - **Fallback 1**: Xrm API (`Xrm.WebApi.updateRecord`)
     - **Fallback 2**: PCF Web API (`webAPI.updateRecord`)
   - Saves the selection in localStorage as a recent item
   - Updates the user interface
   - Closes the dropdown

4. **Recent Storage**
   - Format: `pcf_recent_users_teams_{userId}`
   - Data structure:
     ```typescript
     {
       id: string,
       name: string,
       etn: string,  // 'systemuser' or 'team'
       email?: string,
       description?: string,
       lastUsed: number  // timestamp
     }
     ```
   - Limit: 10 items per user
   - Duplicates are automatically removed

### Technical Features

- **OData Search**: Uses OData queries to filter users and teams
- **Dynamic Positioning**: The dropdown automatically positions itself based on available space
- **Click Outside**: Automatically closes the dropdown when clicking outside
- **Scroll Handling**: Maintains the dropdown position synchronized when scrolling
- **Context Validation**: Requires the record to be saved before allowing selections

## ?? Usage

### Basic Example

Once configured, the control works similar to a standard lookup but with enhanced features:

1. **Click** on the control to open the selector
2. **View recent items** at the top of each tab (marked with clock icon)
3. **Type** to search by name or email
4. **Switch tabs** between Users and Teams as needed
5. **Click** on an item to select it
6. **Remove** a selection by clicking the `×` button

### Screenshots

```
????????????????????????????????????????????
? [?? John Doe]              [×]           ?
????????????????????????????????????????????
? ?? Search...                             ?
????????????????????????????????????????????
           ? (click)
           ?
????????????????????????????????????????????
?  Users     ?  Teams                      ?
????????????????????????????????????????????
? ?? Search users or teams...              ?
????????????????????????????????????????????
? ?? Jane Smith (jane@example.com)         ? ? Recent
? ?? Mike Johnson (mike@example.com)       ? ? Recent
? ?????????????????????????????????????    ?
? ?? Alice Brown (alice@example.com)       ?
? ?? Bob Wilson (bob@example.com)          ?
? ?? Carol Davis (carol@example.com)       ?
????????????????????????????????????????????
```

## ??? Development

### Development Environment Setup

```powershell
# Install dependencies
npm install

# Start in watch mode
npm run start watch

# Run linter
npm run lint

# Automatically fix linting issues
npm run lint:fix

# Build for production
npm run build

# Clean build files
npm run clean

# Rebuild from scratch
npm run rebuild
```

### Run in Test Mode

```powershell
# Start the test harness
npm start watch
```

This will open a browser window where you can test the component in isolation.

### Script Structure

| Script | Description |
|--------|-------------|
| `build` | Compiles the PCF component |
| `clean` | Removes build files |
| `lint` | Runs ESLint to check code |
| `lint:fix` | Automatically fixes linting issues |
| `rebuild` | Cleans and rebuilds the project |
| `start` | Starts the test harness |
| `start:watch` | Starts the test harness in watch mode |
| `refreshTypes` | Updates TypeScript types from the manifest |

## ?? Project Structure

```
UserAndTeamSelector/
??? UserAndTeamSelector/              # Component source code
?   ??? ControlManifest.Input.xml    # Component definition (properties, resources)
?   ??? index.ts                      # PCF control entry point
?   ??? components/
?   ?   ??? UserAndTeamSelector.tsx   # Main React component
?   ??? generated/
?   ?   ??? ManifestTypes.d.ts        # Auto-generated TypeScript types
?   ??? strings/
?       ??? UserAndTeamSelector.1033.resx  # English resources
?       ??? UserAndTeamSelector.1034.resx  # Spanish resources
??? obj/                              # Temporary build files
??? eslint.config.mjs                 # ESLint configuration
??? package.json                      # Dependencies and npm scripts
??? pcfconfig.json                    # PCF project configuration
??? tsconfig.json                     # TypeScript configuration
??? UserAndTeamSelector.pcfproj       # MSBuild project file
??? README.md                         # This file
```

### Key Files

- **`ControlManifest.Input.xml`**: Defines the control's properties, resources, and capabilities
- **`index.ts`**: Implements the PCF `StandardControl` interface and manages the lifecycle
- **`UserAndTeamSelector.tsx`**: Contains all UI and business logic in React
- **`ManifestTypes.d.ts`**: Auto-generated types from the manifest (do not edit)

## ?? Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **TypeScript** | 5.8.3 | Programming language |
| **React** | 16.14.0 | UI framework |
| **React DOM** | 16.14.0 | React rendering |
| **Fluent UI React Components** | 9.46.2 | Design system |
| **Power Apps Component Framework** | 1.3.16 | PCF framework |
| **ESLint** | 9.25.1 | Code linter |
| **Power Apps ESLint Plugin** | 0.2.51 | PCF-specific rules |
| **PCF Scripts** | 1.x | Build tools |

## ?? Troubleshooting

### The component doesn't update the field

**Problem**: When selecting a user or team, the value is not saved.

**Solution**: 
- Make sure the record is saved before attempting to select
- Verify that the field is of type Lookup and accepts `systemuser` and `team` types
- Check the browser console for specific error messages

### Recent items don't appear

**Problem**: Recent selections don't show up.

**Solution**:
- Verify that localStorage is enabled in the browser
- Check that there are no third-party cookie restrictions
- Recent items are user-specific (based on `userId`)

### Error: "Missing required parameters"

**Problem**: An error appears indicating required parameters are missing.

**Solution**:
- The record must be saved (must have a valid ID)
- Save the form before using the control for the first time
- Verify that the field is correctly bound to the control

### The dropdown doesn't position correctly

**Problem**: The dropdown menu appears in the wrong position.

**Solution**:
- May occur in forms with lots of scroll or inside iframes
- The component uses `position: fixed` with dynamic calculations
- Try scrolling to the control before opening it

### No users or teams appear in search

**Problem**: The search doesn't return results.

**Solution**:
- Verify that the current user has read permissions on `systemuser` and `team` entities
- Check that there are active users (`isdisabled eq false`)
- Review the `showUsers` and `showTeams` control properties

### TypeScript type compilation error

**Problem**: Type errors when compiling.

**Solution**:
```powershell
# Regenerate types from the manifest
npm run refreshTypes

# Clean and rebuild
npm run rebuild
```

## ?? Contributing

Contributions are welcome. Please follow these steps:

1. **Fork** the repository
2. **Create** a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow established code conventions (ESLint)
- Add tests if applicable
- Update documentation as needed
- Write descriptive commit messages
- Ensure code compiles without errors

## ?? License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## ?? Authors

**Alejandro Caravantes** - [https://www.linkedin.com/in/acaravantesmolina/](https://www.linkedin.com/in/acaravantesmolina/)

## ?? Acknowledgments

- Power Apps Component Framework Team
- React Community
- Fluent UI Design System

## ?? Support

If you encounter any issues or have questions:

- ?? **Issues**: [Report a bug](../../issues)
- ?? **Discussions**: [Ask a question or make a suggestion](../../discussions)
- ?? **Email**: acaravantes@gmail.com

---

**Developed with ??**

![Power Apps](https://img.shields.io/badge/Power%20Apps-742774?style=for-the-badge&logo=powerapps&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
