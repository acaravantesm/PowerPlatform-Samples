# Modernización de Business Units

![](https://static.wixstatic.com/media/9456da_2d2aa1ae0ede4c90a4171fb74fd9f9df~mv2.png/v1/fill/w_76,h_13,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_2d2aa1ae0ede4c90a4171fb74fd9f9df~mv2.png)

Es curioso que cuando aparece un cliente con una necesidad específica que en esos momentos es algo que no parece soportado por la plataforma o requiere montar un arco de iglesia para cubrir ese requisito, a las pocas semanas sale una nueva funcionalidad de la plataforma que habría venido como anillo al dedo para cubrir ese requisito en cuestión. Eso mismo nos pasó hace no mucho con un cliente cuyos usuarios podían pertenecer a N unidades de negocio. Unidades de negocio hijas, unidades de negocio padres de otras ramas distintas, etc. Tuvimos multitud de reuniones con ellos para encajar ese modelo de seguridad en la plataforma y aunque al final lo conseguimos, lo que vamos a ver hoy nos habría facilitado la vida enormemente.

Hoy vamos a hablar de una nueva funcionalidad que aún está enpreviewpero con la que ya podemos empezar a jugar. Lo han llamadoModernización de Business Units.Aquítienes algo mas de info.

Antes de pasar a ver que trae esa nueva funcionalidad, vamos a dar un poco de contexto de lo que tenemos hasta ahora en cuanto aUnidades de Negociose refiere. LasUnidades de Negociono son más que representaciones lógicas de actividades o departamentos de negocio relacionados que junto con los roles de seguridad nos van a permitir crear un modelo de seguridad dentro deDataversepara controlar quién accede a qué información. Cuando creamos una nueva instancia deDataversesiempre se crea una unidad de negocio padre de la cual van a colgar todas las demás. Una representación visual de lasUnidades de Negociopodría ser la que se ve a continuación.

![](https://static.wixstatic.com/media/9456da_6fdb37d2d3bf458dbd3f0aabc1fac482~mv2.png/v1/fill/w_49,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_6fdb37d2d3bf458dbd3f0aabc1fac482~mv2.png)

En la imagen anterior vemos como una organización llamadaBoost Power Platformtiene dos departamentos:VentasyMarketingque son representadas en la plataforma a través de unidades de negocio hijas de la unidad de negocio principal.VentasyMarketingademás son padres del restro de unidades de negocio que en este caso representan geografías. Los usuarios de cada unidad de negocio, dependiendo de como esté configurado su rol de seguridad, sólo podrán ver los registros cuyo valor del campo estándarOwning Business Unitsea igual a:

* La unidad de negocio asociada al usuario
La unidad de negocio asociada al usuario

* La unidad de negocio padre de la unidad de negocio asociada al usuario
La unidad de negocio padre de la unidad de negocio asociada al usuario

* La unidad de negocio principal
La unidad de negocio principal

Fíjate en la siguiente imagen donde en la parte superior puedes ver tres navegadores con tres usuarios que pertenecen a unidades de negocio distintas, y que por la configuración de su rol de seguridad sólo pueden ver los contactos asociados directamente a su unidad de negocio. Observa en la parte inferior como un usuario con permisos de administrador puede ver todos los contactos independientemente de la unidad de negocio a la que estén asociados los registros.

![](https://static.wixstatic.com/media/9456da_447ff12f08c1453a80588a7568d8d277~mv2.png/v1/fill/w_49,h_25,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_447ff12f08c1453a80588a7568d8d277~mv2.png)

Yo lo estoy resumiendo mucho pero lógicamente las Unidades de Negocio como las conocemos actualmente tienen sus particularidades y sus limitaciones que puedes consultaraquí. De la limitación que vamos a hablar hoy en concreto es la que tuvimos en el cliente que comentaba mas arriba:

Pero... ¿y si tenemos un usuario que trabaja al mismo tiempo enVentas-LatamyMarketing-Latam?, ¿y si el gestor deMarketingque accede a toda esa unidad de negocio (y sus hijas) debe acceder tambien aVentas-Latam?.Dejando a un lado el resto de funcionalidades de la plataforma relativas al acceso a los datos, hasta ahora no había forma en que un usuario de una unidad de negocio de una rama, pueda ver información de otra unidad de negocio de otra rama si no comparten unidad de negocio padre.

Es aquí donde laModernización de Unidades de Negocioaparece al rescate ya que nos va a permitir asociar a un usuario a más de una unidad de negocio. Para poder trabajar con esta nueva funcionalidad lo primero que tenemos que hacer es activarla a nivel de entorno. Para ello dirígete alCentro de Administración, selecciona tu entorno de trabajo, seleccionaConfiguración,ProductoyCaracterísticas. En la parte inferior derecha aparecerá una opción con nombrePropiedad de registro en distintas unidades de negocio (versión preliminar). Activa esta opción.

Una vez está activada esta opción, lo que vamos a hacer es asignar al usuario deMarketing-Latama la unidad de negocio deVentas-Latam. Para ello basta con ir a la gestión de usuarios, seleccionar al usuario en cuestión y seleccionar la opciónAdministrar roles de seguridad. Observa el nuevo desplegable que aparece en la parte superior del panel lateral.

![](https://static.wixstatic.com/media/9456da_0a0796831af2423caf66e669bf106da2~mv2.png/v1/fill/w_49,h_22,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_0a0796831af2423caf66e669bf106da2~mv2.png)

Ese nuevo desplegable va a mostrar todas las unidades de negocio disponibles en ese entorno y basta con seleccionar la unidad de negocio a la que queremos añadir a este usuario y seleccionar su rol de seguridaddentro de esa unidad de negocio. En mi caso voy a seleccionar la unidad de negocioVentas-Latamseleccionado el rol de seguridadSalesperson. A partir de este momento ese usuario va a poder acceder tanto a los contactos que gestione la unidad de negocioMarketing-Latamcomo a los que gestioneVentas-Latam.

![](https://static.wixstatic.com/media/9456da_d35e35b640f34a76824d2d69691003b6~mv2.png/v1/fill/w_63,h_50,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_d35e35b640f34a76824d2d69691003b6~mv2.png)

Como siempre digo yo intento simplificarlo al máximo en estos post, por lo que si necesitas ampliar información no dudes en pasarte por estevideodonde se baja a mas nivel.

¡¡Espero que este post haya sido útil!! Nos vemos en la siguiente!