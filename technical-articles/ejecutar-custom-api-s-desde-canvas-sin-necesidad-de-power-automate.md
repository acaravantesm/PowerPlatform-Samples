# Ejecutar Custom API´s desde Canvas sin necesidad de Power Automate

![](./assets/capi/9456da_a01214074e794a2f999eb8e2f0209acf~mv2.avif)

Seguro que si has estado atento/a a las últimas novedades y actualizaciones en RRSS, habrás visto que hace bien poquito ha salido una nueva funcionalidad que permite ejecutarCustom ActiondesdePower Fxsin necesidad de utilizarPower Automatecomo teníamos que hacer hasta ahora.

Si recuerdas los posts donde hablaba sobre lasCustom API(parte Iyparte II), veíamos como lasCustom APIse comportaban comoCustom Actionsalvo con las diferencias que puedes encontrar en ladocumentación oficial. Por lo que cuando vi esta nueva funcionalidad lo primero que pensé fue: "si se pueden ejecutar Custom Action desdePower Fx... ¿también puedo ejecutar Custom API´s?". La respuesta, ya te la adelanto, es si. 😎

En el ejemplo de hoy voy a seguir dándole continuidad al caso que proponía eneste postdonde comentaba como unaCustom APIpodía devolver una response customizada. En aquel ejemplo, trabajaba con un modelo de datos donde1OrganizaciónteníaNEnvironmentsy1EnvironmentteníaN Aplicaciones. En esta entrada, trabajaremos con ese mismo ejemplo.

Hecha esta breve introducción, me gustaría recordar como hasta ahora podíamos ejecutarCustom APIdesdePower Fx:

* Construimos un flujo dePower Automateque invoque a la API, donde laresponsede la API es eloutputdel propio flujo
Construimos un flujo dePower Automateque invoque a la API, donde laresponsede la API es eloutputdel propio flujo

![](./assets/capi/9456da_c9a91e98d8084282ab308e001252b8dc~mv2.avif)

* DesdePower Fxinvocamos al flujo dePower Automatey formateamos y convertimos los datos recibidos a una colección...(para poder hacer estoactiva la funcionalidadexperimental deParseJSON)
DesdePower Fxinvocamos al flujo dePower Automatey formateamos y convertimos los datos recibidos a una colección...(para poder hacer estoactiva la funcionalidadexperimental deParseJSON)

![](./assets/capi/9456da_d7c88e58d20a47f5b57893f8110644d0~mv2.avif)

* ...para poder vincular la coleccióncolOrganizationsa una galería.
...para poder vincular la coleccióncolOrganizationsa una galería.

![](./assets/capi/9456da_3d872319ce1643fa93cd0063dfa2d486~mv2.avif)

En el caso en el que trabajes en un escenario con muchasCustom API, podría darse el caso en que la cantidad de flujos a construir fuese elevada, o si optásemos por tener un único flujo dePower Automatepara invocar a nuestrasCustom API, podría ser que la lógica de este flujo se complicase demasiado.

Pues bien, con esta nueva funcionalidad que nos traeMicrosoft, vamos a poder quitarnos de en medio el/los flujo/s dePower Automatee invocar a laCustom APIdesde la propia aplicación.

¿Cómo? muy fácil. Desde la propia aplicación Canvas sobre la que estés trabajando seleccionaSettings>Upcoming featuresy selecciona la (por ahora) última opción:Enable access to Microsoft Dataverse actions.

![](./assets/capi/9456da_955dadc6f5dc4a1db825e1afe8feb054~mv2.avif)

Lo siguiente que tenemos que hacer es agregar un nuevo origen de datos a nuestra aplicación. En concreto la tabla con nombreEnvironment.Y...¡listo!. Lo único que nos falta por hacer es empezar a invocar a las acciones o (en este caso) a laCustom APIque queremos ejecutar.

Fíjate cómo la plataforma va haciendo su trabajo y mientras escribes el nombre de la tablaEnvironmenten una fórmulaPower Fx, van apareciendo todas las acciones y API´s disponibles en ese entorno. Además cuando seleccionas la acción o API, observa también cómoPower Fxte va proponiendo lo que esafunciónestá esperando como parámetros de entrada.

![](./assets/capi/9456da_4a81c56ac3094145bb5c90fa27460c01~mv2.avif)

Como hemos visto antes, laCustom APIcon la que yo estoy trabajando en esta pequeña prueba de concepto espera como entrada un nombre de una organización para poder devolver la lista de entornos y sus apps como respuesta, por lo que lo sólo tenemos que  actualizar nuestra fórmula para no invocar al flujo dePower Automatey trabajar directamente con la API.

![](./assets/capi/9456da_be8a742f00ed421381fe3bb8bacc956a~mv2.avif)

Lógicamente todo esto se puede complicar bastante más. Por ejemplo si necesitamos pasar objetos con una estructura mas compleja comorequest. En ese caso te recomiendo, paciencia y revisar muy muy bien ladocumentación oficial de Microsoft.

Por último y no menos importante... ¡lo de siempre!: esta funcionalidad está aun enfase experimentalpor lo que no es recomendable su uso en entornos productivos. ¡Espero haber sido de ayuda!. ¡Gracias por haber llegado hasta aquí! ¡Nos vemos en la próxima!