# Custom API en Dataverse y response customizada (Parte II)

![](./assets/capi/9456da_5c03e23782874e52b0858c418c0e452b~mv2.avif)

Esta es la segunda parte hablando sobre las Custom API que ofreceDataverse. De dónde venimos lo puedes consultar aquí.

El post de hoy va a ser un poco mas breve ya que la parte mas extensa se nos va en la configuración de nuestra Custom API. Hoy sólo vamos a cambiar los parámetros de entrada y salida y por supuesto el código que ejecuta la API.

¿Qué pasa si no queremos devolver toda la información del registro en el response de la API? ¿Qué pasa si queremos jugar con el cuerpo de la respuesta a nuestro antojo sin necesidad de crear una nueva tabla enDataverse? Hoy vamos a ver comoinventarnosal en tiempo de ejecución la respuesta que devuelve nuestra API.

Siguiendo con el ejemplo anterior, supongamos que tenemos una tabla que almacenaentornosy cada entorno tiene una lista deaplicacionesasociadas. Por otro lado tenemos una tabla que registraorganizacionesque a su vez tienen desde uno hasta nentornos. Dicho de otra forma:1 Organización --> N Entornosy1 Entorno --> N Aplicaciones.

Nuestra Custom APIva a ser capaz de devolver un objeto Organización con una lista anidada deentornosque a su vez tienen una lista anidada deaplicaciones. Tanto la definición del objetoOrganizacióncomo la definición de las listas, la vamso a hacer al vuelo. Es decir no hay ninguna tabla de Dataverse de por medio que defina la estructura de la response que vamos a devolver como hacíamos en la Parte I.

No nos vamos a entrener en cómo dar de alta la propia API ni los parámetros de entrada ya que eso lo vimos en el post anterior. Vamos a partir de unaCustom APIya definida que he llamado GetOrganization, que recibe un parámetro de entrada de tipostringal que he llamado OrgName. Donde si nos vamos a detener es en el parámetro de salida que es aquí donde empieza la magia.

Crea un nuevo parámetro de salida asociado a tu Custom API y en el campo tipo establece el valor EntityCollection.

Vámonos al código. Abre el proyecto que creamos en el post anterior y en la clase APIController.cs crea un nueva condición que se ejecute cuando el mensaje entrante sea el de tu API customizada. El resto lo puedes consultar en la siguiente porción de código. Como ves la magia ocurrecuando creamos objetos de tipo Entity.

## Código del Plugin - APIController.cs

```csharp
public class APIController : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
        ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

        try
        {
            if (context.MessageName.Equals("acm_GetOrganization"))
            {
                string orgName = (string)context.InputParameters["OrgName"];
                
                // Consultar la organización
                QueryExpression orgQuery = new QueryExpression("acm_organization");
                orgQuery.ColumnSet = new ColumnSet("acm_name", "acm_organizationid");
                orgQuery.Criteria.AddCondition("acm_name", ConditionOperator.Equal, orgName);
                
                EntityCollection organizations = service.RetrieveMultiple(orgQuery);
                
                if (organizations.Entities.Count > 0)
                {
                    Entity organization = organizations.Entities[0];
                    
                    // Crear el objeto Entity para la respuesta customizada
                    Entity responseOrg = new Entity("acm_organization");
                    responseOrg["acm_organizationid"] = organization.Id;
                    responseOrg["acm_name"] = organization["acm_name"];
                    
                    // Crear una colección para los entornos
                    EntityCollection environments = new EntityCollection();
                    
                    // Consultar entornos de esta organización
                    QueryExpression envQuery = new QueryExpression("acm_environment");
                    envQuery.ColumnSet = new ColumnSet("acm_name", "acm_environmentid");
                    envQuery.Criteria.AddCondition("acm_organization", ConditionOperator.Equal, organization.Id);
                    
                    EntityCollection orgEnvironments = service.RetrieveMultiple(envQuery);
                    
                    foreach (Entity env in orgEnvironments.Entities)
                    {
                        // Crear objeto Entity para cada entorno
                        Entity responseEnv = new Entity("acm_environment");
                        responseEnv["acm_environmentid"] = env.Id;
                        responseEnv["acm_name"] = env["acm_name"];
                        
                        // Crear colección para las aplicaciones de este entorno
                        EntityCollection applications = new EntityCollection();
                        
                        // Consultar aplicaciones de este entorno
                        QueryExpression appQuery = new QueryExpression("acm_application");
                        appQuery.ColumnSet = new ColumnSet("acm_name", "acm_applicationid");
                        appQuery.Criteria.AddCondition("acm_environment", ConditionOperator.Equal, env.Id);
                        
                        EntityCollection envApplications = service.RetrieveMultiple(appQuery);
                        
                        foreach (Entity app in envApplications.Entities)
                        {
                            Entity responseApp = new Entity("acm_application");
                            responseApp["acm_applicationid"] = app.Id;
                            responseApp["acm_name"] = app["acm_name"];
                            
                            applications.Entities.Add(responseApp);
                        }
                        
                        // Agregar la colección de aplicaciones al entorno
                        responseEnv["applications"] = applications;
                        environments.Entities.Add(responseEnv);
                    }
                    
                    // Agregar la colección de entornos a la organización
                    responseOrg["environments"] = environments;
                    
                    // Crear la colección de respuesta final
                    EntityCollection response = new EntityCollection();
                    response.Entities.Add(responseOrg);
                    
                    // Devolver la respuesta
                    context.OutputParameters["OrganizationData"] = response;
                }
            }
        }
        catch (Exception ex)
        {
            tracingService.Trace("Error en APIController: {0}", ex.ToString());
            throw new InvalidPluginExecutionException("Error al procesar la Custom API", ex);
        }
    }
}
```

