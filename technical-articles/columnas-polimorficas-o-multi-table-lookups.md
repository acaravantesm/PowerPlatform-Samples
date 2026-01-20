# Columnas polimórficas o multi-table lookups

**Fecha:** Fecha desconocida
**URL Original:** https://acaravantes.wixsite.com/misitio/post/columnas-polim%C3%B3rficas-o-multi-table-lookups

---

![](https://static.wixstatic.com/media/9456da_b2dd0172c4264cabbb5525db4813b387~mv2.jpg/v1/fill/w_158,h_89,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_b2dd0172c4264cabbb5525db4813b387~mv2.jpg)

¡Lo primero y mas importante! ¡¡Feliz Año 2023!! Espero que tu inicio de este año esté a la altura de las espectativas.

Seguro que este 2023 nos trae muchísimas novedades que trataré de ir reflejando en el blog.  Vamos con la primera entrada del año 👏👏.

Cuando has estado cierto tiempo trabajando conDynamics 365, probablemente ya sepas de lo que voy a hablar en esta entrada. Seguramente te suena ellookupde tipoCustomerque puede hacer referencia tanto a registros de la tablaAccountcomo de la tablaContact, ¿verdad?

Y... ¿Qué te parecería si esa funcionalidad la pudiesemos extrapolar a cualquierlookupcustomizado que podamos necesitar en nuestro modelo de datos, y que pueda referenciar prácticamente a cualquier tabla (customizada, virtual, etc)? Pues espero que te parezca igual de interesante que a mi, por que sí. Esta funcionalidad se puede implementar gracias a losmulti-table lookup😎.

Esta característica está enGAdesde hace algo mas de un año y  bajo mi punto de vista no se le ha dado la relevancia que realmente tiene, ya que una de las partes mas importantes de una buena solución construida enPower Platformque trabaje conDataversees precisamente un modelo de datos robusto y congruente.

![](https://static.wixstatic.com/media/9456da_253e399434a448bea4e582ec25b6f80a~mv2.png/v1/fill/w_48,h_44,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_253e399434a448bea4e582ec25b6f80a~mv2.png)

Imagina que tenemos una aplicación que gestiona los recursos materiales asignados a los empleados de una compañía. Imagina por un momento cómo podríamos diseñar el modelo de datos sin la funcionalidad que estamos comentando en este post. Sería algo asi como lo que puedes ver en esta imagen y teniendo en cuenta que en el formulario de empleado tendríamos que incluir tantossubgridcomo tablas de recursos materiales tengamos (en mi caso cuatro). Algo engorroso tanto si tenemos en cuenta el UX de nuestra aplicación, como a la hora de trabajar ¿no crees?.

![](https://static.wixstatic.com/media/9456da_4923dc99e2464587bde5addf1f8b4b21~mv2.png/v1/fill/w_49,h_34,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_4923dc99e2464587bde5addf1f8b4b21~mv2.png)

Gracias a la característica demulti-table lookuppodemos darle la vuelta a este modelo e incluir un campoRecursode tipolookupque sea capaz de almacenar referencias a registros de cualquiera de las tablas de recursos materiales. De tal forma que podamos diseñar un modelo de datos mas robusto que facilite al mismo tiempo la usabilidad de la aplicacion que construyamos alrededor de dicho modelo. Algo parecido a lo que ves en esta otra imagen.

A día de hoy, esta característica sólo se puede realizar a través de la API deDataverse, o con esteplugindeXrmToolBooxque facilita mucho la tarea, pero como yo como soy un pocofrikivoy a tirar por la API deDataverse. Si vas por esta vía necesitarás autenticarte correctamente como vimos en estaentrada.

Abre Postman y cuando hayas adquirido un token de autenticación invoca a la url:

```powerapps
https://nombredetuentorno.api.crm4.dynamics.com/api/data/v9.0/CreatePolymorphicLookupAttribute
```

El body de esta request, en mi caso, es el que sigue:

Fíjate que lo único que estamos definiendo en una misma columnaResourcees varias relacionesOneToManya las cuatro tablas de recursos materiales:Audio Devices, Laptops, MonitorsyKeyboards.

Si todo ha ido bien, se habrá creado esta nueva columna y ya te adelanto que desde el portal dePower Appssólo vas a ver una nueva columna con ese nombre y en mi caso cuatro relaciones en la pestaña donde se muestran las relaciones de una tabla.

![](https://static.wixstatic.com/media/9456da_81e14cf85e0d4407b631dd24a45e6ea9~mv2.png/v1/fill/w_49,h_18,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_81e14cf85e0d4407b631dd24a45e6ea9~mv2.png)

Probablemente estarás pensando... Muy bien pero... y ¿ahora qué?. Ahora podemos darle forma a nuestra aplicación y te aseguro que va a ser bastante mas usable que si no utilizaramos esa característica.  Observa en la siguiente imagen como desde el formulario de detalle ya no vamos a tener unsubgridpor cada relación, si no que ahora tenemos un únicosubgridque muestra todos los recursos asignados a un empleado sin importar en que tabla reside el registro referenciado.

![](https://static.wixstatic.com/media/9456da_52f2b29478b3427dae4d6fa8ec8ec169~mv2.png/v1/fill/w_49,h_13,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_52f2b29478b3427dae4d6fa8ec8ec169~mv2.png)

![](https://static.wixstatic.com/media/9456da_94cae13ca70f48038deb5b3999b26944~mv2.png/v1/fill/w_49,h_31,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_94cae13ca70f48038deb5b3999b26944~mv2.png)

Observa también como si queremos crear una nueva asignación de un recurso a un empleado, para establecer un valor en el campomulti-table lookup Resourcela plataforma nos va a mostrar todos los registros disponibles, mostrando un icono que diferencia la tabla origen.

Y si nos vamos a la búsqueda avanzada, la cosa pinta mejor aún: la plataforma nos ofrece una ventana de búsqueda muy completa permitiendo seleccionar la tabla origen sobre la que queremos buscar.

![](https://static.wixstatic.com/media/9456da_ec75a05141964e37b7eb7d73f6e97f7c~mv2.png/v1/fill/w_49,h_25,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_ec75a05141964e37b7eb7d73f6e97f7c~mv2.png)

Vale, pero... ¿y esto como se ve enPower Automate?. Ya te adelanto que la cosa sigue pintando igual de bien. Si necesitamos crear un registro que relacione un empleado con un determinado recurso desdePower Automate, fíjate que la plataforma muestra tantos camposmulti-table lookup Resourcecomo tablas de origen estén relacionadas con este campo.

![](https://static.wixstatic.com/media/9456da_3813e2240c9d43729cd10930762212e5~mv2.jpg/v1/fill/w_98,h_60,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_3813e2240c9d43729cd10930762212e5~mv2.jpg)

Y si lo que necesitamos es hacer unretrievede un registro y consultar el campomulti-table lookup Resource, la plataforma también nos lo pone bastante fácil permitiéndonos consultar el id del registro relacionado, la tabla origen donde reside, y su valor formateado y listo para ser usado:

![](https://static.wixstatic.com/media/9456da_8991534c14ed46878078cde2d0eb164b~mv2.png/v1/fill/w_49,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_8991534c14ed46878078cde2d0eb164b~mv2.png)

Espero que a partir de ahora, en este tipo de escenarios no pierdas de vista el potencial de esta característica 😉. ¡Gracias por haber llegado hasta aquí! ¡Nos vemos en la siguiente!
