
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { UserAndTeamSelectorComponent, IProps as UserAndTeamSelectorComponentProps } from "./components/UserAndTeamSelector";

interface IContext extends ComponentFramework.Context<IInputs> {
    page: {
        entityId: string;
        entityTypeName: string;
    };
    utility: ComponentFramework.Utility;
    webAPI: ComponentFramework.WebApi;
}

export class UserAndTeamSelector implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _context: IContext;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._context = context as IContext;
        this._container = container;
        this.renderReactComponent();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context as IContext;
        this.renderReactComponent();
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this._container);
    }
    
    private renderReactComponent(): void {
        const isReadOnly = this._context.mode.isControlDisabled;
        const entityName = this._context.page?.entityTypeName ?? "";
        
        // intentar obtener el ID de diferentes formas
        let currentRecordId = this._context.page?.entityId ?? "";
        
        // si esta vacio, intentar desde mode.contextInfo
        const modeWithContext = this._context.mode as unknown as { contextInfo?: { entityId?: string } };
        if (!currentRecordId && modeWithContext.contextInfo?.entityId) {
            currentRecordId = modeWithContext.contextInfo.entityId;
        }
        
        const boundField = this._context.parameters.boundField;
        
        // Extraer el nombre del campo de los attributes del boundField
        const fieldName = boundField?.attributes?.LogicalName ?? "";
        
        console.log("PCF renderReactComponent", {
            entityName,
            currentRecordId,
            fieldName,
            boundField,
            boundFieldType: typeof boundField,
            boundFieldKeys: boundField ? Object.keys(boundField) : [],
            boundFieldAttributes: boundField?.attributes,
            contextMode: this._context.mode,
            contextPage: this._context.page,
            contextParameters: Object.keys(this._context.parameters),
            modeContextInfo: modeWithContext.contextInfo
        });

        const showUsers = this._context.parameters.showUsers.raw ?? true;
        const showTeams = this._context.parameters.showTeams.raw ?? true;

        const props: UserAndTeamSelectorComponentProps = {
            utility: this._context.utility,
            webAPI: this._context.webAPI,
            currentRecordId: currentRecordId,
            entityName: entityName,
            fieldName: fieldName,
            isDisabled: isReadOnly,
            showUsers: showUsers,
            showTeams: showTeams,
            currentUserId: this._context.userSettings.userId.replace(/[{}]/g, ""),
            resources: this._context.resources
        };

        ReactDOM.render(
            React.createElement(UserAndTeamSelectorComponent, props),
            this._container
        );
    }
}
