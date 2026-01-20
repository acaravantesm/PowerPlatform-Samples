# Habilitar el desarrollo de aplicaciones a usuarios externos

![](https://static.wixstatic.com/media/9456da_9d56ae632e54489b9281a1ce01c380ec~mv2.jpg/v1/fill/w_133,h_77,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_9d56ae632e54489b9281a1ce01c380ec~mv2.jpg)

Sirva esta nueva entrada como calentamiento para los próximos dias 9 y 10 de Septiembre. ¿Cómo? ¿Todavía no sabes que tiene lugar en Madrid elBizz Summit ES 2022? Se hablará mucho y muy interesante deDynamics 365yPower Platform. Si aún no tienes tu entrada...   ¿a qué estas esperando? 👏🏻

Al lío con el post. Hasta ahora sabíamos que podíamos otorgar acceso a una determinada aplicación, a un usuario externo a la organización donde se ejecutaba dicha aplicación ¿cierto?. Bastaba con invitar al usuario externo al directorio activo deAzure, asignarle una licencia, compartirle la aplicación y listo, ¿verdad?. Si estoy hablando de algo que desconocías, te invito a que antes de seguir leyendo este post, eches un vistazo a ladocumentación oficialde esto que comento.

Bueno, pues el equipo deMicrosoft Power Platformestá trabajando en darle una vuelta de tuerca a esto. Es cierto que la funcionalidad que nos ocupa hoy todavía está enpreviewy como sabes las funcionalidades que están aún en esta faseno están disponibles para ser utilizadas en entornos productivos. Pero eso no significa que no podamos ir jugando y viendo como se comporta en este caso, la funcionalidad que va a permitir que usuarios externos o invitados además de ejecutar aplicaciones puedan desarrollarlas e implementarlas. Por supuesto, cuando hablo de aplicaciones, hablo de componentesPower Platform: tablas, flujos, etc 😊.

![](https://static.wixstatic.com/media/9456da_8dc459adbf634b46bd374f65566b553e~mv2.png/v1/fill/w_81,h_46,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_8dc459adbf634b46bd374f65566b553e~mv2.png)

De echo si te has fijado, habrás podido observar como desde hace unos dias, en el portal dePower Apps, bajo el icono que representa el usuario logado ha aparecido una nueva opción con el nombreSwitch Directory. ¿Has probado a hacer clic en esta nueva opción?

![](https://static.wixstatic.com/media/9456da_485ea63d2d2441baaf62b52ef9a0436e~mv2.png/v1/fill/w_49,h_32,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_485ea63d2d2441baaf62b52ef9a0436e~mv2.png)

Si te has pegado con el tema de usuarios, licencias, accesos, etc. Es probable que una de las cosas que te estes preguntando sea lo siguiente:

Ya te adelanto la respuesta: el usuario invitado consume licencia tanto en su organización original (home tenant) como en la organización donde ha sido invitado (resource tenant). Al menos esto es asi a dia de hoy.

Eso si, como siempre, el tipo de licencia que consuma en uno y otro entorno dependerá de las características de los componentes que ejecute o desarrolle este usuario.

Las pruebas de que el tema del licenciamiento es como comento en el párrafo anterior, al final del post 😜.

Vamos a ver cuáles son los pasos para poder configurar la colaboración de usuarios externos. En primer lugar necesitamos tener claro dos conceptos que nombraba mas arriba:

* Home tenantrepresenta la organización donde reside originalmente el usuario al que vamos invitar.
Home tenantrepresenta la organización donde reside originalmente el usuario al que vamos invitar.

* Resource tenantrepresenta la organización donde el usuario invitado va desarrollar componentes. El tenant destino, por asi decirlo.
Resource tenantrepresenta la organización donde el usuario invitado va desarrollar componentes. El tenant destino, por asi decirlo.

Todos los pasos que vamos a realizar a continuación, deben ser realizados en elresource tenant.

Inicia sesión en elPortal de Azurecon una cuenta con permisos suficientes para modificar algunas características del directorio activo deAzurey para invitar usuarios externos. Dirígete aAzure Active Directory>External Identities>External collaboration settings. Las secciones de esta página deben quedar configuradas como ves en la imagen inferior. Ojo que estas configuraciones tienen sus particularidades que debes tener en cuenta y que puedes consultaraquí.

![](https://static.wixstatic.com/media/9456da_8d7345754f834ddf922f43eab75c2e9e~mv2.png/v1/fill/w_49,h_35,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_8d7345754f834ddf922f43eab75c2e9e~mv2.png)

El paso siguiente es invitar al usuario externo. SeleccionaAzure Active Directory>Users>New User>Invite external user. Indica la información necesaria para dar de alta al usuario externo y una vez realizado el alta, al usuario invitado le debería llegar un correo electrónico parecido al de la imagen inferior desde el que podrá aceptar la invitación.

![](https://static.wixstatic.com/media/9456da_04c902b7b24143629d7b9c2798955bff~mv2.png/v1/fill/w_77,h_67,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_04c902b7b24143629d7b9c2798955bff~mv2.png)

Una vez el usuario invitado haya aceptado la invitación, aparecerá en el directorio activo delresource tenant. Lo siguiente que necesitamos hacer es asignarle una licencia al usuario invitado. Para ello dirígete aAzure Active Directory>Usersy busca el usuario que acabas de agregar. Cuando accedas al detalle del nuevo usuario, bajo la secciónLicensespodrás asignar una licencia al nuevo usuario externo.

Vamos con el (pen)último paso, ya que si te fijas hasta ahora no hemos hecho nada nuevo. Abre una ventana dePowershellcon permisos de administrador, instala la ultima versión del móduloMicrosoft.PowerApps.Administration.PowerShelly ejecuta los siguientes comandos con un usuario con permisos de administrador globalPower Platform:

```powerapps
$requestBody = Get-TenantSettings $requestBody.powerPlatform.powerApps.enableGuestsToMake = $True 
Set-TenantSettings $requestBody 
```

Lo único que nos falta por hacer es acceder al entorno  delresource tenantdonde el usuario invitado va a comenzar a colaborar, y añadir al usuario invitado con el rolEnvironment MakeroSystem Customizer. Lógicamente toda esta operativa la puedes realizar mediante el uso de grupos de seguridad deAzurey los equipos deMicrosoft Dataverse.

Si todo ha ido bien, el usuario invitado podrá hacerSwitch Directorydesde elhome tenantalresource tenanty acceder al entorno sobre el que poder empezar a colaborar.

![](https://static.wixstatic.com/media/9456da_4228f83a85f64ed1b972540e43f76be0~mv2.gif/v1/fill/w_147,h_71,al_c,usm_0.66_1.00_0.01,blur_2,pstr/9456da_4228f83a85f64ed1b972540e43f76be0~mv2.gif)

Como decía mas arriba, lo que se ve en la animación anterior es gracias a que el "mismo" usuario tiene licencias en ambos tenant. Las pruebas de que esto es así, lo puedes ver en la siguiente imagen. Según se añade como invitado el usuario en cuestión alresource tenant, lógicamente si no hay política de licenciamiento, no se le asigna ninguna licencia:

![](https://static.wixstatic.com/media/9456da_a08a161971ee4eaeb21489e7e83d197e~mv2.png/v1/fill/w_49,h_19,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_a08a161971ee4eaeb21489e7e83d197e~mv2.png)

![](https://static.wixstatic.com/media/9456da_84c737a9263d4878921e476de0534e97~mv2.png/v1/fill/w_83,h_102,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_84c737a9263d4878921e476de0534e97~mv2.png)

Si en ese estado intentamos añadir al usuario invitado a algun entorno del resource tenant, obtendremos el error que puedes ver en esta imagen. Confía en mí cuando digo que el usuario está activo enAzure Active Directoryy que el entorno no está configurado con ningún grupo de seguridad.

El problema realmente, es que ese usuario no tiene licencia en elresource tenant.

La prueba de que esto es así está en la siguiente imagen, ya que si a ese usuario le asigno una licencia válida...

![](https://static.wixstatic.com/media/9456da_fed8b74a4f914c8399943172a4d7049a~mv2.png/v1/fill/w_86,h_53,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_fed8b74a4f914c8399943172a4d7049a~mv2.png)

... el error desaparece y el usuario se crea sin ningún problema en el entorno en cuestión pudiendo ejecutar las aplicaciones para las que la licencia asignada le da permisos.

![](https://static.wixstatic.com/media/9456da_ae575b12606e4639bc2b0b21c8497a0e~mv2.png/v1/fill/w_49,h_33,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_ae575b12606e4639bc2b0b21c8497a0e~mv2.png)

¡Gracias por haber llegado hasta aquí! Nos vemos en la siguiente.

* Power Apps
* Dataverse
* Power Automate
