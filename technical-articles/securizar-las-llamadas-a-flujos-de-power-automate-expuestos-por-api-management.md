# Securizar las llamadas a flujos de Power Automate expuestos por API Management

![](./assets/apim/9456da_22dbbed5ed634b92b1c47bf4d9e865c6~mv2.avif)

Vamos con la segunda parte delpostdonde hablabamos como podemos exponer flujos dePower Automatecuyo desencadenador es un trigger HTTP, a través deAzure API  Management. En esta ocasión vamos a securizar las llamadas aAPI Managementpara añadir una capa de seguridad y autenticar las request que se reciban. Ya te adelanto que toda la autenticación la vamos a delegar, como no podía ser de otra forma enAPI Management.

![](./assets/apim/9456da_23e7b8465a93451e8a85e57fed6d2c5f~mv2.avif)

El flujo de la autenticación por si no lo conoces, es muy simple tal y como puedes ver en la imagen: un cliente solicita un tokenJWTaAzure ADmediante credenciales (también podríamos configurar la autenticación mediante certificado), siAzure ADautoriza al solicitante correctamente le devuelve un token que el cliente deberá incluir en elheaderde la petición aAPI Management.API Managementcomprueba que el token recibido en la petición es un token válido y si la comprobación es correcta envía la petición albackend. En caso contrario rechaza la solicitud y lógicamente elbackendni se entera que ha pasado algo.

Lo primero que necesitamos hacer es registrar dos aplicaciones enAzure ADque representen tanto el cliente que va a invocar a la API como a la propia API. Para ello dirígete al portal deAzure, seleccionaAzure Active DirectoryyApp Registrations. A continuación registra dos aplicaciones. En mi caso las he llamadoAPIManagementAppyAPIManagementClient, como puedes ver en la imagen inferior.

![](./assets/apim/9456da_3d3488760d694a7d8b0f4a4fea54cfe4~mv2.avif)

![](./assets/apim/9456da_5c9920496bb742268baffd899aee5128~mv2.avif)

El segundo paso, si vamos a autenticarnos utilizando la especificación OAuth 2.0 como es este caso, necesitamos actualizar el manifiesto de la aplicación que representa a la API para que trabaje con esta especificación. Para ello selecciona la aplicación que representa la API, y dirígete a la opciónManifest. Modifica la propiedadaccesstokenAcceptedVersionpara que tenga el valor2.

Ahora seleccionaExpose an APIy donde puedes leerApplication ID Uri, seleccionaEstablecer. Acto seguido haz clic enAdd a Scopey establece el scope que va a exponer nuestra API. En mi caso lo que configurado como puedes ver en la imagen.

![](./assets/apim/9456da_d79a6b3da18840239cb5a3dce9cd6681~mv2.avif)

Vamos a continuar ahora configurando la aplicación cliente, creando un secreto. Para ello selecciona esta aplicación, en mi casoAPIManagementClient, y seleccionaCertificados y Secretos. Crea un nuevo secreto y copia el valor del secreto generado ahora, que luego ya no lo podrás copiar😉.

Por último, ve a la opciónPermisos de APIpara otorgar los permisos necesarios a la aplicación que representa la API.SeleccionaAdd a Permissiony busca la aplicación que representa a nuestra API desde la pestañaAPIs my organization uses.Selecciona la aplicación, el scope y haz clic enAdd Permissions.Por ultimo seleccionaGrant admin consentpara confirmar los permisos.

![](./assets/apim/9456da_2229f8a291a64b439c420d5ff4f87102~mv2.avif)

No lo he dicho hasta ahora, pero como siempre durante todo este proceso ve apuntando los identificadores de ambas aplicaciones, el identificador deltenantsobre el que estés trabajando y el secreto generado.

Ya hemos terminado la configuración de las aplicaciones, asi que vamos ahora a configurar nuestro recursoAPI Management. Para ello accede al propio recurso y selecciona la API con la que estés trabajando. Edita laInbound Policye incluye la sección de código que aparece a continuación:

```powerapps
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
            <openid-config url="https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration" />
            <audiences>
                <audience>{APIManagementApp ID}</audience>
            </audiences>
        </validate-jwt>
```

En mi caso queda de la siguiente forma:

![](./assets/apim/9456da_41045fa53bb9436d9ff745bdcfe9aa96~mv2.avif)

¡Ya está! Vamos ahora a probar lo que hemos hecho. Para ello abrePostmany crea una nuevarequesto utiliza la que tenías del post anterior. Fíjate que si intentas ejecutar larequesttal y como la teníamos ya configurada, obtenemos el siguiente error:

![](./assets/apim/9456da_9f02ec3328474014870b07afe0aa8e40~mv2.avif)

Para autenticar la llamada correctamente, ve a la pestañaAuthorizationy en las opciones de configuración establece lo siguiente:

* Grant Type:Client Credentials
Grant Type:Client Credentials

* Access Token URL:https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token
Access Token URL:https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token

* Client ID: el identificador de la aplicación registrada enAzure ADque representa al cliente.
Client ID: el identificador de la aplicación registrada enAzure ADque representa al cliente.

* Client Secret: el valor del secreto que has generado en la aplicación cliente.
Client Secret: el valor del secreto que has generado en la aplicación cliente.

* Scope: elscopeque has creado en la aplicación registrada enAzure ADque representa a la propia API, añadiendo un/.defaultal final
Scope: elscopeque has creado en la aplicación registrada enAzure ADque representa a la propia API, añadiendo un/.defaultal final

Haz clic en el botónGet New Access Tokeny si todo está bien configurado aparecerá un token en la pantalla que podrás incluir en turequesthaciendo click enUse Token. Fíjate en la pestañaHeadersy verásque se ha incluido una nueva entrada con el nombreAuthorizationy el token generado como valor. Envia la request y...voilà

![](./assets/apim/9456da_2648311aae144eb4a6069cf012502cee~mv2.avif)

Antes de finalizar, me gustaría comentar algo que me parece muy importante y es que el nivel de granularidad en la seguridad que podemos configurar va mucho mas allá de lo que estamos haciendo en este post. Digamos que lo que estamos viendo en esta entrada es el primer escalón, pero es muy importante saber que podemos llegar a configurarroles de seguridad, que se incluyen en el token de autenticación generado y que podemos utilizar para controlar las acciones para las que un determinado cliente tiene permisos.

Y como siempre..... ¡Gracias por tu tiempo!. ¡Hasta la siguiente!