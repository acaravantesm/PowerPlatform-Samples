# Scale out de máquinas virtuales para RPA con Azure Virtual Desktop

![](https://static.wixstatic.com/media/9456da_b84d3c66a57d43f4804b340175f99726~mv2.png/v1/fill/w_49,h_15,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_b84d3c66a57d43f4804b340175f99726~mv2.png)

En esta entrada vamos a explorar las capacidades RPA dePower Automatedesde un punto de vista de infraestructura.

Antes de continuar y por mantener altas las espectativas, varias conclusiones saco con este post:

* El límite de lo que podemos montar conPower Platformesúnica y exclusivamentehasta donde nuestras ideas puedan llegar.
El límite de lo que podemos montar conPower Platformesúnica y exclusivamentehasta donde nuestras ideas puedan llegar.

* Al próximo que oiga decir quePower Platformes para hacer cositas de andar por casa, le redirijo a este post 😎
Al próximo que oiga decir quePower Platformes para hacer cositas de andar por casa, le redirijo a este post 😎

Si estás trabajando conPower Automate Desktoppara robotizar procesos, seguro que alguna vez has pensado:sí, todo esto está muy bien para robotizar un procesito sencillo, pero... ¿qué ocurre si tengo una pila de procesos muy elevada y necesito mas máquinas disponibles para ejecutar mi robot?, ¿necesito tener 100 máquinas levantadas constantemente?

Afortunadamente los ingenieros deMicrosofttambien han pensado en esto y es aquí donde aparece a nuestro rescatePower Automate Azure Virtual Desktop. No es mas que un starter kit mediante el cual con una serie de componentes deAzurey dePower Platform, podemos aprovisionar o desaprovisionar máquinas virtuales enAzureen función de la carga de trabajo y de los procesos RPA encolados en un determinado lapso de tiempo. Dicho así parece muy sencillita la cosa, pero tengamos en cuenta que este kit realiza de forma totalmente automática y desatendida lo siguiente:

* Si el número de procesos encolados es superior a lo que hemos configurado, un flujo dePower Automateaprovisiona nuevas máquinas virtuales enAzure Virtual Desktop.
Si el número de procesos encolados es superior a lo que hemos configurado, un flujo dePower Automateaprovisiona nuevas máquinas virtuales enAzure Virtual Desktop.

* Cuando las máquinas se han aprovisionado, unaCuenta de Automatizaciónejecuta un script dePowershellque une las nuevas máquinas creadas alMachine Groupdonde corren los flujos RPA.
Cuando las máquinas se han aprovisionado, unaCuenta de Automatizaciónejecuta un script dePowershellque une las nuevas máquinas creadas alMachine Groupdonde corren los flujos RPA.

* Cuando ha finalizado el paso anterior, los flujos RPA encolados se van ejecutando en estas nuevas máquinas en función de la prioridad que hemos configurado en el propio flujo.
Cuando ha finalizado el paso anterior, los flujos RPA encolados se van ejecutando en estas nuevas máquinas en función de la prioridad que hemos configurado en el propio flujo.

* Cuando el número de flujos encolados desciende, el mismo flujo cloud dePower Automatedesaprovisiona las máquinas para controlar el gasto.
Cuando el número de flujos encolados desciende, el mismo flujo cloud dePower Automatedesaprovisiona las máquinas para controlar el gasto.

Vamos al lío, aunque con un pequeñospolier: la configuración es algo engorrosa y larga, pero creo que merece la pena.

Antes de empezar, por favor descárgate el paquete que contiene los recursos que vamos a necesitar y que forman parte delStarter Kit. Aquí tienes ellinkoficial.

Lo primero que vamos a hacer es crear unMachine Groupdesde el portal dePower Automate. EsteMachine Groupes el que nos va a dar la información de cuantos procesos hay encolados. Para esta prueba de concepto voy a agregar mi ordenador local a ese grupo de máquinas.

Para crear elMachine Group, dirígete al portal dePower Automateselecciona la opciónMonitor > Machines > Machines Group. Crea un nuevo grupo, y a continuación crea una nueva máquina asociada al grupo que acabas de crear.

Para agregar la máquina al grupo de máquinas deberás tener instalada la última versión dePower Automate Desktop. Si es así, seleccionaLaunch it nowy se abrirá en tu ordenadorPower Automate Desktopdesde donde podrás terminar de vincular tu pc al grupo de máquinas. Muy importante, copia el valor de la contraseña del grupo de máquinas que lo vamos a necesitar para precisamente conocer el número de procesos encolados.

![](https://static.wixstatic.com/media/9456da_2da9492c66c44d82b82d3bdb628bd4b5~mv2.png/v1/fill/w_69,h_55,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_2da9492c66c44d82b82d3bdb628bd4b5~mv2.png)

Lo segundo que necesitamos es una serie de recursos en Azure.

* Azure Virtual Desktop:
Azure Virtual Desktop:

![](https://static.wixstatic.com/media/9456da_7bb549a917014942a4c9927c2d9341b7~mv2.png/v1/fill/w_66,h_69,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_7bb549a917014942a4c9927c2d9341b7~mv2.png)

Este recurso va a ser el servicio que va a hospedar las máquinas virtuales que van a crearse y destruirse en función del número de procesos automáticos encolados. Dirígete al portal deAzure, y en la barra de búsqueda introduceAzure Virtual Desktopy selecciónalo. Una vez en la página de este componente, ve aIntroduccióny seleccionaInicio. Lo siguiente que nos pide es que indiquemos un grupo de recursos y demás datos. Especial atención a las dos credenciales que pide en la primera pestaña: la primera credencial debe ser de un usuario existente con permisos de administrador sobre la suscripción deAzure, la segunda sin embargo debe ser una nueva credencial para un nuevo usuario que se convertirá en el administrador de dominio que se utilice para unir las nuevas máquinas que se vayan creando.

![](https://static.wixstatic.com/media/9456da_0fe48ada3eaf42fcadd9e329eebc3ecd~mv2.png/v1/fill/w_65,h_43,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_0fe48ada3eaf42fcadd9e329eebc3ecd~mv2.png)

En la pestaña deMáquinas Virtuales, nos va a pedir las características de las máquinas que se van a hospedarAzure Virtual Desktop. En mi caso para esta prueba de concepto he configurado la creación de una máquina multisesión con una imagen deWindows 11.

En la última pestaña, configura las credenciales de un usuario de prueba.

Inicia la implementación que ya te adelanto que va a tardar un buen rato.

* Azure Automation Account:
Azure Automation Account:

Este componente se va a crear de forma automática como parte de la implementación deAzure Virtual Desktop. Este recurso es el que se va a encargar de ejecutar el script necesario para instalarPower Automate Desktopen las nuevas máquinas que se creen como consecuencia de un excesivo encolamiento de procesos a ejecutar, y a unir estas máquinas alMachine Groupque hemos creado en el primer paso.

Lo único que tenemos que hacer con este componente una vez se haya creado, son dos cosas:

* Dirígete a la secciónCredencialesy apunta el nombre de la credencialAdminAzureCredentials
Dirígete a la secciónCredencialesy apunta el nombre de la credencialAdminAzureCredentials

* Ahora ve a la secciónRunbookse importa el ficherorunbookWorkflow.ps1incluido en elStarter Kit.Este es el script que va a instalarPower Automate Desktopen cada máquina virtual que se cree y acto seguido la va a unir alMachine Group.
Ahora ve a la secciónRunbookse importa el ficherorunbookWorkflow.ps1incluido en elStarter Kit.Este es el script que va a instalarPower Automate Desktopen cada máquina virtual que se cree y acto seguido la va a unir alMachine Group.

![](https://static.wixstatic.com/media/9456da_e54ed08c355b484ca7ac031e4210ad3e~mv2.png/v1/fill/w_66,h_44,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_e54ed08c355b484ca7ac031e4210ad3e~mv2.png)

* Registro de aplicación enAzure AD:
Registro de aplicación enAzure AD:

Esta aplicación se va a utilizar para crear el flujo dePower Automateque va a hacer el autoescalado delpoolde máquinas y para crear o destruir las propias máquinas. Registra una aplicación en el directorio activo deAzure, y otórgale los siguientes permisos:

![](https://static.wixstatic.com/media/9456da_d34d3ba03d7245adacad2de5e9bfb17e~mv2.png/v1/fill/w_72,h_27,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_d34d3ba03d7245adacad2de5e9bfb17e~mv2.png)

Después crea un secreto y copia tanto el identificador de aplicación como el valor del secreto.

* Azure Key Vault:
Azure Key Vault:

Este recurso va a almacenar de forma segura distintos valores que vamos a necesitar como son el identificador de aplicación y el secreto de la aplicación registrada. Crea el componente y da de alta tres secretos:

* El identificador de la aplicación creada en el paso anterior
El identificador de la aplicación creada en el paso anterior

* El valor del secreto creado en el paso anterior
El valor del secreto creado en el paso anterior

* La contraseña del grupo de máquinas que copiaste al configurar tu ordenador en el primer paso
La contraseña del grupo de máquinas que copiaste al configurar tu ordenador en el primer paso

Hemos terminado conAzure, así que lo último que necesitamos hacer es importar la solución que contiene toda lachicha. Selecciona un entorno sobre el que trabajar e importa la solución:AzureVirtualDesktopStarterKit_1_0_0_1.zip.Configura las conexiones como siempre hacemos cuando importamos una solución conReferencias de Conexióny establece los valores correctos para la conexión alKey Vault,Automation Account, etc.

La solución tardará unos minutos en importarse y cuando haya finalizado podremos empezar a ensamblar todo lo que hemos venido haciendo hasta ahora.

Ejecuta la aplicaciónAzure Virtual Desktop Integration Configuration Appy seleccionaNew Scaling Configuration.Lo primero que nos va a pedir es el nombre y el identificador del Tenant, y el entorno sobre el que vamos a trabajar.

Una vez hayas indicado estos tres parámetros, en la secciónAzure Virtual Desktop Service Principaldebes incluir el nombre de los secretos que has creado en elKey Vaulty que almacenan los valores de identificador de aplicacion y el valor de su secreto. Exactamente lo mismo para la parte deService Principal Power Automate. En mi caso, como a la misma aplicación le he dado permisos deFlow.Read.AllyAzure Service Management, los valores coinciden.

![](https://static.wixstatic.com/media/9456da_547e209a7acc43d5bec2d9a354fc2393~mv2.png/v1/fill/w_49,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_547e209a7acc43d5bec2d9a354fc2393~mv2.png)

En el paso dos, necesitamos configurar elMachine Groupque hemos configurado al principio. Si has configurado los secretos delKey Vaultde forma correcta, en este segundo paso se mostrará el nombre delMachine Group. Si ves que la app reporta algún error revisa que los secretos estén bien configurados y revisa los nombres deAzure Virtual Desktop Service PrincipalyService Principal Power Automatedel paso previo de la aplicación.

![](https://static.wixstatic.com/media/9456da_a776214adf9147fbb31c758cc0c7f70a~mv2.png/v1/fill/w_49,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_a776214adf9147fbb31c758cc0c7f70a~mv2.png)

En el tercer paso, vamos a indicar la configuración delhostde máquinas virtuales que va a albergar las nuevasVMsy la cuenta de automatización que va a ejecutar el script de configuración. Selecciona la suscripción deAzure, el grupo de recursos y el recurso deAzure Virtual Desktop. En la parte inferior debes indicar, el nombre de la cuenta de automatización, las credenciales de la cuenta de automatización que has apuntado antes (en mi casoAdminAzureCredentials), y por último enMachine Group Passwordindica el nombre del secreto que almacena la contraseña del grupo de máquinas.

![](https://static.wixstatic.com/media/9456da_b9f0b0ccb6494c9bac2d6bbdf13d8ab0~mv2.png/v1/fill/w_49,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_b9f0b0ccb6494c9bac2d6bbdf13d8ab0~mv2.png)

¡Vamos con el último paso de la configuración!

EnScaling Strategycomo te puedes imaginar, necesitamos configurar por un lado la recurrencia con la que se va a comprobar la cola de procesos RPA encolados, el número de procesos encolados que deben existir para que se aprovisionen mas máquinas, el número mínimo de máquinas que deben estar levantadas, y el modo de desescalado:desaprovisionamiento(que lleva mas tiempo y literalmente destruye las máquinas creadas) oapagado. Para esta prueba de concepto esta es mi configuración:

![](https://static.wixstatic.com/media/9456da_9b0243e942274f6982d5649d73face24~mv2.png/v1/fill/w_49,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_9b0243e942274f6982d5649d73face24~mv2.png)

¡Ya está! Si todo ha ido bien, que seguro que sí, te invito a que hagas una prueba: lanza un flujo cloud que lance un flujo RPA y fuerza la ejecución del flujo cloud con nombre:Auto Generated Orchestration Flow.

Observa lo siguiente:

* Fíjate que en elMachine Grouphay solo una máquina levantada
Fíjate que en elMachine Grouphay solo una máquina levantada

![](https://static.wixstatic.com/media/9456da_c0b7bea0ad5b4661b3f802b5210105b4~mv2.png/v1/fill/w_49,h_8,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_c0b7bea0ad5b4661b3f802b5210105b4~mv2.png)

* Mira como el flujoAuto Generated Orchestration Flowestá en ejecución:
Mira como el flujoAuto Generated Orchestration Flowestá en ejecución:

![](https://static.wixstatic.com/media/9456da_2c899ea7258441a9a64852c74d00a4a3~mv2.png/v1/fill/w_49,h_22,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_2c899ea7258441a9a64852c74d00a4a3~mv2.png)

* Dale un vistazo a laCuenta de Automatizacióny comprueba que elrunbook runbookWorkflowse ha ejecutado satisfactoriamente. Como ves, me han hecho falta unas cuantas pruebas 😝:
Dale un vistazo a laCuenta de Automatizacióny comprueba que elrunbook runbookWorkflowse ha ejecutado satisfactoriamente. Como ves, me han hecho falta unas cuantas pruebas 😝:

![](https://static.wixstatic.com/media/9456da_09d8c7717999417e9822c06cbf7a8fa2~mv2.jpg/v1/fill/w_147,h_77,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_09d8c7717999417e9822c06cbf7a8fa2~mv2.jpg)

* Y por último la traca final. Vuelve alMachine Groupy.... ¡tachán! Una nueva máquina se ha vinculado al grupo de máquinas y esta disponible para balancear la carga de procesos RPA. Si sigues probando, verás como cuando el número de procesos encolados baja de lo que hemos configurado, la nueva máquina virtual haceshutdownde forma automática.
Y por último la traca final. Vuelve alMachine Groupy.... ¡tachán! Una nueva máquina se ha vinculado al grupo de máquinas y esta disponible para balancear la carga de procesos RPA. Si sigues probando, verás como cuando el número de procesos encolados baja de lo que hemos configurado, la nueva máquina virtual haceshutdownde forma automática.

![](https://static.wixstatic.com/media/9456da_141f89cd67be4fa584a2fba9c0942709~mv2.png/v1/fill/w_49,h_10,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_141f89cd67be4fa584a2fba9c0942709~mv2.png)

¿Qué?, Con quePower Platformes para cosas simples ¿eh?

¡Espero haber sido de ayuda!, ¡Hasta la próxima!

Etiquetas:

* Power Automate
* Azure
* Power Automate Desktop
* Power Automate
* Azure
* Power Automate Desktop
