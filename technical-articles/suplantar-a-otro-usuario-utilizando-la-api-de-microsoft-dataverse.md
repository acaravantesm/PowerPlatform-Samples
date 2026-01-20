# Suplantar a otro usuario utilizando la API de Microsoft Dataverse

![](https://static.wixstatic.com/media/9456da_170e91baa661448e9a46c5d443a9eaeb~mv2.jpg/v1/fill/w_97,h_57,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_170e91baa661448e9a46c5d443a9eaeb~mv2.jpg)

¿Nunca se ha presentado la ocasión en que algún cliente necesita poder realizar llamadas a la API deDataversecon la seguridad de un usuario en concreto, pero sin que el usuario tenga que estar escribiendo sus credenciales en elpopupde login deMicrosoft?

Pues para resolver entre otros este escenario, aparece la posibilidad de suplantar a un usuario invocando a la API deDataverse. Dicho así suena algo muy peligroso pero... nada mas lejos de la realidad.

La suplantación  de identidad se utiliza para ejecutar cierta lógica en nombre de otro usuario deMicrosoft Dataversey para asegurarnos que esa lógica se ejecuta con el rol de seguridad que corresponde y en el contexto del usuario suplantado.

La  suplantación implica utilizardos cuentas distintas de usuario:

* Cuenta de usuario (normalmente una cuenta de servicio o lo que se conoce comoapplication user) que se usa para obtener el token de autenticación a la API deDataverse. Esta cuenta de usuario debe tener el rol de seguridad con nombreDelegatedoDelegadopara obtener el privilegioprvActOnBehalfOfAnotherUser. Sin este privilegio, esta cuenta no va a poder suplantar a ningún usuario.
Cuenta de usuario (normalmente una cuenta de servicio o lo que se conoce comoapplication user) que se usa para obtener el token de autenticación a la API deDataverse. Esta cuenta de usuario debe tener el rol de seguridad con nombreDelegatedoDelegadopara obtener el privilegioprvActOnBehalfOfAnotherUser. Sin este privilegio, esta cuenta no va a poder suplantar a ningún usuario.

* Cuenta del usuario suplantado con su pertinente rol de seguridad.
Cuenta del usuario suplantado con su pertinente rol de seguridad.

Esmuy importanterecalcar que si el usuario al que queremos suplantar, tiene un permiso del que no dispone la cuenta de usuario delegada, la operación no va a funcionar. Esto significa que la cuenta de usuario con la que obtengamos el token de acceso, debe tener como mínimo los mismos permisos que el usuario al que vamos a suplantar.

Antes de continuar, si no has visto la entrada que escribí (hace ya bastante tiempo...👴) sobre autenticaciónOAuth a la API de Dataverse, échale un ojo antes de seguir.

Para esta prueba tan sencilla todo lo voy a realizar a través dePostmany ya tengo configurado:

* Una aplicación registrada enAzure AD, con sus permisos, su secreto, etc. tal y como vimos en el post de autenticación que comentaba arriba.
Una aplicación registrada enAzure AD, con sus permisos, su secreto, etc. tal y como vimos en el post de autenticación que comentaba arriba.

* Una cuenta de servicio oapplication userconfigurada en el entorno dePower Platformsobre el que estoy trabajando, que hace referencia a la aplicación registrada enAzure ADdel punto anterior.
Una cuenta de servicio oapplication userconfigurada en el entorno dePower Platformsobre el que estoy trabajando, que hace referencia a la aplicación registrada enAzure ADdel punto anterior.

* Un token de acceso que me permite invocar a la API deDataverse.
Un token de acceso que me permite invocar a la API deDataverse.

Suplantar a un usuario es tan sencillo como incluir en la cabecera de la llamada a la API la propiedadCallerObjectId. El valor de esta propiedad debe ser el identificador del objeto al que vamos a suplantar. En este caso un usuario.

Este identificador de objeto lo puedes extraer o consultar de varias formas, aunque aquí te dejo las que creo que son mas sencillas:

* Desde el portal deAzuredirigiéndote aActive Directory, seleccionandoUsersy en el detalle del usuario al que vamos a suplantar puedes consultar el identificador único de ese usuario
Desde el portal deAzuredirigiéndote aActive Directory, seleccionandoUsersy en el detalle del usuario al que vamos a suplantar puedes consultar el identificador único de ese usuario

![](https://static.wixstatic.com/media/9456da_b3fa14a723644ef79362797c9fbd970c~mv2.png/v1/fill/w_78,h_46,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_b3fa14a723644ef79362797c9fbd970c~mv2.png)

* Otra opción es consultar directamente la tabla virtual deDataverseAAD User
Otra opción es consultar directamente la tabla virtual deDataverseAAD User

![](https://static.wixstatic.com/media/9456da_3c10e00503d54727991313be2d2b5f3a~mv2.png/v1/fill/w_76,h_43,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_3c10e00503d54727991313be2d2b5f3a~mv2.png)

Una vez hayas obtenido el identificador del usuario al que vamos a suplantar, lo único que hay que hacer es montar la llamada de la forma que ves en la siguiente imagen. Como puedes observar, lo único que estoy haciendo es crear un registro en la tablaAccountsoCuenta:

![](https://static.wixstatic.com/media/9456da_a97f71118aa144ffbf0ea2056588a105~mv2.png/v1/fill/w_79,h_39,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_a97f71118aa144ffbf0ea2056588a105~mv2.png)

Si ahora vas a la tablaCuenta, verás un nuevo registro creado y fíjate en algo muy importante: los valores que aparecen en los camposCreated By (Delegate)yCreated By.Ya te adelanto que el primero va a tener la cuenta que hemos utilizado para obtener el token de autenticación, y el segundo campo tendrá el valor del usuario al que hemos suplantado:

![](https://static.wixstatic.com/media/9456da_2e7161a532d84e84ac3dcc322e01ef32~mv2.png/v1/fill/w_49,h_31,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_2e7161a532d84e84ac3dcc322e01ef32~mv2.png)

¡Espero que la lectura haya merecido la pena! ¡¡Nos vemos en la siguiente!!