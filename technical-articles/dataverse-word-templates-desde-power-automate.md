# Dataverse Word Templates desde Power Automate

![](https://static.wixstatic.com/media/9456da_92d3b9c595664c9f9aa9284d1d0b1155~mv2.jpg/v1/fill/w_140,h_31,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_92d3b9c595664c9f9aa9284d1d0b1155~mv2.jpg)

Si has jugado conPower Automate, sabrás que el conector de Word Online (Business)tiene una acción que se llama "Populate a Microsoft Word Template". Esta acción lo que hace es generar un documentoWorda partir de una plantilla almacenada enSharepoint, pidiéndonos las variables definidas en la propia plantilla. Muy bien, pero...

¿Qué ocurre si necesitamos mostrar en dicho documento mucha información de un registro almacenado enMicrosoft Dataverse? Es más, si queremos trabajar con colecciones de registros, ¿cómo podemos trabajar con los registros relacionados de un registropadre?.

A este escenario nos tuvimos que enfrentar durante un evento en las oficinas deMicrosoftque tuvo lugar hace unos días. Nos vimos en la necesidad de generar un documentoWorda partir de una plantilla, mostrando información de varios registros almacenados en varias tablas deDataversey mostrar imágenes subidas a estos registros comoNotasen elTimelinedel registro principal. Además la plantilla deWordno queríamos almacenarla enSharepoint.

![](https://static.wixstatic.com/media/9456da_c2de5377eb074e998baadf883012f54d~mv2.png/v1/fill/w_62,h_79,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_c2de5377eb074e998baadf883012f54d~mv2.png)

Antes de nada, vamos a ver como trabajar con plantillas deWordalmacenadas enDataverse, que por si no lo sabías, al igual que  podemos exportar o importar registros desdeMicrosoft ExcelhaciaDataverse, también existe la posibilidad de generar reportes o informes a partir de una plantilla deMicrosoft Wordmostrando datos de uno o varios registros. Para ello, accede al centro de administración dePower Platform, y desde el entorno en el que estés trabajando accede a la opciónSettings. Una vez allí desde el desplegableTemplatesseleccionaDocument Templates. También puedes acceder desde laconfiguración avanzada(para los masoldies) del entorno desde el que estés trabajando.

![](https://static.wixstatic.com/media/9456da_135a1cbc655f4b0fbc125b6581644104~mv2.png/v1/fill/w_118,h_85,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_135a1cbc655f4b0fbc125b6581644104~mv2.png)

Selecciona la opciónNuevay fíjate que puedes generar una plantillaWorda partir de una tabla del entorno sobre el que estés trabajando (Seleccionar entidad). Cuando hayas seleccionado la tabla sobre la que vas a generar la plantilla, lo siguiente que debes hacer es indicar que relaciones van a estar disponibles en tu plantilla para poder insertar registros de dichas tablas.

![](https://static.wixstatic.com/media/9456da_2d1fefd6a33942c990e2a0a8c8eeced2~mv2.png/v1/fill/w_47,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_2d1fefd6a33942c990e2a0a8c8eeced2~mv2.png)

En mi caso voy a trabajar con la tablaCaso (Incident) y voy a traerme las relaciones1:NconNotasyCitasy también la relaciónN:1deCuenta.

Una vez seleccionesDescargar Plantilla, se descargará una plantilla deWordque ya tendrá vinculada la estructura de datos que hemos configurado. Mira como he dado forma a mi plantillaWorddesde la pestañaProgramadory la opciónPanel de asignación XML.

![](https://static.wixstatic.com/media/9456da_197f29cbebeb41de96b7881f301a609a~mv2.png/v1/fill/w_49,h_25,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_197f29cbebeb41de96b7881f301a609a~mv2.png)

Para este ejemplo, voy a mostrar unos datos básicos delCaso, la información básica del contacto principal del caso y lasTareasasociadas a dichoCaso. Muy fácil.

Sólo hace falta subir nuestra plantilla haciendo clic en el botónCargaren elpop-updesde donde nos descargamos la plantilla. A partir de ese momento, cuando accedamos a un registro de la tablaCaso, nos aparecerá una nueva opción desde el botón plantillas deWord.

![](https://static.wixstatic.com/media/9456da_0a27458149f74fddb8a229014e987a01~mv2.png/v1/fill/w_48,h_11,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_0a27458149f74fddb8a229014e987a01~mv2.png)

Si hacemos clic sobre ese nueva opción, se nos descargará un documentoWordgenerado a partir de la plantilla que hemos creado y con todos los datos del registro que estamos visualizando.

![](https://static.wixstatic.com/media/9456da_12df30befa8d410e91f69a660c22b8f9~mv2.png/v1/fill/w_68,h_66,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_12df30befa8d410e91f69a660c22b8f9~mv2.png)

Ahora bien....

Verdaderamente este fue el reto. Ver como éramos capaces de generar este documento desde un flujo automatizado sin necesidad de hacer clic en ningún botón.

Lo primero que se nos ocurrió fue subir esta plantilla aSharepointy ver si con la opción "Populate a Microsoft Word Template" de la que hablábamos al principio, nos era suficiente. La respuesta fue clara:no. Si hacemos eso, el conector deWord Online (Business)nos mostraba una variable con un número como nombre al que debíamos pasarle todo el contexto. No queríamos entretenernos generando un XML al vuelo, que vete tu a saber cómo lo recibíaWordy cómo era capaz de pintarlo.

![](https://static.wixstatic.com/media/9456da_45ec8adf80d84b0d86e295175cbf1b07~mv2.png/v1/fill/w_63,h_23,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_45ec8adf80d84b0d86e295175cbf1b07~mv2.png)

Lo siguiente que intentamos hacer fue ver si desdePower Automateel conector deDataversedisponía de alguna acción (boundounbound) que hiciera referencia a algo relacionado con una plantilla deWordy ver si por ahí podíamos entrar. La respuesta también fue clara:no.

![](https://static.wixstatic.com/media/9456da_2d761c47c5a74303bbf2655f8b210b6d~mv2.png/v1/fill/w_63,h_20,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_2d761c47c5a74303bbf2655f8b210b6d~mv2.png)

![](https://static.wixstatic.com/media/9456da_8e683518be184aa494e2b956f11eee61~mv2.jpg/v1/fill/w_98,h_59,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_8e683518be184aa494e2b956f11eee61~mv2.jpg)

Cuando empezábamos a desesperarnos, de repente vinieron a nuestra mente lasCustom Actiona las que podemos dar forma desde el diseñador clásico deWorkflows. Decidimos entrar por ahí y... ¡premio!. Desde la solución en la que estés trabajando, seleccionaNew > Automation > Process > Action.

Esto abrirá el diseñador clásico deWorkflows. Selecciona la entidad con la que estés trabajando (en este ejemplo estamos trabajando con la tablaCaso) y a continuación seleccionaAgregar Paso > Realizar Acción. Busca una acción con nombreSetWordTemplate.

![](https://static.wixstatic.com/media/9456da_01b41975c0f64619bd5b5b3af25c4b62~mv2.png/v1/fill/w_49,h_17,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_01b41975c0f64619bd5b5b3af25c4b62~mv2.png)

Cuando hayas seleccionado esa acción, lo siguiente que necesitamos es pasarle un par de parámetros a la acción para que pueda ejecutarse correctamente. Haz clic en el botónEstablecer Propiedades. Cuando se cargue elpop-up, fíjate que lo único que necesitamos hacer es establecer los parametros:

* Selected Template: lo único que debemos indicar aquí es la plantilla deWordque generemos generar.
Selected Template: lo único que debemos indicar aquí es la plantilla deWordque generemos generar.

* Target: en esta propiedad lo que debemos indicar es el contexto del registro con el que vayamos a generar la plantilla. En mi caso, el registro principal de la tablaCaso.Si en el desplegable deBuscarno aparece la tabla con la que estas trabajando, asegúrate que dicha tabla tiene activada la opciónFlujos de proceso de negocio😉
Target: en esta propiedad lo que debemos indicar es el contexto del registro con el que vayamos a generar la plantilla. En mi caso, el registro principal de la tablaCaso.Si en el desplegable deBuscarno aparece la tabla con la que estas trabajando, asegúrate que dicha tabla tiene activada la opciónFlujos de proceso de negocio😉

![](https://static.wixstatic.com/media/9456da_e039d210d58b44e4894b5732b936dc29~mv2.png/v1/fill/w_76,h_50,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_e039d210d58b44e4894b5732b936dc29~mv2.png)

Guarda las propiedades del pasoSetWordTemplate, guarda y activa la propia acción y publica tu solución.

Vayámonos de vuelta aPower Automatey selecciona la acciónPerform a Bound Actiondel conector deDataverse. Selecciona la tabla con la que estés trabajando (en esta entrada estamos trabajando con la tablaCaso) y...  ¡voilá!. Ahí está nuestraCustom Actionque espera como parámetro el contexto del registro con el que debe ejecutarse. Establece dicho parámetro y ya tienes tu flujo dePower Automategenerando documentos a partir de plantillasWordalmacenadas enMicrosoft Dataverse, de la misma forma que si hacemosclicen el botón de laCommand Barque veíamos mas arriba.

![](https://static.wixstatic.com/media/9456da_a6da2db579af45dcba66ddfc1b254b82~mv2.png/v1/fill/w_64,h_24,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_a6da2db579af45dcba66ddfc1b254b82~mv2.png)

A partir de aquí puedes almacenar el documento generado enOne Drivey generar el Pdf con la acciónConvert Word Document to Pdfdel conectorWord Online (Business)y trabajar con el documento generado prácticamente a nuestro antojo.

¡Espero haber sido de ayuda! ¡Gracias por haber llegado hasta aquí! ¡Nos vemos en la próxima!

Etiquetas:

* Power Apps
* Dataverse
* Power Apps
* Power Automate
