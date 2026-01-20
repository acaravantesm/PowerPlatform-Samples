# Azure Key Vault para securizar Environment Variables

![](https://static.wixstatic.com/media/9456da_8f10d57a59f140ea92b48be707e4a4f5~mv2.jpg/v1/fill/w_100,h_49,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_8f10d57a59f140ea92b48be707e4a4f5~mv2.jpg)

Si has trabajado desarollando componentes sobreAzure, seguro queAzure Key Vaultte suena mucho en relación a temas de securización de datos y parámetros sensibles o como almacén de claves y certificados. Gracias a este componente, lo de almacenar cadenas de conexión a una base de datos en los ficheros de configuración de unApp Serviceo unaAzure Functionha pasado a mejor vida.  Datos como las cadenas de conexión o cualquier información susceptible de ser securizada, puede ser almacenada de forma segura en este componente (en forma desecreto) de tal forma que se reduce enormemente el riesgo de seguridad que implica que información sensible de este tipo pueda quedar expuesta a algún usuario o aplicación indebido. Te dejo ladocumentación oficialde este componente que puede ser de gran ayuda en múltiples escenarios.

En este post vamos a ver cómo podemos hacer uso deAzure Key Vaultpara securizar las variables de entorno que vayamos creando enPower Platform. De esta forma el valor de la variable de entorno no va a quedar expuesto a todos los usuarios que tengan permisos para leer la tablaEnvironment Variable Value, si no que el valor de estas variables va a ser almacenado de forma segura enAzure Key Vaultysólolos usuarios con el acceso específico de lectura de secretos van a tener acceso a la información sensible.

Lo primero que tenemos que comprobar es si en lasuscripcióndeAzuredonde vamos a crear nuestroKey Vaulttenemos registradoMicrosoft.PowerPlatformcomoresource provider.Para ello dirígete al portal deAzure, selecciona la suscripción deseada y ve a la opciónResources Providers.En la barra de búsqueda introduceMicrosoft.PowerPlatformy si el estado esNotRegistered, seleccionalo y haz clic enRegister.

![](https://static.wixstatic.com/media/9456da_768a8b6f1b184da88aa0b45e659114b6~mv2.png/v1/fill/w_49,h_31,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_768a8b6f1b184da88aa0b45e659114b6~mv2.png)

Lo siguiente que vamos a hacer es crear un grupo de recursos si no dispones de uno ya, y crear el componenteKey Vault. Introduce un nombre descriptivo y crea el componente. Una vez se haya creado el recurso, necesitamos realizar dos configuraciones de seguridad sobre el propioKey Vault:

![](https://static.wixstatic.com/media/9456da_94616881521444e09bb9cabd58748ef1~mv2.png/v1/fill/w_49,h_24,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_94616881521444e09bb9cabd58748ef1~mv2.png)

La primera configuración necesaria para que el usuario que desdePower Platformpueda consumir los secretos delKey Vault, es asociar a este usuario y en el propio recurso el rol de seguridadKey Vault Reader. Para ello accede alKey Vaultque acabas de crear y en la opciónAccess Control (IAM)selecciona la opciónAddy seguidamenteAdd Role Assignment. Haz clic sobre el rol de seguridadKey Vault Readery en la siguiente ventana podrás indicar el usuario al que se le va a asociar este rol. En mi caso voy a crear un flujo dePower Automateque va a consultar el secreto almacenado en elKey Vaultpor lo que mi usuario configurado en este paso será el mismo usuario que ejecute el flujo dePower Automate.

![](https://static.wixstatic.com/media/9456da_d993087ddf9a4266b7c672bd7598a457~mv2.png/v1/fill/w_49,h_24,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_d993087ddf9a4266b7c672bd7598a457~mv2.png)

La segunda configuración de seguridad que vamos a realizar es la creación de una política de acceso alKey Vaultpara que elservice principaldeDataversepueda leer los secretos almacenados en el propio recursoKey Vault. Para esto desde la ventana de detalle delKey Vaulthaz clic enAccess Policiesy selecciona la opciónAdd Access Policy. En el desplegable con nombreSecret permissions, selecciona la opciónGet. Dirígete a la secciónSelect principaly haz clic enNone selected. En la barra de búsqueda de la nueva ventana emergente que aparece a la derecha escribeDataversey selecciona elservice principalcon id00000007-0000-0000-c000-000000000000. Por último haz clic en el botónSelecty posteriormente en el botónAdd. No te olvides de hacer clic en el bótonSavepara que se guarden los cambios.

Ya tenemos toda la configuración necesaria realizada, por lo que a continuación solo nos falta crear el secreto pertinente con la información sensible a securizar. Para ello desde la ventana delKey Vaulthaz clic en la opciónSecretsy a continuación enGenerate/Import.En el campoNameintroduce un nombre descriptivo para el secreto y en el campoValue, la información sensible que queremos securizar. En mi caso una vez creado, el secreto tiene el siguiente aspecto.

![](https://static.wixstatic.com/media/9456da_d749ee853b9b42acb7e84a9e00da46e0~mv2.jpg/v1/fill/w_140,h_61,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_d749ee853b9b42acb7e84a9e00da46e0~mv2.jpg)

![](https://static.wixstatic.com/media/9456da_b6012e10b107425cb762e4b1c4aa2b7c~mv2.png/v1/fill/w_87,h_244,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_b6012e10b107425cb762e4b1c4aa2b7c~mv2.png)

Ya hemos terminado en el portal deAzure. Lo siguiente que vamos a hacer es crear la variable de entorno en una solución desde el portal dePower Platformy configurar esta variable de entorno para que apunte al secreto que acabamos de crear. Para ello desde una solución, seleccionaNew,MoreyEnvironment Variable. En el nuevo panel emergente de la derecha, verás que el último campo con nombreData Typeofrece distintas opciones: desde crear una variable de entorno de texto plano, pasando por un valor en formato JSON, etc. Selecciona la última opción con nombreSecret. Como puedes ver al seleccionarAzure Key VaultcomoSecret Storey al hacer clic sobreNew Azure Key Vault secret referenceaparecen nuevos campos donde lo único que tenemos que hacer es introducir la información del secreto al que vamos a apuntar desde nuestra nueva variable. Estos nuevos campos son elAzure Subscription Idque contiene elKey Vaultque hemos creado, elgrupo de recursosdonde reside el propioKey Vault, elnombre del recursoy elnombre del secreto. En mi caso la configuración es como la que puedes ver en la imagen.

Antes de seguir, vamos a hacer un pequeño paréntesis y consulta por favor la tablaEnvironment Variable Values. Observa que donde antes se almacenaba el valor en texto plano que establecíamos en nuestras variables de entorno, ahora se está guardando elendpointdel secreto que hemos indicado cuando hemos creado la variable.

![](https://static.wixstatic.com/media/9456da_b5ea4f053194480898c62af97a910772~mv2.png/v1/fill/w_49,h_15,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_b5ea4f053194480898c62af97a910772~mv2.png)

Continuemos con la prueba de concepto que estamos haciendo hoy que ya estamos casi al final 💪.

Lo siguiente que voy a hacer es crear un flujo dePower Automateque va a trabajar con la variable de entorno que hemos creado. Algo muy sencillito a modo prueba de concepto. Te adelanto que para trabajar con las variables de entorno que apuntan a secretos almacenados enAzure Key Vaultvas a tener que trabajar con lasunbound actionsdeDataverse. Concretamente con la que se llama:RetrieveEnvironmentVariableSecretValue.Añade una nueva acción al flujo dePower Automatey utiliza el conector deDataverse. La acción que has de seleccionar se llamaPerform an unbound action. Cuando aparezcan lasunbound actionsdisponibles selecciona la que comento un poquito mas arriba. Por último en el campo nombre, indica el nombre interno de la variable de entorno que has creado. En mi caso la configuración del flujo es parecida a la que se ve a continuación.

![](https://static.wixstatic.com/media/9456da_9fe38879d6864e659f300d3333ffd964~mv2.png/v1/fill/w_49,h_19,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_9fe38879d6864e659f300d3333ffd964~mv2.png)

No te olvides desecurizar losoutputsde esta acción desde las opciones de la propia acción, si estás construyendo un flujo para algo que no sea una prueba de concepto.

Si todo ha ido bien y no hay ningun problema de seguridad y/o configuración, al testear y ejecutar el flujo podrás ver que el valor del secreto consultado es devuelto al propio flujo en la variable con nombreEnvironmentVariableSecretValue.

![](https://static.wixstatic.com/media/9456da_c8bbcd7bbc9649ed81ab8772ff768e62~mv2.png/v1/fill/w_61,h_109,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_c8bbcd7bbc9649ed81ab8772ff768e62~mv2.png)

¡Espero que esta lectura haya sido de ayuda! ¡¡Nos vemos en la siguiente!!