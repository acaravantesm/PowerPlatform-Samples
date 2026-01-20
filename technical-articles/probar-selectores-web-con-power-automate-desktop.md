# Probar selectores web con Power Automate Desktop

![](https://static.wixstatic.com/media/9456da_3a83229001d049148ec4b46d1f0f47da~mv2.jpg/v1/fill/w_153,h_102,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_3a83229001d049148ec4b46d1f0f47da~mv2.jpg)

Hace ya mas de un año (parece mentira cómo pasa el tiempo...) escribí un post sobre como cargar datos a una aplicación web desdePower Automate Desktop. El contenido del post lo puedes ver eneste enlace.

Si lo recuerdas, en aquelposthablábamos sobre comoPower Automate Desktophacía uso de selectoresjQuerypara encontrar los elementos web con los que interactuar. Comentamos también que a no ser que el identificador de un elemento fuera claramente estático, lo mejor era utilizar las clases de cada elemento y alguna propiedad adicional para afinar la búsqueda de estos elementos.

![](https://static.wixstatic.com/media/9456da_ef0cbd75b3a24675a9293110331857ac~mv2.gif/v1/fill/w_147,h_59,al_c,usm_0.66_1.00_0.01,blur_2,pstr/9456da_ef0cbd75b3a24675a9293110331857ac~mv2.gif)

Enaquella entrada,también hablábamos que era muy probable que nos tocara ejecutar varias veces el flujo hasta que diéramos con la sentenciajQueryque era capaz de encontrar el elemento web. Además para probar si el elemento se capturaba bien, había que ejecutar el propio flujo dePower Automate Desktop.

Pues bien, con la última versión dePower Automate Desktoppodemos...

...de una forma mucho mas sencilla!

Descarga la última versión dePower Automate Desktop, y comprueba que tienes eladdonnecesario paraPADsegún el navegador que estás utilizando.

AbrePower Automate Desktopy selecciona el flujo con el que estés trabajando. En mi caso voy a trabajar con el mismo flujo de ejemplo que construí meses atrás. Así también veré si fui capaz de montar unos selectoresjQueryque resistan al paso del tiempo y a la actualización de versiones de la aplicación web.

![](https://static.wixstatic.com/media/9456da_2644de1f28c64378a7ac98ed7bfa7002~mv2.png/v1/fill/w_108,h_132,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_2644de1f28c64378a7ac98ed7bfa7002~mv2.png)

En la sección deElementos de Interfaz de Usuarioselecciona el control sobre el que vayas a trabajar o captura un nuevo control.

En mi caso voy atesteareltextboxdonde se indica el nombre del contacto que vamos a crear en la aplicación web con la que trabajé en el anteriorpost.

Fíjate que cuando añades o editas un elemento de UI, el cuadro de diálogo ha cambiado y ahora puedes añadir varios selectores al mismo elemento de interfaz de usuario. Si un selector falla,Power Automate Desktoppasa a evaluar el siguiente selector y así sucesivamente.

Observa también que aparece una nueva opción con nombreSelector de prueba. Haz clic en esta opción y fíjate quePower Automate Desktopte pide que indiques en qué pestaña del navegador quieres probar ese selector. Asegúrate de tener la aplicación web con la que estas interactuando abierta y mostrándose en pantalla. Selecciona la pestaña en cuestión y verás comoPADinicia la prueba del selector en cuestión, sin necesidad de ejecutar el flujo como teníamos que hacer antaño.

![](https://static.wixstatic.com/media/9456da_8d83edb58b364b0592c2766592e7a685~mv2.gif/v1/fill/w_147,h_77,al_c,usm_0.66_1.00_0.01,blur_2,pstr/9456da_8d83edb58b364b0592c2766592e7a685~mv2.gif)

Fíjate que cuando editas otro selector que ha cambiado en la aplicación web con la que estamos trabajando y ademas intentamostestearese selector,Power Automate Desktopdevuelve un error si no encuentra el elemento de la interfaz de usuario.

![](https://static.wixstatic.com/media/9456da_4620eba844a440069234af67a5a15e1b~mv2.gif/v1/fill/w_147,h_76,al_c,usm_0.66_1.00_0.01,blur_2,pstr/9456da_4620eba844a440069234af67a5a15e1b~mv2.gif)

¡Espero que esta lectura haya sido de ayuda! ¡¡Nos vemos en la siguiente!!

Etiquetas:

* Power Automate
* Power Automate Desktop
* Power Automate
* Power Automate Desktop
