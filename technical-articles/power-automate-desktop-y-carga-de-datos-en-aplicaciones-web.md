# Power Automate Desktop y carga de datos en aplicaciones web

![](https://static.wixstatic.com/media/9456da_d507b76958d24911ac9bdc4f4eebfd6c~mv2.png/v1/fill/w_81,h_32,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_d507b76958d24911ac9bdc4f4eebfd6c~mv2.png)

Este post, va dedicado en exclusiva a Power Automate. Supongo que si has llegado hasta aquí, sabes quePower Automate Desktopes lapatitadePower Automateque nos permite automatizar procesos simulando las acciones que todos los usuarios podemos hacer desde el escritorio de nuestro ordenador. Te invito a que le des un vistazo a ladocumentación oficial.

Dentro de todas las posibilidades que nos ofrecePower Automatepara automatizar acciones y procesos de escritorio, hoy en concreto vamos a poner el foco en cómo introducir automáticamente datos extraídos de un ficheroCSVa una aplicación web. En este post voy a intentar mostrar cómo podemos automatizar la interacción con una aplicación web en la que vamos a cargarContactos, y que nos va a servir para la carga de datos en campos sencillos como puede ser elnombre, losapellidos, y elteléfonode un contacto; pero también vamos a trabajar con información algo mas compleja por decirlo de alguna forma, como puede ser seleccionar elsexodel contacto de una lista o incluso subir una imagen para asociarla a dicho contacto.

Si no has descargado aúnPower Automate Desktoplo puedes hacer desde estelinkdonde además nos cuentan los pasos a seguir. Lo vamos a necesitar para trabajar en este post.

Para empezar a trabajar, partimos de un fichero CSV que contieneContactos. Yo he utilizadoMockaroopara crear un fichero que contiene una lista de contactos con el siguiente aspecto:

![](https://static.wixstatic.com/media/9456da_e0f17328a709451ea5d7c4da4086ad69~mv2.png/v1/fill/w_49,h_25,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_e0f17328a709451ea5d7c4da4086ad69~mv2.png)

Como ves tengo una lista de 10 Contactos que vamos a cargar en una aplicación web. El último campo ademas es la ruta de la foto de cada uno de los contactos que también vamos a subir a la aplicación web. Probablemente estarás pensando que vaya tontería y efectivamente este ejemplo es algo que en un escenario real puede no darse con frecuencia, pero el objetivo de este post es ver el potencial de la tecnología y sobre todo ver como podemos automatizar la carga de datos en aplicaciones web modernas que cargan un montón de componentes de forma dinámica.

![](https://static.wixstatic.com/media/9456da_4f4c2cb2882b49c39a9d7b8313b59359~mv2.gif/v1/fill/w_113,h_78,al_c,usm_0.66_1.00_0.01,blur_2,pstr/9456da_4f4c2cb2882b49c39a9d7b8313b59359~mv2.gif)

Manos a la obra. AbrePower Automate Desktopy en nuevo flujo incorpora la acciónLeer de archivo Csv.Indica el path del fichero con el que vamos a trabajar aunque recuerda que este path podría venir dado en un parámetro de entrada. Ajusta la codificación del fichero y establece el separador de los campos del ficheroCSV. Aprovecha para incorporar buenas prácticas en los desarrollos y cambia el nombre de la variable generada a algo descriptivo 😉.

Ahora que tenemos los contactos cargados en una variable, vamos con la miga. Aunque en algunas ocasiones es muy útil el grabador web o la grabadora de escritorio que van registrando los inputs y eventos tanto de teclado como de ratón, hoy vamos a añadir los elementos de la aplicación web de forma manual haciendo uso de la opciónAgregar elemento de interfaz de usuario, como puedes ver en esta animación. Fíjate que según vamos posicionando el raton por encima de cualquier elemento webPower Automate Desktopva detectando el tipo de elemento y basta con hagamos clic sobre el elemento que queremos crear al mismo tiempo que pulsamos la teclaCrtldel teclado.

![](https://static.wixstatic.com/media/9456da_16d5c2f06991437aae85c4e2a1890bb7~mv2.gif/v1/fill/w_147,h_74,al_c,usm_0.66_1.00_0.01,blur_2,pstr/9456da_16d5c2f06991437aae85c4e2a1890bb7~mv2.gif)

Verás que todos los elementos que hemos ido capturando aparecerán en el árbol de elementos enPower Automate Desktop. Haciendo doble clic sobre cualquiera de los elementos se pueden editar y de hecho tenemos que hacerlo por que como comentaba antes las páginas de hoy en día cargan todos los elementos de forma dinámica generando tambien de forma dinámica los identificadores de cada elemento.

A no ser que el identificador de un elemento sea claramente estático, te recomiendo que utilices las clases de cada elemento y alguna propiedad adicional para afinar la búsqueda de estos elementos.

![](https://static.wixstatic.com/media/9456da_ef0cbd75b3a24675a9293110331857ac~mv2.gif/v1/fill/w_147,h_59,al_c,usm_0.66_1.00_0.01,blur_2,pstr/9456da_ef0cbd75b3a24675a9293110331857ac~mv2.gif)

Lo mas probable es que te toque ejecutar varias veces el flujo hasta que des con la sentenciajQueryque sea capaz de encontrar el elemento web. Una vez tengas estos elementos correctamente creados, el resto es casi coser y cantar. Lo único que tenemos que montar es un blucle que vaya recorriendo todos losContactos, que haga clic en los botones necesarios para crear un nuevo contacto y vaya rellenando cada campo con su valor pertinente. Utiliza las acciones "Hacer clic en un vínculo en una página web" para enviar clics a los botones de la aplicación web y las acciones "Rellenar campo de texto en la página web" para rellenar cada campo con su valor correspondiente. Al final debe quedar algo parecido a esto:

![](https://static.wixstatic.com/media/9456da_614d781ac7f442b1a80651b45efe8039~mv2.png/v1/fill/w_49,h_31,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_614d781ac7f442b1a80651b45efe8039~mv2.png)

Vamos con la parte algo mas complicada. Para añadir una foto, si te has fijado en las animaciones superiores, hay que hacer clic en un botón, cambiar de pestaña en el nuevoiframeque aparece, y hacer clic en una etiqueta que abre una ventana de diálogo donde podemos indicar la imagen que queremos asociar a nuestro contacto.

He de confesar que he estado un ratito intentando que funcionara hasta que he descubierto que con aquellas web que utilizan la funciónOpenpara abrir ventanas de diálogo...¡es necesario utilizar las funciones dePower Automateque hacen referencia a la automatización de UI en lugar de la automatización web!

![](https://static.wixstatic.com/media/9456da_a94d09396ed848e3b12956df3114cf0a~mv2.png/v1/fill/w_49,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_a94d09396ed848e3b12956df3114cf0a~mv2.png)

Simula que vas a subir una foto a un contacto desde la propia web y cuando se abra la ventana de diálogo, captura los elementos de la interfaz como son el campoNombredonde indicaremos la ruta de la foto de cada contacto y el botonAbrirde la misma forma que lo hemos hecho mas arriba.

Cuando los tengas capturados enPower Automate Desktopya podremos continuar con nuestro flujo que debería tener un aspecto parecido al siguiente. Fíjate en dos cosas importantes: la primera es que para abrir la ventana de diálogo no estoy utilizando una accion "Hacer clic en un vínculo en una página web", si no que estoy utilizando "Clic en el elemento de interfaz de usuario de la ventana". Y la segunda, que despues dehacer clicen el botónAbrir, espero 2 segundos para asegurarme que la imagen se sube correctamente.

![](https://static.wixstatic.com/media/9456da_c5b01a5298bd4c07b56b1f33309cc1f5~mv2.png/v1/fill/w_49,h_15,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_c5b01a5298bd4c07b56b1f33309cc1f5~mv2.png)

Una vez hecho esto lo único que nos falta es guardar el contacto, cerrar la ventana emergente y volver a hacer lo mismo con el siguiente contacto. Si todo a ido bien, el resultado debe parecerse a esto:

![](https://static.wixstatic.com/media/9456da_82a394021c6a4f42b660397c3a0cd882~mv2.gif/v1/fill/w_147,h_78,al_c,usm_0.66_1.00_0.01,blur_2,pstr/9456da_82a394021c6a4f42b660397c3a0cd882~mv2.gif)

A partir de aquihay mucho camino que recorrer. Se puede explorar la automatización del rellenado de campos mas complejos, control de errores y excepciones, aumento del rendimiento del flujo para que se ejecute mas rápido... Todos estos puntos que comento tienen un gran margen de mejora, que veremos en próximos post!!

¡Espero que esta lectura haya sido de ayuda! ¡¡Nos vemos en la siguiente!!