# Llamar desde una Canvas App a través de Microsoft Teams

![](https://static.wixstatic.com/media/9456da_28f59eb7c2ea4713b223ba28d8422dd5~mv2.png/v1/fill/w_53,h_35,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_28f59eb7c2ea4713b223ba28d8422dd5~mv2.png)

Siempre se habla de la gran ventaja de poder embeber aplicaciones canvas o model-driven directamente enMicrosoft Teams, pero no se habla tanto de cómo poder hacer las integraciones a la inversa.

No podría ser de otra forma.Power Platformnos lo pone muy muy fácil. Tan fácil que diría que este puede ser el post mas corto de la historia del blog 😅.

En esta entrada vamos a ver cómo podemos lanzar una llamada desde una aplicación canvas. Para esta prueba de concepto, lo voy a simplificar al máximo y vamos a trabajar sobre una galería que muestra los usuarios disponibles en eltenant.

Lo interesante de esto, sería poder incorporarlo a una aplicación real donde por ejemplo un solicitante puediera llamar al aprobador de su solicitud, desde el propio detalle de la petición. No estoy seguro que al destinatario de las llamadas, le hiciera mucha gracia está funcionalidad, pero nuestra labor es explorar los límites de la tecnología 😎.

Desde la aplicación canvas sobre la que estes trabajando, y sobre el control desde el que quieras lanzar la llamada incluye lo siguiente en la opciónOnSelect.

```powerapps
Launch(
        "msteams://teams.microsoft.com/l/call/0/0?users="&BrowseGallery1.Selected.'Primary Email',
        {},
        LaunchTarget.New
    )
```

Como puedes observar lo único que realmente necesitamos es el mail del usuario al que vamos a llamar. Lógicamente tienes que adaptar la sentencia anterior para que haga referencia a los controles con los que tú estas trabajando.

En mi caso, he añadido un icono al lado de cada usuario para poder lanzar la llamada con un sólo clic y sin tener que cambiar a la aplicación móvil deMicrosoft Teams, buscar al usuario, acceder a la conversación y pulsar sobre el icono de llamada.

![](https://static.wixstatic.com/media/9456da_784dd3c236f5410aa4564535f99b2e14~mv2.png/v1/fill/w_49,h_22,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_784dd3c236f5410aa4564535f99b2e14~mv2.png)

Funciona como un tiro y no tiene mucha complicación... ¿verdad?

¡Gracias por tu tiempo! ¡Nos vemos en la siguiente!