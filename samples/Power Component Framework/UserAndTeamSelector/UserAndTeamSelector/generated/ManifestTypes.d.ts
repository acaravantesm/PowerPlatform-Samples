/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    boundField: ComponentFramework.PropertyTypes.LookupProperty;
    showUsers: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    showTeams: ComponentFramework.PropertyTypes.TwoOptionsProperty;
}
export interface IOutputs {
    boundField?: ComponentFramework.LookupValue[];
}
