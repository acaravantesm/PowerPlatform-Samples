# Mejora continua de modelos AI Builder

![](https://static.wixstatic.com/media/9456da_9d201bd88a8e4cfd83fe8378bdaf9df8~mv2.jpg/v1/fill/w_147,h_19,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_9d201bd88a8e4cfd83fe8378bdaf9df8~mv2.jpg)

Con todo el boom que hay montado con ChatGPTy sus capacidades (que no es para menos), parece que la IA"tradicional"está empezando a pasar a un injusto segundo plano. Para poner un poco de resistencia en ese proceso, hoy traigo esta entrada en la que vamos a ver como podemos reentrenar a un modelo deAI Builderpara conseguir una mejora continua en los resultados de dicho modelo. En concreto vamos a ver en detalle como podemos reentrenar un modelocustomde procesamiento de documentos.

Cuando trabajamos con este modelo deAI Builder, seguro que alguna vez has pensado: "si muy bonito, pero si quiero reentrenar el modelo tengo que ponerme a buscar documentos que no obtengan buenos resultados de forma manual...". Bueno pues para evitar eso ha llegado a nuestras vidas la funcionalidad deMejora Continua de modelos de AI Builder. A fecha de publicación de este post esta funcionalidad está enpreviewy su salida aGAestá prevista para el próximo mes de Junio.

Vamos a empezar suponiendo que contamos con un flujo dePower Automateque se ejecuta cuando llega un mail con ficheros adjuntos y determinado patrón en el asunto. Este flujo procesa los datos adjuntos del mail, con un modelo deAI Builder. Un aspecto parecido al de la siguiente imagen, ¿cierto?.

![](https://static.wixstatic.com/media/9456da_985f6d2f0a194ec6abcc4c9f879c6997~mv2.png/v1/fill/w_47,h_68,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_985f6d2f0a194ec6abcc4c9f879c6997~mv2.png)

Ademas parto de un modelo deAI Builderde procesamiento de formularios que contiene dos colecciones (una porformato) de los documentos que voy a procesar.

![](https://static.wixstatic.com/media/9456da_113e2e6ac9f7403dba71dc5c675f7894~mv2.png/v1/fill/w_49,h_29,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_113e2e6ac9f7403dba71dc5c675f7894~mv2.png)

Pero bien, ¿qué ocurre si llega un documento de un formato distinto y el porcentaje de confianza que devuelve el modelo comooutputes inferior a un determinado umbral?. Pasa que ahora y gracias a la funcionalidad de Mejora Continua podemos redirigir esos documentos a unacola(en realidad es una tabla deDataverse), para poder reentrenar el modelo en esos casos. ¿Cómo? Vamos a verlo.

En el flujo dePower Automatedonde se procesan los documentos recibidos, voy a añadir una nueva condición para evaluar el porcentaje de confianza. Si ese porcentaje es menor a 0.7 (70%), voy a utilizar la acción del conector deAI Buildercon nombre: "Save file to AI Builder feedback loop".

![](https://static.wixstatic.com/media/9456da_189ba380ca9941cb855209a4da0acf22~mv2.png/v1/fill/w_49,h_33,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_189ba380ca9941cb855209a4da0acf22~mv2.png)

Lo que hace esta acción es guardar en la tabla deDataversecon nombre: "AI Builder Feedback Loop" el nombre y contenido del fichero procesado, eloutputque ha generado el modelo deAI Buildery el propio modelo deAI Builder. De esta forma vamos a poder reentrenar el modelo con los documentos que no hayan superado ese umbral de confianza.

Cuando se ejecute el flujo dePower Automateque envía documentos para su revisión, dirígete a los modelos disponibles en tu entorno y observa que lo primero que aparece ahora es que el estado de nuestro modelo está en "Documents to review". Además, cuando entras al detalle del modelo también aparece una notificación que avisa que tenemos documentos para revisar y reentrenar el modelo.

![](https://static.wixstatic.com/media/9456da_79992653344e4f6caab83c4ec62fd848~mv2.png/v1/fill/w_49,h_17,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_79992653344e4f6caab83c4ec62fd848~mv2.png)

Edita el modelo y si no quieres añadir mas campos a extraer de los documentos, avanza hasta la etapa "Add collections of documents".

Si un determinado documento recibido no ha superado el porcentaje de confianza, lo mas probable es que dicho documento tenga un formato para el que no tenemos una colección de documentos. Crea una nueva colección y selecciona "Add Documents". Pero... ¡oops! ¿Aparece una opción que hasta ahora no había aparecido? ¡Correcto!. Selecciona la opción "Feedback loop" y... ¡voilá!

![](https://static.wixstatic.com/media/9456da_ad3d1066c05e4810bb46c749a841f4c4~mv2.png/v1/fill/w_49,h_19,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_ad3d1066c05e4810bb46c749a841f4c4~mv2.png)

Etiqueta los campos que va a extraerAI Builderen los nuevos documentos, guarda y reentrena el modelo...

![](https://static.wixstatic.com/media/9456da_ea8452a8a66b4b808a6be7b88ece206d~mv2.png/v1/fill/w_49,h_25,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_ea8452a8a66b4b808a6be7b88ece206d~mv2.png)

... y ¡listo! No puede ser mas fácil mejorar el modelo con los documentos que no han obtenido un mínimo de confianza e implementar así la mejora continua de nuestros modelos de procesamiento de formularios.

¡Espero haber resultado interesante!. ¡Gracias por haber leído hasta aquí! ¡Hasta la siguiente!

Etiquetas:

* Power Automate
* Dataverse
* AI Builder
* Dataverse
* AI Builder
* Power Automate
