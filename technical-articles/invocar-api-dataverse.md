# Cómo invocar a la API de Dataverse con autenticación OAuth

![](./assets/apid/9456da_5ee344b297e84b53819a3c6dcdd774ad~mv2.avif)

Hace no mucho tiempo un cliente nos trasladó la necesidad que sistemas terceros de su organización, hicieran consultas a datos almacenados enDataverse. En un principio habían pensado en que construyeramos una capa de servicios que serían a los que estos sistemas invocarían.

Soy un defensor a ultranza de una frase que alguna vez escuché decir a alguien en una situación similar. La frase en cuestión era algo asi como: "siMicrosoftya ha pensado en esto y la tecnología ofrece los componentes necesarios para implementar esta funcionalidad, ¿para qué reinventar la rueda?".

Nos pusimos manos a la obra y el resultado es lo que te cuento a continuación: registro de aplicación en Azure AD, creación de nuevo usuario de tipo "aplicación" enDataverse, y consultas de información aDataversevia API Rest que viene de caja.

Registro de aplicación en Azure AD

Lo primero que tenemos que hacer es registrar una nueva aplicación en el directorio activo deAzure. Es muy importante destacar que lo que necesitamos es que unaaplicaciónse conecte aDataversey no usuarios nominales ya que si ese fuese el caso el escenario sería distinto a lo que vamos a ver aquí.

Como decía lo primero que tenemos que hacer es registrar una aplicación en Azure AD. Yo la he llamado "DataverseAPIClient". Muy original.

Para ello iniciamos sesión en elPortal de Azurecon un usuario con permisos suficientes para registrar aplicaciones. Una vez hemos iniciado sesión, vamos al componenteAzure Active Directoryy a la secciónRegistros de aplicaciones. Una vez allí, seleccionamos la opciónNuevo Registro.

Introducimos un nombre de la aplicación que estamos registrando y el resto de parametros los dejamos tal y como están con su valor por defecto.

![](./assets/apid/9456da_ece81bb674d843bfa9a103d9e532ae57~mv2.avif)

Ve a la página deInformación Generalde la aplicación registrada y copia el valor que aparece enId de Aplicación (Clente)

![](./assets/apid/9456da_24172c14e2ab4d73958bfc9c26d55f7a~mv2.avif)

Ahora haz clic en el botón superior Puntos de conexión y copia el valor del segundo campo de la ventana emergente que aparece, cuyo nombre esPunto de conexión de token de OAuth 2.0 (v2).

![](./assets/apid/9456da_b03593a9b8724710a5d2aeeeedbf4f36~mv2.avif)

Lo siguiente que vamos a hacer es añadir un secreto a la aplicación que acabamos de crear. Para ello desde el detalle de la aplicación recien creada vamos a la secciónCertificados y Secretosy seleccionamos la opciónNuevo Secreto de Cliente. Escribimos el nombre del secreto, el periodo de validez y pulsamosAgregar.Cuidadoaquí que necesitamos copiar elvalordel secreto generado y sólo lo vamos a poder hacer en este momento y no después.

![](./assets/apid/9456da_091555738e754f0eb480474df6c64cbe~mv2.avif)

Creación de nuevo usuario en Dataverse

Una vez tenemos la aplicación registrada en el directorio activo, lo que vamos a hacer es crear un usuario de tipoaplicaciónenDataversevinculado a la aplicación que acabamos de crear.

![](./assets/apid/9456da_8098a15ba43e4f9ab03cfdebfb6af540~mv2.avif)

Para ello accede al portal dePower Apps, selecciona el entorno sobre el que estás trabajando y accede a laConfiguración avanzada. Microsoft está trabajando aun en la migración de toda la funcionalidad a la nueva experiencia y esta parte está aun en elto be, por lo que vamos a navegar al modo clásico. Los mas nostálgicos vamos a echar de menos este modo.

![](./assets/apid/9456da_3fc5a7158b1e4932911d87ea348d5d90~mv2.avif)

