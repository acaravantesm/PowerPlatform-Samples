# Exponer flujos de Power Automate a través de API Management

![](https://static.wixstatic.com/media/9456da_032325a1d9064ecf8e75893775eaa94d~mv2.png/v1/fill/w_49,h_27,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_032325a1d9064ecf8e75893775eaa94d~mv2.png)

¿Te has encontrado en alguna ocasión en un escenario dónde numerosas automatizaciones son desencadenadas por llamadas HTTP? ¿Donde esas llamadas HTTP puedan venir desde multitud de lugares y/o usuarios? Para este tipo de escenarios podemos exponerAzure API Managementcomo única puerta de entrada, y configurar todos los flujos desencadenados vía HTTP comobackendde nuestra arquitectura.

¿Qué ventajas obtenemos de implementar una arquitectura de este tipo? Pues aunque en un principio no te puedan parecer muchas, si que lo son:

* Autenticación conJWT: podemos configurarAPI Managementpara que autentique lasrequestantes de enviarlas albackend(los flujos dePower Automateen nuestro caso). Esto lo veremos en una parte II de esta entrada ☺️.
Autenticación conJWT: podemos configurarAPI Managementpara que autentique lasrequestantes de enviarlas albackend(los flujos dePower Automateen nuestro caso). Esto lo veremos en una parte II de esta entrada ☺️.

* Seguridad y prevención de ataques: en una arquitectura de este tipo, es en el propioAPI Managementen quien delegamos toda la responsabilidad para prevención de ataques e incluso rechazarrequestde un determinado solicitante si se detecta algo sospechoso, antes de que lleguen albackend.
Seguridad y prevención de ataques: en una arquitectura de este tipo, es en el propioAPI Managementen quien delegamos toda la responsabilidad para prevención de ataques e incluso rechazarrequestde un determinado solicitante si se detecta algo sospechoso, antes de que lleguen albackend.

* Transformación derequestyresponse:podemos sobreescribir y transformar tanto elbodyde larequest que vamos a enviar a nuestro flujo dePower Automate, como elbodydelresponseque devuelve el propio flujo. Esto es una ventaja grande sobre todo para no tener que ir modificando flujo por flujo si necesitamos modificar laresponse.También es una gran ventaja si ya hay clientes invocando nuestraAPI Managementya que podemos modificar el backend sin impactar en los clientes.
Transformación derequestyresponse:podemos sobreescribir y transformar tanto elbodyde larequest que vamos a enviar a nuestro flujo dePower Automate, como elbodydelresponseque devuelve el propio flujo. Esto es una ventaja grande sobre todo para no tener que ir modificando flujo por flujo si necesitamos modificar laresponse.También es una gran ventaja si ya hay clientes invocando nuestraAPI Managementya que podemos modificar el backend sin impactar en los clientes.

* Normalización de las URL´s ya que al utilizarAPI Management, podemos configurar la estructura de la URL a la que se va a necesitar invocar.
Normalización de las URL´s ya que al utilizarAPI Management, podemos configurar la estructura de la URL a la que se va a necesitar invocar.

* Facilidad para evolucionar y mantener los componentes ya que podemos crear revisiones dentro deAPI Managementque no van a estar disponibles hasta que publiquemos esa versión de nuestra "api".
Facilidad para evolucionar y mantener los componentes ya que podemos crear revisiones dentro deAPI Managementque no van a estar disponibles hasta que publiquemos esa versión de nuestra "api".

Seguro que si nos ponemos sacamos muchas mas ventajas 😎.

Antes de empezar, crea varios flujos dePower Automatecuyo desencadenador sea unHTTP Requesty guárdalos para que genere la URL a la que debemos invocar para cada uno de ellos. En mi caso, he creado uno con el siguiente aspecto. Algo muy sencillito.

![](https://static.wixstatic.com/media/9456da_8bf5d0f59db04dc09cdf9f0c93631633~mv2.png/v1/fill/w_123,h_212,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_8bf5d0f59db04dc09cdf9f0c93631633~mv2.png)

Lo siguiente que necesitamos es crear un recursoAPI Managementen nuestra suscripción deAzure. Para esta prueba de concepto utiliza el planDeveloper. Esto tiene poco misterio: dirígete al portal deAzure, selecciona un grupo de recursos donde trabajar o crea uno nuevo y a continuación crea el componenteAPI Management. Fíjate que podemos configurar monitorización, acceso a redes virtuales, etc, etc. Aquí hay mucha tela que cortar, pero para esta prueba de concepto no me voy a entrener explicando nada de esto. Introduce los parámetros obligatorios y crea el recurso.

![](https://static.wixstatic.com/media/9456da_2e4aae335a704d708871d078eaeb8753~mv2.png/v1/fill/w_76,h_67,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_2e4aae335a704d708871d078eaeb8753~mv2.png)

Antes de seguir y a modo de inciso, unos conceptos básicos deAPI Management:

* Un recursoAPI Managementse compone de N APIs
Un recursoAPI Managementse compone de N APIs

* Una API se compone de M operaciones
Una API se compone de M operaciones

* Cuando una operación se ejecuta, se hace en 4 fases:Frontend: donde se realizan comprobaciones de seguridad y autenticaciónInbound Processing: donde podemos sobreescribir y modificar casi a nuestro antojo los parámetros que vamos a enviar al backend en larequestBackend: donde como te imaginarás está lachichade lo que se va a ejecutarOutbound Processing: donde como enInbound Processingpodemos sobreescribir y modificar casi a nuestro antojo los parámetros que vamos a devolver al solicitante en laresponse.
Cuando una operación se ejecuta, se hace en 4 fases:

* Frontend: donde se realizan comprobaciones de seguridad y autenticación
Frontend: donde se realizan comprobaciones de seguridad y autenticación

* Inbound Processing: donde podemos sobreescribir y modificar casi a nuestro antojo los parámetros que vamos a enviar al backend en larequest
Inbound Processing: donde podemos sobreescribir y modificar casi a nuestro antojo los parámetros que vamos a enviar al backend en larequest

* Backend: donde como te imaginarás está lachichade lo que se va a ejecutar
Backend: donde como te imaginarás está lachichade lo que se va a ejecutar

* Outbound Processing: donde como enInbound Processingpodemos sobreescribir y modificar casi a nuestro antojo los parámetros que vamos a devolver al solicitante en laresponse.
Outbound Processing: donde como enInbound Processingpodemos sobreescribir y modificar casi a nuestro antojo los parámetros que vamos a devolver al solicitante en laresponse.

Cuando se haya terminado de crear el recurso, dirígete aAPIs, seleccionaAdd APIe introduce un nombre y un nombre para mostrar de la API que estas creando. En la parte donde te pide que indiquesWeb Service URL,introduce la URL necesaria para desencadenar flujo dePower Automateque estés dando de alta en este momento. Pero... ¡Cuidado! No introduzcas toda la URL, introduce únicamente hasta la palabratriggers (incluida) y guarda el resto de la URL. Observa también lo interesante de poder añadir unsuffixa la URL en caso de que eseAPI Managementse esté utilizando como puerta de entrada a mas APIs que no tengan que ver con las APIs que estamos configurando nosotros. En mi caso, queda de la siguiente forma:

![](https://static.wixstatic.com/media/9456da_a4b810497d23495380c5f4487abcde41~mv2.png/v1/fill/w_49,h_22,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_a4b810497d23495380c5f4487abcde41~mv2.png)

Una vez creada la API, vamos a crear una operación para esta nueva API. Desde el detalle de la propia API, seleccionaAdd Operation. Necesitaremos indicar el nombre de la operación, el método con el que vamos a invocar a nuestro flujo, asi como los parámetros que le vamos a hacer llegar al flujo desde larequest. Parámetros que pueden configurarse para ir en laquery, en elheadero en elbody.

Date cuenta que la parte de la URL que debemos indicar en el parámetro de la operación, representa la parte de la URL queAPI Managementva a exponer para invocar a esta operación. En mi caso la configuración de la operación queda así:

![](https://static.wixstatic.com/media/9456da_25a1b1a299b749bd983b57189282f4da~mv2.png/v1/fill/w_49,h_24,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_25a1b1a299b749bd983b57189282f4da~mv2.png)

Además, como el flujo con el que estoy trabajando va a recibir parámetros en elbodyde larequest, he aprovechado también para indicar elschemadelbodyque esperamos recibir:

![](https://static.wixstatic.com/media/9456da_037cab6ff2094a77b9891da67357dd67~mv2.png/v1/fill/w_49,h_24,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_037cab6ff2094a77b9891da67357dd67~mv2.png)

Aprovecha también para ir a la pestañaSettingsy desactivar la casilla que indicaSubscription required, que para esta prueba de concepto no va a ser necesario.

Ya hemos configurado elFrontend, vamos conInbound Processing. Selecciona el icono</>de estaetapa y añade lo siguiente:

```powerapps
<policies>
    <inbound>
        <base />
        <set-method id="apim-generated-policy">POST</set-method>
        <set-header id="apim-generated-policy" name="Ocp-Apim-Subscription-Key" exists-action="delete" />
        <rewrite-uri id="apim-generated-policy" template="/manual/paths/invoke/?api-version=2016-06-01&amp;sp=/triggers/manual/run&amp;sv=1.0&amp;sig=dDRHGTIa7XyBZzRSJG4QJYq5ScQbIxqA5ZG1WYMcRgc" />
    </inbound>
<--!    ...    -->
</policies>
```

De la sección de código de arriba me interesa que te quedes con varias cosas:

* Fíjate que el método que hemos configurado al crear la operación, se está estableciendo aquí. En este caso el método POST.
Fíjate que el método que hemos configurado al crear la operación, se está estableciendo aquí. En este caso el método POST.

* Observa también como cuando hemos desactivado la casilla deSubscription required, no ha hecho mas que incluirse una segunda linea en esta configuración, aplicando lo que hemos modificado.
Observa también como cuando hemos desactivado la casilla deSubscription required, no ha hecho mas que incluirse una segunda linea en esta configuración, aplicando lo que hemos modificado.

* ¿Qué te parece la última linea de configuración? ¡Ni mas ni menos que el resto de la URL que expone nuestro flujo dePower Automate!. Cuidado al introducir aqui el resto de la URL de tu flujo ya que vas a tener queescaparlos caracteres "&" por "&amp;"
¿Qué te parece la última linea de configuración? ¡Ni mas ni menos que el resto de la URL que expone nuestro flujo dePower Automate!. Cuidado al introducir aqui el resto de la URL de tu flujo ya que vas a tener queescaparlos caracteres "&" por "&amp;"

Guarda la configuración, guarda la API y abre Postman que vamos a probar esto 😎.

Crea una nueva pestaña e introduce la URL de tu recursoAPI Managementseguido de la operación que vas a invocar. Indica ademas elbodyde larequestsegun lo que hayas configurado. En mi caso queda de la siguiente forma:

![](https://static.wixstatic.com/media/9456da_8c293d73121b4b1b9cd28c3b17775941~mv2.png/v1/fill/w_49,h_25,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_8c293d73121b4b1b9cd28c3b17775941~mv2.png)

En la siguiente entrada vamos a ir un paso mas allá y vamos a configurar la seguridad para autenticar las llamadas a API Management ¡Gracias por tu tiempo! ¡Nos vemos en la siguiente!