Lo importante del fragmento de código es como construimos los objetos Entity. Este código no es un código válido para ser ejecutado en escenarios reales por que puede ocasionar problemas de rendimiento. Si me gustaría aprovechar esta ocasión para destacar que dependiendo en qué escenarios, puede ser mucho más interesante cargar los registros con los que vamos a trabajar al principio y luego utilizar LINQ para obtener los que nos interesen, que estar lanzando RetrieveMultiple dentro de un ForEach. Es de cajón, pero por desgracia esta tontería ocasiona muchos problemas en entornos productivos.

Si esto lo ejecutamos en Postman obtenemos una response totalmente customizada a nuestro gusto. Algo parecido a esto:

## Response de ejemplo en JSON

```json
{
  "@odata.context": "https://yourorg.crm.dynamics.com/api/data/v9.2/$metadata#acm_organizations",
  "value": [
    {
      "@odata.type": "#Microsoft.Dynamics.CRM.acm_organization",
      "acm_organizationid": "12345678-1234-1234-1234-123456789abc",
      "acm_name": "Contoso Ltd",
      "environments": [
        {
          "@odata.type": "#Microsoft.Dynamics.CRM.acm_environment",
          "acm_environmentid": "87654321-4321-4321-4321-abcdef123456",
          "acm_name": "Production Environment",
          "applications": [
            {
              "@odata.type": "#Microsoft.Dynamics.CRM.acm_application",
              "acm_applicationid": "11111111-1111-1111-1111-111111111111",
              "acm_name": "Sales App"
            },
            {
              "@odata.type": "#Microsoft.Dynamics.CRM.acm_application",
              "acm_applicationid": "22222222-2222-2222-2222-222222222222",
              "acm_name": "Service App"
            }
          ]
        },
        {
          "@odata.type": "#Microsoft.Dynamics.CRM.acm_environment",
          "acm_environmentid": "99999999-9999-9999-9999-999999999999",
          "acm_name": "Development Environment",
          "applications": [
            {
              "@odata.type": "#Microsoft.Dynamics.CRM.acm_application",
              "acm_applicationid": "33333333-3333-3333-3333-333333333333",
              "acm_name": "Test App"
            }
          ]
        }
      ]
    }
  ]
}
```

## Puntos Clave

### 1. EntityCollection como Tipo de Respuesta

El uso de `EntityCollection` permite devolver estructuras de datos complejas sin necesidad de crear tablas en Dataverse.

### 2. Construcción de Objetos Entity

Los objetos `Entity` se pueden construir dinámicamente y anidar usando propiedades:

```csharp
Entity parentEntity = new Entity("parent_table");
EntityCollection childCollection = new EntityCollection();
parentEntity["children"] = childCollection;
```

### 3. Consideraciones de Rendimiento

⚠️ **Importante**: Este patrón puede causar problemas de rendimiento en producción. Considera estas mejoras:

```csharp
// ❌ MAL - Múltiples queries en bucle
foreach (Entity env in environments.Entities)
{
    QueryExpression appQuery = new QueryExpression("acm_application");
    appQuery.Criteria.AddCondition("acm_environment", ConditionOperator.Equal, env.Id);
    EntityCollection apps = service.RetrieveMultiple(appQuery);
}

// ✅ BIEN - Una query con todos los datos, luego agrupar con LINQ
QueryExpression allAppsQuery = new QueryExpression("acm_application");
allAppsQuery.ColumnSet = new ColumnSet(true);
EntityCollection allApps = service.RetrieveMultiple(allAppsQuery);

var appsByEnvironment = allApps.Entities
    .GroupBy(app => app.GetAttributeValue<EntityReference>("acm_environment").Id);
```

## Invocación desde Postman

### Request

```http
POST https://yourorg.crm.dynamics.com/api/data/v9.2/acm_GetOrganization
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "OrgName": "Contoso Ltd"
}
```

### Headers Necesarios

- `Content-Type`: `application/json`
- `Authorization`: `Bearer {token}` (obtenido mediante OAuth 2.0)
- `OData-MaxVersion`: `4.0`
- `OData-Version`: `4.0`
- `Accept`: `application/json`

## Referencias

- [Parte I - Creación de Custom API básica](./custom-api-en-dataverse-parte-i.md)
- [Debug de Custom API](./debug-de-custom-api-en-dataverse.md)
- [Documentación oficial de Custom API](https://docs.microsoft.com/power-apps/developer/data-platform/custom-api)

¡¡Espero que este post haya sido de utilidad!!