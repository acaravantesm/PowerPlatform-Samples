# Envío de trazas desde Plugins hacia Application Insights

![](https://static.wixstatic.com/media/9456da_b311cbae5d0846d6a78f87c895feb70b~mv2.jpg/v1/fill/w_147,h_100,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_b311cbae5d0846d6a78f87c895feb70b~mv2.jpg)

Aunque estemos en un cada vez más extendido concepto "low-code/no-code", es muchísimo más frecuente de lo que en un principio puede parecer, necesitar implementar alguna funcionalidad escribiendo código customizado. Para estos casos en los que nos encontramos en un entorno de desarrollo, implementando funcionalidad conPluginsdeDataverse, resulta muy útil activar lastrazasylogginga nivel de instancia para depurar y optimizar lo que estamos programando. Si no sabes como hacerlo, aquí tienes ladocumentación oficial.

Pero también es cierto que si necesitamos tener información detallada sobre la ejecución de losPluginsen entornos productivos, la funcionalidad que comento en el párrafo anterior puede no ser la mejor solución.

Por si no lo conocías,Application Insightses el componente deAzure Monitorque nos permite analizar, monitorizar y supervisar prácticamente cualquier tipo de aplicación. Es cada vez maz común encontrarnos en algún cliente donde ya se esté utilizando este componente como destino de las trazas y los logs de las aplicaciones existentes. Por lo que si te encuentras en este escenario, te invito a que sigas leyendo y exprimas al máximoApplication Insightspara analizar y monitorizar tambien tus aplicaciones basadas en modelos y en concreto losPluginsque hayas implementado.

Lo primero que necesitamos es crear un recursoApplication Insightsen una suscripción deAzureque resida en el mismo tenant del entorno deDataversecon el que vamos a trabajar. No me voy a detener en esto, ya que es algo extremandamente sencillo como puedes veraquí.

![](https://static.wixstatic.com/media/9456da_2aaa2e9ce1a74e9595326007ec55c30b~mv2.png/v1/fill/w_48,h_44,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_2aaa2e9ce1a74e9595326007ec55c30b~mv2.png)

Una vez esté creado el recurso enAzure, ve al portal de administración deMicrosoft Power Platform,y seleccionaAnálisis, Exportación de datosy haz clic en el botónNueva exportación de datos.Se abrirá un panel lateral donde debes seleccionar el entorno con el que vas a trabajar.

![](https://static.wixstatic.com/media/9456da_0f1d47b3beff4046b8a4902298fc8775~mv2.png/v1/fill/w_48,h_44,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_0f1d47b3beff4046b8a4902298fc8775~mv2.png)

Cuando lo hayas hecho seleccionaSiguientee introduce los datos del recursoApplication Insightsque has creado en el paso anterior:Suscripción, Grupo de Recursos y Recurso.

Fíjate que sólo haciendo lo que acabamos de hacer ya se están enviando datos de telemetría y logs hacia el recurso deAzure, por lo que ya podemos explotar cierta información sobre el rendimiento del entorno que acabamos de conectar.

Ahora vamos a actualizar el código de nuestroPluginpara que envíe las trazas al componenteApplication Insightsque acabamos de configurar. Para ello lo único que tenemos que hacer es obtener el servicio de log, desde elServiceProviderde nuestroPlugincon la siguiente sentencia:

![](https://static.wixstatic.com/media/9456da_f06ea7322de44b40ae8b833b9cb36dcc~mv2.png/v1/fill/w_79,h_11,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_f06ea7322de44b40ae8b833b9cb36dcc~mv2.png)

Es importante recalcar que aunque tengamos la integración conApplication Insights, y estas se envíen al componente deAzurea través de la variablelogger, si quieres seguir enviando trazas a la tablaPlug-in Trace LogsdeDataverse,debes seguir utilizando la variabletracercomo siempre se ha hecho.

A partir de aquí sólo hay que utilizar el métodoLogInformationpara que las trazas lleguen aApplication Insights. En este caso yo dispongo de dosPlugins: uno que se ejecuta al actualizarContactosy otro que se desencadena al actualizarCuentas.

Fíjate el mensaje que utilizo, para generar la traza que se envía aAzurey observa además los campos que obtengo dePostImagepara evitar hacer llamadas innecesarias aDataverse:

![](https://static.wixstatic.com/media/9456da_cc4ab15697db4aa0b2f3d94a606ba150~mv2.png/v1/fill/w_62,h_20,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_cc4ab15697db4aa0b2f3d94a606ba150~mv2.png)

![](https://static.wixstatic.com/media/9456da_06601adad84d4dd3911e9dd5214524e3~mv2.png/v1/fill/w_49,h_29,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_06601adad84d4dd3911e9dd5214524e3~mv2.png)

Cuando hayas incluido todas las trazas necesarias en elPlugin, actualízalo conPlugin Registration Tooly cuando se hayan desencadenado varias ejecuciones, dirígete a la consulta deRegistrosde tu componenteApplication Insights. Primero lanza una consulta sobre la tablatracesy comprueba que estan llegando trazas. Observa la estructura de los datos que se almacenan en el componente. Verás que hay un montón de información adicional al mensaje que hemos construido que...¡puedes explotar como quieras!

¿Como quiera?. Si. Has leido bien. Si juegas un poquito conKusto Query, verás que puedes explotar estas trazas a tu antojo y utilizando consultas con una estructura parecida a la que ves a continuación...

![](https://static.wixstatic.com/media/9456da_472e0884218a47289c5c654dc39d36ac~mv2.png/v1/fill/w_45,h_4,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_472e0884218a47289c5c654dc39d36ac~mv2.png)

...puedes construir gráficos que de un simple vistazo te cuenten quéPluginsson los que más se están ejecutando...

![](https://static.wixstatic.com/media/9456da_1188a11bb428443aa908a9680aec6361~mv2.jpg/v1/fill/w_147,h_67,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_1188a11bb428443aa908a9680aec6361~mv2.jpg)

...o qué usuarios son los que están desencadenando la ejecución de losPlugins.

![](https://static.wixstatic.com/media/9456da_f7fb6e55ab524620a89839a707b95b12~mv2.jpg/v1/fill/w_147,h_63,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_f7fb6e55ab524620a89839a707b95b12~mv2.jpg)

Application Insightsalmacena en distintastablastoda la información de telemetría que podamos necesitar:

* Page Viewspara registrar todas las acciones que cada usuario realiza sobre nuestras aplicaciones basadas en modelos.
Page Viewspara registrar todas las acciones que cada usuario realiza sobre nuestras aplicaciones basadas en modelos.

* Exceptionspara almacenar todas las excepciones no manejadas o customizadas.
Exceptionspara almacenar todas las excepciones no manejadas o customizadas.

* Requests, donde se van a guardar todas las llamadas a través de Web Api y Organization Service.
Requests, donde se van a guardar todas las llamadas a través de Web Api y Organization Service.

* Dependencies, donde podremos consultar todas las operaciones comoExecuteMultipleRequest,Retrieve, etc
Dependencies, donde podremos consultar todas las operaciones comoExecuteMultipleRequest,Retrieve, etc

* Traces, el cajón de sastre donde va todo lo que se invoque desde lel métodoLogInformation.
Traces, el cajón de sastre donde va todo lo que se invoque desde lel métodoLogInformation.

Esto no se queda sólo en construir gráficos. Por si no lo sabías, también podemos configurarApplication Insightspara "monitorizar" las trazas, y si alguna de estas trazas muestra información no esperada, el propio componente genera alertas vía mail/sms o incluso desencadena la ejecución de unaAzure FunctionoLogic App. Aquí tienes ladocumentación oficial.

Gracias por tu tiempo y.... ¡Nos vemos en la próxima!

Etiquetas:

* Power Apps
* Dataverse
* Azure
* Dataverse
* Power Apps
* Azure
