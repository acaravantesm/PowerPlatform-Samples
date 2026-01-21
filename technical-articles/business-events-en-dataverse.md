# Business Events en Dataverse

![](./assets/bde/9456da_33ac3abb88674e738af0491dff323078~mv2.avif)

Hace unos dias desdePower CAT Live(que si no estás suscrito, te lo recomiendo encarecidamente), subían unvideomuy interesante donde hablaban de los eventos empresariales oBusiness EventsenDataverse.

Como ya sabrásDataverseofrece un marco de trabajo basado en eventos:cuando ocurre una cosa, hago otra. Por ejemplo:cuando se crea/comparte/asigna/actualiza/elimina un contacto, hago una serie de acciones. Nada nuevo.

Pero no podía faltar una parte muy importante. La de podercrearnuestros propioseventos customizados. Y más importante aún, en un escenario donde los eventos customizados se multipliquen por momentos,organizarestos eventos. Es aquí donde aparecen los conceptos:CatalogyCatalogAssignment.

Pero no nos adelantemos. ¡Espera!.

Si no te has dado una vuelta por lospostdonde hablabamos deCustom API,echa un vistazo por que precisamente para crear eventos customizados nos basamos en eso: en lasCustom API.

Como ya hablamos en estas entradas cuando creamos una nuevaCustom API, automáticamente enDataversese crea unmensajeo evento con el mismo nombre. Y es justo con estemensajecon el que vamos a trabajar. Unos cuantos pasos muy sencillos.

Vamos allá.

Crea una nueva solución y da de alta una nuevaCustom API. En mi caso lo que he hecho ha sido crear una a la que he llamadoApproveContacty que como habrás podido deducir es una API a la que vamos a llamar cuando se apruebe unContacto. La configuración es muy sencilla como ves en la siguiente imagen.

![](./assets/bde/9456da_31fe43acbdb548289c8dc1f2ecca6167~mv2.avif)

![](./assets/bde/9456da_df5501c985bf40e297dd960b61f62c34~mv2.avif)

Los parámetros de entrada son muy fáciles de configurar como ya habíamos visto. En mi caso he creado dos parámetros: uno que recibe el nombre del contacto en formatostringy un identificador único de cadarequestpara poder tener cierta trazabilidad.

Aquí es donde entran dos conceptos importantes para tener un catálogo sostenible y escalable de eventos que poder poner a disposición de cualquier sistema que necesite integrarse con nosotros. Estos conceptos sonCatalogyCatalogAssignment.Aquíte dejo el link a la documentación oficial deMicrosoft, aunque resumiendo es un modelo de datos capaz de organizar nuestro catalogo de eventos.

![](./assets/bde/9456da_c1241894ae11428ba84d8ce00483e1b5~mv2.avif)

Como ves hay una tabla principal llamadaCatalogque almacena y organiza catálogos de eventos que pueden depender unos de otros. Para relacionar los catálogos de eventoshijoscon los propios eventos, aparece la tablaCatalogAssignment.

Diríjete a tu solución y añade un nuevo catálogo desdeNew > More > Other > Catalog, que hará de catálogopadree indica el nombre interno, el nombre y el display name. Repite la operación creando un catálogohijodel que acabas de crear en el paso anterior. En mi caso, el catálogo hijo almacenará eventos customizados por lo que le dado un nombre descriptivo:

![](./assets/bde/9456da_bf54fb1bedb545d88a88261874984bda~mv2.avif)

¡Listo!, no hay nada mas que hacer. Fácil, ¿verdad? Vamos a probar lo que hemos hecho. Crea un nuevo flujo dePower Automatepara desencadenarel evento y observa que cuando indicas el evento, te pide los parámetros de laCustom APIque hemos indicado:

![](./assets/bde/9456da_c192adcaa7804bf7a157752fcd32851b~mv2.avif)

Crea otro flujo dePower Automatey comotriggerde este nuevo flujo selecciona el conector deDataversey la acción con nombre: "Cuando se produce una acción". Fíjate que en todos los desplegables disponibles, van apareciendo los catálogos que hemos ido creando. ¿Está organizada la cosa o no? 😉 En mi caso la configuración es la siguiente:

![](./assets/bde/9456da_473676b05e3048dea030aacde5029bd8~mv2.avif)

Ahora solo falta ejecutar nuestro primer flujo para lanzar nuestro evento customizado y comprobar que el segundo se ejecuta, que ya te digo que si se va a ejecutar sin problemas 😊. Observa elbodyde la request donde tenemos todos los parametros y toda la información necesaria para procesar este evento como sea requerido:

![](./assets/bde/9456da_1fbec243af794467a8834165ea2edb67~mv2.avif)

A partir de aquí las posibilidades son múltiples: capturar estos eventos conPower Automate, notificar eventos a unWebHookdando de alta elstepdesdePluginRegistrantionTool, etc.

Como puedes comprobar, prácticamente no hay requisito o necesidad funcional que no podamos cubrir con el potencial que nos ofrecePower PlatformyDataverse.

¡Gracias por tu tiempo! ¡Nos vemos en la siguiente!