Navega hastaSystem,Securityy haz clic enUsers. Una vez veas aparezca la vista de usuarios, asegurate de seleccionar la vista con nombreApplication Users. Cuando hayas seleccionado esta vista haz clic en el botonNewde la barra de herramientas. Esto hará que se abra un formulario de alta de usuarios donde solo vamos a poder introducir el campo con nombreApplication IDya que todos los demás campos son de solo lectura y se van a setear automáticamente al guardar el usuario. Pega el valor que copiaste del campoId de Aplicación (Cliente)en la página deInformación Generalcuando registraste la aplicación en el directorio activo y haz clic en el botónSave. Cuando se guarde el usuario que acabamos de crear aparecerán los valores del resto de campos.

Ahora lo único que nos falta es asociar un rol de seguridad al nuevo usuario desde el botónManage Roles. Para mi prueba de concepto yo he asociado a mi usuario de aplicación el rol deSystem Administrator. Lógicamente esto no es válido en un entorno productivo, por lo que utiliza un rol mas restrictivo o crea un rol customizado con única y exclusivamente los mínimos permisos necesarios que este usuario va a necesitar.

Consumo de la API de Dataverse vía Postman

Vamos a empezar haciendo una prueba sencillita para asegurarnos que la autenticación esta funcionando correctamente. Para ello abre una nuevarequestdePostmane introduce la url que puedes obtener desde laConfiguración Avanzadadel entorno en el que estas trabajando y accediendo a la opicónCustomizations,Developer Resources.Copia el valor que aparece en el campoService Rooty añade al final"/WhoAmI".Tendrás una url parecida a esta:"https://nombredetuentorno.api.crm4.dynamics.com/api/data/v9.2/WhoAmI".

Pega esa url en la nuevarequestdePostmanque has abierto antes y vamos con la parte interesante. Ve a la pestañaAuthorizationy en el desplegableTypeseleccionaOAuth 2.0. En la parte de la derecha bajo el títuloConfigure New Tokenestablece los siguientes valores:

* Gran Type: Client Credentials
Gran Type: Client Credentials

* Access Token Url: el valor que copiaste en el popup dePuntos de conexióndespués de registrar la aplicación en el directorio activo
Access Token Url: el valor que copiaste en el popup dePuntos de conexióndespués de registrar la aplicación en el directorio activo

* Client ID: el valor que copiaste al registrar la aplicación con nombreId de Aplicación (cliente)
Client ID: el valor que copiaste al registrar la aplicación con nombreId de Aplicación (cliente)

* Client Secret: el valor del secreto que creaste en la nueva aplicación
Client Secret: el valor del secreto que creaste en la nueva aplicación

* Scope: la url de tu entorno seguido de"/.default". La url debe ser parecida a esta: "https://nombredetuentorno.api.crm4.dynamics.com/.default"
Scope: la url de tu entorno seguido de"/.default". La url debe ser parecida a esta: "https://nombredetuentorno.api.crm4.dynamics.com/.default"

* Client Authentication: Send as Basic Auth header
Client Authentication: Send as Basic Auth header

Después de todas estas configuraciones la ventana de Postman debe tener un aspecto similar al que se puede ver a continuación. (Consejo: utiliza lasvariablesy losentornosdePostmany cuidado con lascookies!!!)

![](./assets/apid/9456da_240471f2f834408f8fcbfa29ee99ea9a~mv2.avif)

Si todo ha ido bien, cuando hagas clic sobreGet New Access Token,Postmanobtendrá un token de autenticación válido para lanzar cualquier petición aDataversevía API para las que el usuario que has creado tenga permisos. Si ejecutas la operaciónWhoAmIy todo va como debe ir, tendrás un response parecido a este:

```powerapps
{
    "@odata.context": "https://nombredetuentorno.api.crm4.dynamics.com/api/data/v9.2/$metadata#Microsoft.Dynamics.CRM.WhoAmIResponse",
    "BusinessUnitId": "1c009adb-78db-eb11-bacb-000d3ab35ed0",
    "UserId": "0e062d76-0753-ec11-8c62-000d3adcebd7",
    "OrganizationId": "127a529f-52ce-4f64-8a24-8460f2be1ec1"
}
```

A partir de aquí, puedes lanzar consultas sobre las tablas de Dataverse del tipo:

```powerapps
/api/data/v9.1/accounts?$select=name,numberofemployees
&$filter=Microsoft.Dynamics.CRM.Between(PropertyName='numberofemployees',PropertyValues=["5","2000"])
```

Te dejo ellinkde la documentación oficial de Microsoft.

Espero haberte ayudado! Nos vemos en la próxima ;-)