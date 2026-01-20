# IP Firewall Restriction en Microsoft Dataverse

![](https://static.wixstatic.com/media/9456da_09d69f49a918424196115e9178904010~mv2.jpg/v1/fill/w_148,h_58,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_09d69f49a918424196115e9178904010~mv2.jpg)

Como bien sabes,Microsoft siempre esta incorporando nuevas características aPower Platform. Bien sea desde un punto de vista funcional, desde un punto de vista delook and feel, o como es este caso desde un punto de vista de arquitectura y/o seguridad.

En las últimas semanas se ha anunciado una nueva característica que aun está enPreview(por lo que recuerda que aun no se recomienda usar en entornos productivos), que permite filtrar todas las llamadas a la API deDataversepermitiendo sólo aquellas que provengan de una lista blanca de IP´s configuradas.

¡¡Cuidado que hay un requisito muy importante a tener en cuenta antes de usar esta nueva característica!! El entorno sobre el que queramos utilizarla, debe ser unManaged Environmentcon todas las implicaciones que tiene a nivel de licenciamiento.

Asegúrate que el entorno sobre el que vas a trabajar es un entorno administrado y...

![](https://static.wixstatic.com/media/9456da_fa2c3591b5234d88842ad01f7f78d3f1~mv2.png/v1/fill/w_89,h_29,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_fa2c3591b5234d88842ad01f7f78d3f1~mv2.png)

Accede alCentro de Administración de Power Platformy selecciona el entorno sobre el que vas a configurar esta característica. Dirígete aSettingsy una vez allí seleccionaProduct>Privacy + Security.Allí busca la sección con nombre"Enable IP address based firewall rule".

Cuando actives esta característica te pedirá una serie de opciones: lógicamente la lista blanca de IP´s (separadas por comas y con un máximo de 200 direcciones), y una serie de propiedades adicionales que comentamos en profundidad:

* Service tags to be allowed by IP firewall: para permitir elbypassde ciertos servicios deMicrosoft.
Service tags to be allowed by IP firewall: para permitir elbypassde ciertos servicios deMicrosoft.

* Allow access for Microsoft trusted services: Se activa por defecto y habilita el acceso a nuestro entorno paraservice tagsde confianza deMicrosoftcomoPowerPlatformInfra,GenevaSynthetics, etc.
Allow access for Microsoft trusted services: Se activa por defecto y habilita el acceso a nuestro entorno paraservice tagsde confianza deMicrosoftcomoPowerPlatformInfra,GenevaSynthetics, etc.

* Allow access for all application users: También se activa por defecto y permite que losapplication userssigan teniendo acceso aDataverseaunque realicen llamadas desde una IP que no esté en la lista blanca configurada.
Allow access for all application users: También se activa por defecto y permite que losapplication userssigan teniendo acceso aDataverseaunque realicen llamadas desde una IP que no esté en la lista blanca configurada.

* Enable IP firewall in audit only mode:  También activado por defecto y permite auditar las llamadas que provienen desde una IP que no está incluida en la lista blanca, pero no bloquea estas llamadas.
Enable IP firewall in audit only mode:  También activado por defecto y permite auditar las llamadas que provienen desde una IP que no está incluida en la lista blanca, pero no bloquea estas llamadas.

* Reverse proxy IP addresses:  Por último, esta propiedad esta destinada para aquellas organizaciones que actúen detrás de un proxy.
Reverse proxy IP addresses:  Por último, esta propiedad esta destinada para aquellas organizaciones que actúen detrás de un proxy.

La configuración que yo he utilizado para mi prueba es la que se puede ver en la siguiente imagen:

![](https://static.wixstatic.com/media/9456da_b512799e044d4944ac031df077637165~mv2.png/v1/fill/w_101,h_105,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_b512799e044d4944ac031df077637165~mv2.png)

Como ves, he incluido mi dirección IP actual en la lista blanca, he permitido que losapplication userssigan haciendo llamadas a la API deDataverse, y he desactivado el modoaudit onlypara que se bloqueen todas las llamadas que no provengan de las IP´s permitidas.

Si ahora intento acceder a cualquier característica del entorno donde he configurado esta restricción desde una IP no permitida, obtengo el siguiente error:

![](https://static.wixstatic.com/media/9456da_40a351e444924150897666543d895a1f~mv2.png/v1/fill/w_49,h_26,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_40a351e444924150897666543d895a1f~mv2.png)

Sin embargo, al haber dejado activada la propiedadAllow access for all application users, sigo pudiendo realizar llamadas directamente a la API deDataversecon untokengenerado con un credenciales de este tipo de usuarios:

![](https://static.wixstatic.com/media/9456da_4f0224e764da4c36ab5647cfed434a4f~mv2.png/v1/fill/w_49,h_30,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_4f0224e764da4c36ab5647cfed434a4f~mv2.png)

Y es sólo cuando desactivo esa propiedad, cuando ya no puedo seguir invocando a la API deDataverse:

![](https://static.wixstatic.com/media/9456da_4f30c9f22c114331bcce95555d1fe842~mv2.png/v1/fill/w_49,h_7,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_4f30c9f22c114331bcce95555d1fe842~mv2.png)

AunquePower Platformsea una plataforma como servicio y no tengamos acceso a toda la infraestructura que se despliega por detrás para hacer funcionar el servicio (que como te imaginarás, no es poca), podemos tener acceso a este tipo de funcionalidades de una forma mucho mas sencilla y rápida que si tuviéramos que configurar la infraestructura en si.

¡Ojala que este post haya resultado interesante! ¡¡Hasta la próxima!!

Etiquetas:

* API
* Seguridad
* Dataverse
* Seguridad
