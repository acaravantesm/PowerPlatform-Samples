using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace SetBusinessUnit
{
    /// <summary>
    /// Plugin que gestiona la asignación de Business Unit al usuario según su pertenencia a equipos de tipo Grupo de Seguridad de Entra ID.
    /// 
    /// Registro del Plugin:
    /// - Entidad: team
    /// - Mensaje: Associate (para añadir usuarios)
    /// - Mensaje: Disassociate (para eliminar usuarios)
    /// - Etapa: PostOperation
    /// - Modo de ejecución: Asíncrono (recomendado)
    /// 
    /// Comportamiento:
    /// - Associate: Si el equipo es de tipo "Grupo de Seguridad de Entra ID", asigna la BU del equipo al usuario
    /// - Disassociate: Si el equipo es de tipo "Grupo de Seguridad de Entra ID", asigna la BU raíz al usuario
    /// </summary>
    public class AssignBusinessUnitFromTeamPlugin : IPlugin
    {
        private const int TEAM_TYPE_AAD_SECURITY_GROUP = 2;

        public void Execute(IServiceProvider serviceProvider)
        {
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            try
            {
                // Validar mensaje
                if (context.MessageName != "Associate" && context.MessageName != "Disassociate")
                    return;

                // Validar relación
                if (!context.InputParameters.Contains("Relationship"))
                    return;

                Relationship relationship = (Relationship)context.InputParameters["Relationship"];
                if (relationship.SchemaName != "teammembership_association")
                    return;

                // Obtener Target (team) y RelatedEntities (usuarios)
                if (!context.InputParameters.Contains("Target") || !context.InputParameters.Contains("RelatedEntities"))
                    return;

                EntityReference teamRef = (EntityReference)context.InputParameters["Target"];
                if (teamRef.LogicalName != "team")
                    return;

                EntityReferenceCollection relatedUsers = (EntityReferenceCollection)context.InputParameters["RelatedEntities"];
                if (relatedUsers == null || relatedUsers.Count == 0)
                    return;

                // Verificar tipo de equipo
                Entity team = service.Retrieve("team", teamRef.Id, new ColumnSet("teamtype", "businessunitid"));
                
                if (!team.Contains("teamtype") || 
                    ((OptionSetValue)team["teamtype"]).Value != TEAM_TYPE_AAD_SECURITY_GROUP)
                {
                    return;
                }

                // Determinar BU objetivo
                EntityReference targetBU;
                
                if (context.MessageName == "Associate")
                {
                    if (!team.Contains("businessunitid"))
                        return;
                    
                    targetBU = (EntityReference)team["businessunitid"];
                }
                else // Disassociate
                {
                    targetBU = GetRootBusinessUnit(service);
                    if (targetBU == null)
                    {
                        tracingService.Trace("ERROR: No se pudo obtener la Business Unit raíz");
                        return;
                    }
                }

                // Procesar cada usuario
                foreach (EntityReference userRef in relatedUsers)
                {
                    try
                    {
                        // Verificar si ya tiene la BU objetivo
                        Entity user = service.Retrieve("systemuser", userRef.Id, new ColumnSet("businessunitid"));
                        
                        if (user.Contains("businessunitid") && 
                            ((EntityReference)user["businessunitid"]).Id == targetBU.Id)
                        {
                            continue;
                        }

                        // Actualizar BU del usuario
                        Entity userToUpdate = new Entity("systemuser");
                        userToUpdate.Id = userRef.Id;
                        userToUpdate["businessunitid"] = targetBU;
                        service.Update(userToUpdate);

                        tracingService.Trace(string.Format("BU actualizada - Usuario: {0}, Mensaje: {1}, BU: {2}", 
                            userRef.Id, context.MessageName, targetBU.Id));
                    }
                    catch (Exception userEx)
                    {
                        tracingService.Trace(string.Format("Error procesando usuario {0}: {1}", userRef.Id, userEx.Message));
                        // Continuar con los siguientes usuarios
                    }
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace(string.Format("ERROR: {0}", ex.Message));
                throw new InvalidPluginExecutionException(string.Format("Error al asignar la Business Unit: {0}", ex.Message), ex);
            }
        }

        private EntityReference GetRootBusinessUnit(IOrganizationService service)
        {
            QueryExpression query = new QueryExpression("businessunit")
            {
                ColumnSet = new ColumnSet("businessunitid"),
                TopCount = 1
            };
            query.Criteria.AddCondition("parentbusinessunitid", ConditionOperator.Null);

            EntityCollection results = service.RetrieveMultiple(query);
            
            return results.Entities.Count > 0 
                ? new EntityReference("businessunit", results.Entities[0].Id) 
                : null;
        }
    }
}
