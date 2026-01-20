# Ejecución de Plugins con dependencias de otras librerías

![](https://static.wixstatic.com/media/9456da_55b283b912654b5685aac73c319996a7~mv2.png/v1/fill/w_71,h_34,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_55b283b912654b5685aac73c319996a7~mv2.png)

Y cuando pensabamos que en lo relativo a los plugins de Microsoft Dataversepoco margen de novedad quedaba... ¡ZAS!. Llega el equipo deMicrosoft Power Platformy se saca unas de la manga.

Si has trabajado conpluginsen proyectos dePower Platformo en proyectos deDynamics, sabrás que hasta ahora era un poco complejo el uso de dependencias externas dentro de los propiosplugins. Algo que se podía conseguir haciendo virguerías utilizandoILMergeyque por resumir mucho lo que hacía era combinar la librería delplugincon las librerías dependientes en una sola librería de clases que era la que realmente registrabamos enPlugin Registration Tool.

Bueno pues eso está a punto de pasar a mejor vida. GraciasILMergepor tu ayuda, pero como se suele decir... que pase el siguiente. Las novedades en el mundoPower Platform, ¡no paran!

La funcionalidad que vamos a ver todavía esta enpreviewpero mucho me temo que nos va a facilitar la vida enormemente, al permitirnos utilizar librerías externas para utilizarlas en el propiopluginy publicar el paquete resultante (plugin+ librerías externas) conPlugin Registration Toolcomo si de unplugin "normal" se tratase.

Para la prueba de concepto de hoy, que ya te adelanto que va a ser muy sencilla, vamos a trabajar con una librería de clases que simula unwrapperque encapsula todos los servicios web de una compañía. El servicio web que voy a utilizar en este post es un servicio que va a consultar si un contacto que se está dando de alta, forma parte de una lista de morosos. Laresponsede ese servicio web, que me será devuelta desde la liberíawrapper, lo vamos a almacenar en la información del propio contacto.

A alto nivel, vamos a construir lo siguiente:

![](https://static.wixstatic.com/media/9456da_aa042efb66864ec98713212f32d57130~mv2.png/v1/fill/w_49,h_13,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_aa042efb66864ec98713212f32d57130~mv2.png)

Lo primero que necesitas es trabajar con Visual Studio 2019 e instalar la extensiónPower Platform Tools. Cuidado que no vas a poder instalar esta extensión en Visual Studio 2022 hasta como mínimo Septiembre de 2022 😉.

Necesitarás también la última versión dePlugin Registration Tool.

Abre Visual Studio y dirígete aHerramientas>Opcionesy seleccionaPower Platform Tools. Bajo el submenúGeneral, activa la opción que ves en la siguiente imagen.

![](https://static.wixstatic.com/media/9456da_52f962d5d2174b66a259c9f60f256ce8~mv2.png/v1/fill/w_75,h_46,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_52f962d5d2174b66a259c9f60f256ce8~mv2.png)

Ahora, crea un nuevo proyecto de tipoPower Platform Plug-in Library, y añade la referenciaMicrosoft.CrmSdk.CoreAssemblies. Añade también la referencia a la librería de clases que vayas a utilizar como dependencia adicional.

Escribe el código necesario para ejecutar elplugin. En mi caso, lo que voy a hacer es actualizar el contacto que se está creando con parte de la response del servicio web. No me voy a detener en el código delplugin.

![](https://static.wixstatic.com/media/9456da_69d031a5ab10450da909c2ceb1aae9da~mv2.jpg/v1/fill/w_84,h_102,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_69d031a5ab10450da909c2ceb1aae9da~mv2.jpg)

Cuando tengas el código listo para compilarse, compila la solución sobre la que estés trabajando y observa que en el directorio/bin, se ha creado un nuevo directorio que se llamaoutputPackages.Fíjate que se ha creado un archivo con extensiónnupkg. Te invito a que lo descomprimas y mires que hay dentro.

Abre ahoraPlugin Registration Tooly conéctate al entorno sobre el que vayas a trabajar. Una vez conectado, haz clic enRegister>Register New Package.

![](https://static.wixstatic.com/media/9456da_f1556da9a67e48bab9321a590ae80a42~mv2.png/v1/fill/w_49,h_24,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_f1556da9a67e48bab9321a590ae80a42~mv2.png)

Lo único que necesitamos es indicar el paquete a registrar y la solución donde se va a incluir este paquete.

![](https://static.wixstatic.com/media/9456da_26a676e28d194a9aac01b0e7c3830e6a~mv2.png/v1/fill/w_46,h_12,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_26a676e28d194a9aac01b0e7c3830e6a~mv2.png)

Para visualizar los paquetes registrados, necesitaras seleccionarView>Display by Package.

![](https://static.wixstatic.com/media/9456da_62937a206fde465c9fe1ddebea225f28~mv2.png/v1/fill/w_65,h_29,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_62937a206fde465c9fe1ddebea225f28~mv2.png)

A partir de aquí, se trata de continuar como si estuvieramos trabajando como con cualquier otroplugin: registrar steps e imagenes si es necesario. En mi caso la configuración queda de la siguiente forma:

![](https://static.wixstatic.com/media/9456da_eb0a80fbc0a24c44a8e129069d532ebf~mv2.png/v1/fill/w_82,h_22,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_eb0a80fbc0a24c44a8e129069d532ebf~mv2.png)

![](https://static.wixstatic.com/media/9456da_22411361c9214e8e9e66dfc502d1c53e~mv2.png/v1/fill/w_56,h_47,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_22411361c9214e8e9e66dfc502d1c53e~mv2.png)

Si ahora intento dar de alta un nuevo contacto, elpluginque acabo de registrar consultará el servicio web de morosos y actualizará la información del contacto que acabo de crear.

Como puedes ver... ¡no hay mucho misterio!, y esto nos abre aun más el abanico de posibles funcionalidades a implementar utilizandoplugins. ¡Siempre sin perder de vista las limitaciones de la plataforma!

¡Gracias por haber llegado hasta aquí! ¡Nos vemos en el próximo post!