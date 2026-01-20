# Debug de Custom API en Dataverse

![](https://static.wixstatic.com/media/9456da_847bcab30369479398de1e51a691623c~mv2.jpg/v1/fill/w_147,h_56,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_847bcab30369479398de1e51a691623c~mv2.jpg)

¡Vamos con un nuevo post, después de un breve parón por causas mayores!. Hace ya algunas semanas vimos qué era eso de lasCustom APIy en una segunda entrada vimos cómo crearrespuestas de Custom API customizadas. Hoy vamos a traer algo cortito relacionado con las Custom API pero no por ello menos importante. Vamos a ver cómo depurar el código de la API que hemos creado que siendo sinceros... ¿Quién es elguapo/aque escribe código que se ejecuta y funciona a la primera sin necesidad de depurarlo?

Vamos almeollo. Si ya has leído los dos post a los que hago referencia mas arriba, fenomenal. Si no, te recomiendo que los leas ahora ya que vamos a realizar pasos que seguíamos en estos post y que no vamos a repetir en este 😜.

Crea una nueva Custom API desde la solución en la que estés trabajando e introduce toda la información necesaria en cada uno de los campos que nos pidePower Platform. Pero... ¡Espera!

Fíjate en el campo con nombre:Allowed Custom Processing Step Type.Establece el valorSync and Asyncde este campo.

![](https://static.wixstatic.com/media/9456da_f0724d44900a49ffb1d1cbe11fed0287~mv2.png/v1/fill/w_110,h_144,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_f0724d44900a49ffb1d1cbe11fed0287~mv2.png)

Si recuerdas el ejemplo que seguíamos en los otros post donde consultábamos un registro de tipoEnvironmentdado un identificador de entorno en larequestde la llamada a la API, esta vez seguimos con el mismo ejemplo y lo único que cambia a la hora de crear la API customizada es el valor del campo que comento mas arriba.

Cuando termines de crear la API customizada, debe quedar algo parecido a lo que aparece en esta imagen.

Por último, cuando hayas guardado la API, crea unRequest Parametery unResponse Parameter, registra la libería de clases que se va a ejecutar cuando se invoque tu API desdePlugin Registration Tooly ya como paso final publica las personalizaciones de tu solución.

Fíjate que lo único nuevo que hemos hecho hasta ahora respecto a lo que contaba en las dos entradas de las Custom API es establecer el valor del campoIs FunctionaNo(ojo que esto conlleva que la API deba ser invocada vía POST)y el valorSync and Asyncen el campoAllowed Customo Processing Step Type. Pero como bien digo... hasta ahora.

![](https://static.wixstatic.com/media/9456da_7d32c7fc114445c8be80a7ac79401d1f~mv2.png/v1/fill/w_76,h_53,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_7d32c7fc114445c8be80a7ac79401d1f~mv2.png)

Vete de vuelta aPlugin Registration Tool, y registra un nuevoStepen elassemblyque has registrado antes.

En los detalles del nuevoStepen el campoMessageintroduce el nombre interno de la API que acabas de crear un poco mas arriba.

El paso que estás registrando, se ejecutará cuando llegue unarequestcuyoMessageNamesea idéntico al nombre interno de la Custom API. Configura también laetapaen la que se va a ejecutar este nuevo paso asi como elmodo de ejecución. Yo lo he configurado como puedes ver en la siguiente imagen:

![](https://static.wixstatic.com/media/9456da_89899f3aee6a439aba6bb201cb36d097~mv2.png/v1/fill/w_49,h_31,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_89899f3aee6a439aba6bb201cb36d097~mv2.png)

Como paso previo a la depuración asegúrate de que has instalado elPlugin Profiler. Esto lo puedes comprobar desdePlugin Registrarion Tool. Si no lo has instalado aún, en la barra de comandos aparecerá la opciónInstall Profiler. Puede tardar un ratito... Si ya lo has instalado, puedes omitir este paso y pasar al siguiente:

![](https://static.wixstatic.com/media/9456da_7c4b1c2c0c394fe199b3643090620c89~mv2.png/v1/fill/w_49,h_17,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_7c4b1c2c0c394fe199b3643090620c89~mv2.png)

Cuando haya terminado la instalación, dirigete alStepque has registrado un poco mas arriba, haz clic sobre el botón derecho del ratón y seleccionaStart Profiling.Deja la ventana emergente que aparece tal y como está y haz clic enOK.Si todo ha ido bien, se habrá añadido el sufijo"(Profiled)"al Step que has registrado.

Ya está todo listo. Ahora lo único que tenemos que hacer es ir aPostmane invocar nuestra API. Mientras tengamos elProfilingactivado, lo que está haciendoDataversepor debajo esguardar un registro por cadarequestque llega a nuestra API. De esta forma y utilizandoPlugin Registration Toolpodemos seleccionar unarequesten concreto y depurarla enVisual Studio. ¿Cómo?. Vamos a ello.

Primero de todo asegurate que la versión del código que vas a depurar y la versión de la librería de clases publicada enDataverseson las mismas. De lo contrario, no va a funcionar lo que vamos a hacer y necesitarás recompilar la librería de clases y actualizarla desdePlugin Registration Tool.

Selecciona elStepy haz clic en la opciónDebugde la barra de comandos. A continuación haz clic en el bóton que aparece a la derecha del campoProfileen la pestañaSetup. Si todo ha ido bien, debería mostrar una nueva ventana emergente donde veas todas las request que has hecho a tu API víaPostmany que elProfilerha ido registrando.

![](https://static.wixstatic.com/media/9456da_67f128f1de2241fba3e7fe1b1340a328~mv2.png/v1/fill/w_49,h_29,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_67f128f1de2241fba3e7fe1b1340a328~mv2.png)

Selecciona larequestque quieras depurar, y acto seguido debes indicar la ruta de la librería de clases compilada que se va a ejecutar simulando que entra larequestque has seleccionado.

![](https://static.wixstatic.com/media/9456da_a5825075aa0948bcbe490190bd11c88a~mv2.jpg/v1/fill/w_102,h_85,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_a5825075aa0948bcbe490190bd11c88a~mv2.jpg)

Antes de hacer clic en el botónStart Execution, debes asociar el depurador deVisual StudioaPlugin Registration Tool. Ve aVisual Studio, selecciona el menúDepurary a continuación la opciónAsociar al depurador...Ahí busca el proceso que te indica el propioPlugin Registration Tooly seleccionaAsociar. Si todo ha ido bien, cuando hagas clic en el botonStart ExecutiondePlugin Registration Tool, verás como se activa el punto de interrupción que has colocado en tu código y 💥voilá💥

![](https://static.wixstatic.com/media/9456da_167dcad61e724cd48a5ab49386cf5579~mv2.png/v1/fill/w_49,h_19,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_167dcad61e724cd48a5ab49386cf5579~mv2.png)

Obtén el objetocontextdelService Providery fíjate que toda la información relacionada con larequestviene en este objeto.

Espero que este post haya sido de tu interés. ¡¡Hasta la siguiente!!

Etiquetas:

* Power Apps
* Dataverse
* API
* Dataverse
* Power Apps
* Power Automate
