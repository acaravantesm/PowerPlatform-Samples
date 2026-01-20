# Custom API en Dataverse (Parte I)

![](https://static.wixstatic.com/media/9456da_5c03e23782874e52b0858c418c0e452b~mv2.png/v1/fill/w_123,h_82,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_5c03e23782874e52b0858c418c0e452b~mv2.png)

Esta es la primera parte de dos, hablando sobre lasCustom APIque ofreceDataverse. Que ¿qué son lasCustom API?. Es una funcionalidad que ofreceDataversey que permite crear API para todas aquellas operaciones que no se cubren con las API estándar que ya vienen de caja. Se me ocurre por ejemplo operaciones o consultas complejas que no puedes ejecutar llamando a la API de la tablaCuentas, o si necesitas customizar el cuerpo de la respuesta de la API. Te dejo unlinkcon toda la documentación oficial.

Vamos a utilizarPostmanpara probar nuestrasCustom API, por lo que te recomiendo que si no lo has leido aún te des una vuelta por elposten el que hablabamos de cómo autenticar llamadas a la API deDatarversecon OAuth.

EnDataversela definición de lasCustom APIse almacenan (cómo no) en tablas. Esto significa que tanto la definición de las propiedades de la API que vamos a crear, como los parámetros de entrada (y sus propiedades), como los parámetros de salida (y sus propiedades) se van a almacenar en estas tablas. El diagrama de relaciones de las tablas es el siguiente:

![](https://static.wixstatic.com/media/9456da_165d441ffc874451a4b994dfdc14264a~mv2.png/v1/fill/w_49,h_26,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_165d441ffc874451a4b994dfdc14264a~mv2.png)

Lo que hoy vamos a hacer es simplemente crear unaCustom APIque consulte una tabla customizada llamadaEnvironments. Vamos al lío.

Lo primero que necesitamos hacer es crear la definición de nuestraCustom API. Para ello ve al portal dePower Apps, crea una nueva solución y añade un nuevo componenteCustom API.

![](https://static.wixstatic.com/media/9456da_37dc8b48da0e42b7b41ab6b2d225b903~mv2.jpg/v1/fill/w_147,h_73,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_37dc8b48da0e42b7b41ab6b2d225b903~mv2.jpg)

Se abrirá una nueva ventana con un formulario que nos pedirá cierta información. Lo que representa cada campo y sus particularidades lo puedes consultaraquí.Ojo que hay tema donde profundizar con esto.

Como yo para este post voy a crear unaCustom APIpara consultar la tablaEnvironmentsdado el identificador del entorno, la configuración de laCustom APIqueda así:

![](https://static.wixstatic.com/media/9456da_27732df04da64e7dbe0a40d42a3cbcb5~mv2.png/v1/fill/w_116,h_192,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_27732df04da64e7dbe0a40d42a3cbcb5~mv2.png)

![](https://static.wixstatic.com/media/9456da_0ee3e56c1e5e4f83a9b3d8c9d77b3c30~mv2.png/v1/fill/w_110,h_140,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_0ee3e56c1e5e4f83a9b3d8c9d77b3c30~mv2.png)

Lo siguiente que vamos a hacer es crear los parámetros de entrada, y los parámetros de salida que devuelve la respuesta. Para ello repite la operación desde la solución que has creado:New,More,Other,Custom API Request Parameter. Al igual que antes se abrirá un nuevo formulario que nos pedirá lainformaciónrelativa al parámetro que estamos creando. En mi caso, el parámetro de entrada que voy a recibir es el identificador de un entorno de tipoGuid, por lo que la configuración de mi único parámetro de entrada es la que puedes ver en esta imagen.

![](https://static.wixstatic.com/media/9456da_40fd83dc76414b4fb993b3d6b6c2d7bc~mv2.png/v1/fill/w_102,h_131,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_40fd83dc76414b4fb993b3d6b6c2d7bc~mv2.png)

Repetimos la operación para crear el parámetro de salida: desde la solución que has creado seleccionaNew,More,Other,Custom API Response Parameter. Aparecerá el formulario de creación del parámetro que nos pedirá todos loscamposnecesarios. Mi API va a devolver unEnvironmentque no es más que el registro de la tabla con el mismo nombre y por eso mi parámetro de salida es tipoEntity. En futuros post veremos algo mas complejo. El parámetro de salida que yo he definido tiene el aspecto de la imagen.

Ahora vamos con la parte que mas me gusta. El código. Manda narices que me dedique allow-codeeh? Ya, yo también me sorprendo...

Vengaal turrón. AbreVisual StudiooVisual Studio Codecon lo que mas cómodo te sientas y crea un proyecto de tipoBibilioteca de Clases. Cuando el proyecto esté creado ve al gestor de paquetesNuGety añade la referenciaMicrosoft.CrmSdk.CoreAssembliestal y como se puede ver en la siguiente imagen:

![](https://static.wixstatic.com/media/9456da_68d5dd3c1ef84c3cbd2810c0860edfa2~mv2.png/v1/fill/w_49,h_20,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_68d5dd3c1ef84c3cbd2810c0860edfa2~mv2.png)

Abre la clase que se ha creado por defecto y renombrala a algo más qdescriptivo. Yo la he llamadoAPIController.cs. Esta API debe implementar la interfazIPluginasí como su métodoExecuteque va a recibir el contexto de la ejecución. Contexto que vamos a poder utilizar tanto para obtener los datos de larequest, como para enviar laresponse, o como para crear conexión contraDataversesi es necesario. Si has implementado antesPluginsdeDynamics(que supongo que si) seguro que todo esto te suena familiar. De todas formasaquítienes la documentación oficial si necesitas mas información.

El código que yo he escrito tiene el siguiente aspecto. Como ves, obtenemos delServiceProvidertodo lo necesario para trabajar: servicio de trazas, contexto de ejecución y servicio de conexión aDataverse.

![](https://static.wixstatic.com/media/9456da_d236ef85d98d48e8b8521286ccb83428~mv2.png/v1/fill/w_49,h_30,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_d236ef85d98d48e8b8521286ccb83428~mv2.png)

Compila el proyecto y abre la herramientaPluginRegistrationTool(si no la has descargado,aquícuentan como obtenerla). Inicia sesión en tu entorno de desarrollo y registra el nuevo ensamblado que acabas de crear seleccionandoRegister,Register New Assembly. Abre la librería compilada y haz clic enRegister Selected Plugins.

![](https://static.wixstatic.com/media/9456da_e21bbbd04b0948eb8cd6db529950255b~mv2.png/v1/fill/w_49,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_e21bbbd04b0948eb8cd6db529950255b~mv2.png)

![](https://static.wixstatic.com/media/9456da_508a7fe824d3440389092b4a236e1c59~mv2.png/v1/fill/w_116,h_195,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_508a7fe824d3440389092b4a236e1c59~mv2.png)

Vámonos de vuelta a la solución que estamos creando en el portal dePower Platformy seleccionaAdd Existing,More,Developer,Plug-in Assemblyy selecciona la librería que acabas de registrar en el paso anterior. Lo único que nos queda para poder invocar a nuestraCustom APIes vincular el registro que hemos creado varios pasos atrás con la librería que acabamos de registrar. Para ello vuelve a la solución y selecciona tuCustom APIy cuando se abra su formulario de edición, vincula la librería en el campo con nombrePlugin Type. En mi caso la configuración queda como puedes ver en la imagen de la izquierda.

¡En principio ya está todo listo! Abre una nueva request dePostmany configura la autenticación como comentamos en elpostanterior. Cuando lo hayas hecho, introduce la url de tu entorno seguida del nombre de tuCustom APIy de tu parámetro de entrada. En mi caso la url es la siguiente:

```powerapps
api/data/v9.2/bpp_GetEnvironment(bpp_EnvId=50afaa86-3654-ec11-8c62-000d3aa85535)
```

Si todo ha ido bien, Postman deberia mostrar una salida parecida a esta:

![](https://static.wixstatic.com/media/9456da_c792ef44bf54457eb6cdaaba5071d557~mv2.png/v1/fill/w_49,h_23,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_c792ef44bf54457eb6cdaaba5071d557~mv2.png)

En el siguiente post lo complicamos todo un poquito más. ¡¡Espero haber sido de ayuda!! ¡¡Hasta la próxima!!