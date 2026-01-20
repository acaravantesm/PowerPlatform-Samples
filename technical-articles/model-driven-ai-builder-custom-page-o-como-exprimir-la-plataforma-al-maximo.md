# Model Driven, Ai Builder & Custom Page o cómo exprimir la plataforma al máximo

![](https://static.wixstatic.com/media/9456da_4858a92c360446fcaf07c6d05948f8e9~mv2.png/v1/fill/w_49,h_25,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_4858a92c360446fcaf07c6d05948f8e9~mv2.png)

A estas alturas, no descubrimos nada nuevo si decimos que enPower Platform, una funcionalidad en concreto puede ser implementada de múltiples formas. En este caso ¿cómo podríamos ejecutar un modelo deAI Builderdesde una aplicación basada en modelos? Está claro que podríamos hacerlo de muchísimas formas:Power Automatecon un desencadenador "cuando se crea/actualiza un registro", un comando conPower Fx, e incluso para los masoldiesimplementar un plugin que invoque al modelo vía API. Por que por si no lo sabías, si. Los modelos deAI Builderpueden ser invocados a través de API REST como puedes veraquí.

Imagina que una organización dispone de diversos modelos de inteligencia artificial para extraer información de formularios o facturas. Imagina que esta organización quiere que los usuarios de una aplicación de gestión de facturación puedan seleccionar y lanzar bajo demanda los modelos de inteligencia artifical disponibles desde la propia aplicación. En este post vamos a ver cómo gracias al potencial de lasCustom Pages, podríamos implementar este requisito.

Vamos a empezar por entrenar un modelo de inteligencia artifical para extraer campos específicos de una factura. Para esta prueba de concepto utilizarélos juegos de datos de ejemploque Microsoft pone a nuestra disposición para jugar con la plataforma. En este post voy a utilizar elReconocimiento de Formularios, y si aún no te haspegadocon el, te aconsejo que le des una vuelta a ladocumentación oficial.😉

He creado un modelo que se llamaProcesamiento de Facturascon un par de colecciones de documentos y los campos mas comunes:número de factura, fecha de factura, cliente, subtotal, impuestos, totaly una tabla con el detalle de laslíneas de la factura. Ni nada nuevo, ni nada complejo.

![](https://static.wixstatic.com/media/9456da_c2f13ca5a311416e8ac29397a2ad1f98~mv2.png/v1/fill/w_49,h_23,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_c2f13ca5a311416e8ac29397a2ad1f98~mv2.png)

Por si no lo sabías, todos los modelos, colecciones de documentos, datos a extraer, etc., son almacenados en tablas deDataverse. Y esto significa que podemos explotar esta información para lo que necesitemos.

Como segundo paso voy a crear una nuevaCustom Pageque desde la aplicación basada en modelos de gestión de facturas, permita al usuario seleccionar los modelos de inteligencia artifical disponibles y procesar una determinada factura con el modelo seleccionado. Para ello, desde la solución en la que estés trabajando seleccionaNuevo,Aplicación,Página. Esto abrirá el editor de aplicaciones de lienzo sobre donde vamos a dar forma a nuestraCustom Page.

Para esta prueba de concepto algo muy sencillo: un selector de los modelos de inteligencia artificial disponibles, un bóton que permita ejecutar el modelo seleccionado y una etiqueta de texto donde se va a mostrar elJSONde salida con los datos de la factura extridos por el modelo.

![](https://static.wixstatic.com/media/9456da_309fee1d5a5544faa2b917d0e836b7b8~mv2.png/v1/fill/w_49,h_22,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_309fee1d5a5544faa2b917d0e836b7b8~mv2.png)

![](https://static.wixstatic.com/media/9456da_12bf094fddf14418be368495cc5eea7d~mv2.png/v1/fill/w_56,h_71,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_12bf094fddf14418be368495cc5eea7d~mv2.png)

La tabla donde se almacenan los modelos deAI Builderdisponibles se llamaAI Builder Models.Podríamos incluirla como origen de datos delDropdownpero cómo no aparece disponible lo que he hecho ha sido crear un flujoPower Automateque con un simpleFetchXMLfiltra los modelos de inteligencia articial y los devuelve a laCustom Page. Antes de devolver la respuesta a laCustom Page, hago un tratamiento de los datos para simplificar la cantidad de información que se devuelve a la"canvas app". Algo parecido a lo que se puede ver a continuación.

```powerapps
[
  {
    "customAiModelName": "Procesamiento de Facturas",
    "customAiModelId": "15a566b1-0c54-4f06-9bc0-123456ff25d9"
  }
]
```

Al final, lo que queda en la propiedadOnStartde la Custom Page no es mas que unCollectde esta respuesta a una variable, que luego es utilizada en la propiedadItemsdelDropdown:

```powerapps
ClearCollect(
        CustomAIModels;
        GetCustomAIModels.Run()
    );
```

Una vez somos capaces de mostrar los modelos disponibles para ser ejecutados, utilizo otro flujo dePower Automatepara lanzar el modelo seleccionado.Vamos a dejar para mas adelante el cómo pasamos la factura a procesar al modelo seleccionado.

Como puedes ver en la siguiente imagen, el flujo que ejecutará el modelo seleccionado, recibe dos parámetros: el identificador del modelo a ejecutar, y el identificador de la factura que vamos a procesar. Lo importante de este flujo es larequestque hay que construir para invocar al modelo:

![](https://static.wixstatic.com/media/9456da_3ffa5bb5babc4077a7299f75616da5cc~mv2.png/v1/fill/w_55,h_77,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_3ffa5bb5babc4077a7299f75616da5cc~mv2.png)

Al final hago un breve tratamiento de la respuesta para no complicar demasiado la prueba de concepto, pero lo suyo sería devolver todo elresponsedel modelo ejecutado a laCustom Pagey si eres unProde lasCanvasseguro que en un visorPdf, puedes pintar rectángulos dinámicos utilizando galerías y las propiedadesXeYqueAI Builderdevuelve con las coordenadas de cada campo extraído.

Una vez el flujo dePower Automateque ejecuta el modelo seleccionado, está implementado y funcionando, lo único que queda es utilizar la propiedadOnSelectdel botón con algo parecido a esto:

```powerapps
Set(
    modelResponse;
    JSON(
        ExecuteAIModel.Run(
            Dropdown1.Selected.customAiModelId;
            InvoiceId
        );
        JSONFormat.IndentFour
    )
)
```

Finalmente la variablemodelResponsela utilizo en la propiedadTextde laLabelque muestra la respuesta por pantalla.

Pero si te has fijado bien, ¿qué esInvoiceId?. Ni mas ni menos que el identificador de la factura que vamos a procesar. Identificador que vamos a pasar desde la aplicación basada en modelos, hasta nuestraCustom Page. ¿Cómo? Manos a la obra.

Desde la solución en la que estas trabajando, seleccionaNuevo,Más,Recurso Web. Sube un fichero que tenga el siguiente aspecto (no olvides actualizar los valores denameyentityName) y observa que el único parámetro de entrada a la funciónopenCustomPaneserá el identificador de la factura que vamos a procesar.

Ahora crea, si no tienes creada aún una aplicación basada en modelos. Si ya dispones de una, puedes añadir esta aplicación a tu solución y trabajar con esa aplicación. Edita la aplicación con laedición en vista previay añade la tabla con la que estes trabajando a la aplicación. En mi caso, la tablaFacturas. Una vez esté añadida, selecciona los tres puntos a la derecha y haz clic en la opciónEditar barra de comandos.Yo he seleccionadoFormulario Principalya que este comando va a ser ejecutado desde el formulario de detalle de un registro de la tablaFacturas.

![](https://static.wixstatic.com/media/9456da_aa0f618b32464e09b019c5f18c63a1e8~mv2.png/v1/fill/w_49,h_23,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_aa0f618b32464e09b019c5f18c63a1e8~mv2.png)

SeleccionaNuevo comando, indica un texto y un icono descriptivo, y en el desplegableAcción, seleccionaEjecutar Javascript. En el campo Biblioteca, selecciona elWeb Resourceque has subido en el paso anterior, en el campoNombre de FunciónintroduceopenCustomPaney añade un parámetro nuevo que deberá estar establecido enFirstPrimaryItemId.

Pero.... ¿no has echado en falta algo? NuestraCustom Pagedebe recibir el contexto desde la aplicación basada en modelos para saber queFacturadebe procesar con el modelo de inteligencia artificial a ejecutar. Hasta ahora hemos creado unComandoque invoca a unRecurso Weby le pasa como parámetro el identificador del registro que estamos viendo desde el formulario de detalle. ¿Y laCustom Pagecómo recibe ese contexto? ¡¡Este es justo el último paso que nos falta!!

Vuelve a editar la página custom y en la propiedadOnStartde laApp, actualiza la fórmula que habíamos introducido para dejarla con el siguiente aspecto:

```powerapps
Concurrent(
    ClearCollect(
        CustomAIModels;
        GetCustomAIModels.Run()
    );
    Set(
        InvoiceId;
        If(
            IsBlank(Param("recordId"));
            Blank();
            GUID(
                Substitute(
                    Substitute(
                        Param("recordId");
                        "{";
                        ""
                    );
                    "}";
                    ""
                )
            )
        )
    )
)
```

Si todo ha ido bien, cuando accedas a un registro (en mi caso) del tipoFactura, haciendo clic en el nuevo comando aparecerá un panel lateral con una "Canvas App" embebida, que habrá recibido el contexto del registro con el que estamos trabajando. Al seleccionar el modelo y presionar el botón, tendremos eloutputdel modelo de inteligencia artificial ejecutado!!

![](https://static.wixstatic.com/media/9456da_61461fc1a1414665b37efd7b0a493299~mv2.gif/v1/fill/w_147,h_82,al_c,usm_0.66_1.00_0.01,blur_2,pstr/9456da_61461fc1a1414665b37efd7b0a493299~mv2.gif)

Como siempre digo, esto es sólo el principio y a partir de aqui las posibilidades que aparecen son casi infinitas! Espero haber sido de ayuda o al menos haber contado algo interesante. Nos vemos en la siguiente!!