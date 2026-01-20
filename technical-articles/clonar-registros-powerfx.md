# Clonar registros con PowerFx

![](https://static.wixstatic.com/media/9456da_21567c51db2a4f8a9d6ce82e5540b869~mv2.png/v1/fill/w_49,h_28,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_21567c51db2a4f8a9d6ce82e5540b869~mv2.png)

Si pienso en cómo tendríamos que implementar esta funcionalidad cuando empecé conDynamicshace ya unos cuantos años, y lo comparo con lo que vamos a ver ahora me explota el cerebro la verdad.

Hace algún tiempo si quisieramos implementar una funcionalidad tansimplecomo clonar un registro deDynamics, ahoraDataverse, se me hubiera ocurrido por ejemplo implementar unPluginque se invoque a través de un botón que hay que configurar con elRibbon Workbenchentre otras opciones... Todas esas opciones bastante mas costosas de lo que vamos a hacer hoy.

Vamos a clonar registros de la tablaCuentasutilizandoPowerFxa través de una funcionalidad que actualmente sigue enpreview.

Lo primero que tenemos que hacer es crear una nueva solución y agregar la aplicaciónmodel-drivenque queremos customizar. Una vez se ha agregado la aplicación, sobre el menú contextual de la propia aplicación haz clic en la opciónEditar,Editar en vista previa.

![](https://static.wixstatic.com/media/9456da_a3ab7e8aab064fe0b251afee58cf7357~mv2.png/v1/fill/w_49,h_29,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_a3ab7e8aab064fe0b251afee58cf7357~mv2.png)

![](https://static.wixstatic.com/media/9456da_58bba5f5b85140b8b1de2af86f8b8d2c~mv2.png/v1/fill/w_51,h_72,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_58bba5f5b85140b8b1de2af86f8b8d2c~mv2.png)

En la lista de tablas que aparece en la zona de la izquierda, haz scroll hasta la tablaCuentasy en su menú contextual seleccionaEditar barra de comandos (vista previa).

Esto abrirá una nueva ventana de navegador que nos va a preguntar que barra de comandos queremos editar. Como ves hay varias opciones que elegir y te invito a que jueges un poco para investigar.

Nosotros vamos a editar la barra de comandos de la vista o cuadricula principal por lo que selecciona la opciónCuadrícula principal.

![](https://static.wixstatic.com/media/9456da_353040dcfdb44cec8c366952aded86da~mv2.png/v1/fill/w_47,h_29,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_353040dcfdb44cec8c366952aded86da~mv2.png)

Si eres un tantooldiecomo yo, por decirlo finamente, te lanzo una pregunta:

A mi la verdad que sí. Si has seguido los pasos estarás viendo una pantalla parecida a la que se puede ver a continuación con todos los comandos disponibles de la tablaCuentas.

![](https://static.wixstatic.com/media/9456da_a75be7b1ed01430189393bcc176115eb~mv2.png/v1/fill/w_49,h_12,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_a75be7b1ed01430189393bcc176115eb~mv2.png)

![](https://static.wixstatic.com/media/9456da_74408d607e3b4e95822b85073ad4490e~mv2.png/v1/fill/w_59,h_100,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_74408d607e3b4e95822b85073ad4490e~mv2.png)

Haz clic en la opciónNuevo Comandoy como pordrás suponer lo que va a ocurrir es que se va a añadir un nuevo comando. Juega con las opcionesSubiryBajarpara colocar el nuevo botón donde consideres. Escribe un nombre descriptivo para el nuevo comando en el campoEtiquetay establece un icono para el comando. Yo he elegido el icono de cajaClone.

Lo siguiente que vamos a hacer es establecer una mínima lógica para mostrar u ocultar el botón en función de una determinada casuística. ¿Qué casuística? Que sólo se muestre cuando el total de los registros seleccionados en la cuadricula principal sea igual a uno. Para ello haz scroll hasta abajo en las opciones del nuevo comando y en el desplegableVisibilidadseleccionaMostrar en condiciones de fórmula. A continuación haz clic enAbrir la barra de fórmulasy escribe lo siguiente:

```powerapps
CountRows(Self.Selected.AllItems)=1
```

Sencillo ¿no?. Vamos con lo importante: clonar el registro. Justo encima de la opciónVisibilidadverás que hay una opción que se llamaAcción. En el desplegable seleccionaEjecutar fórmulay vuelve a hacer clic enAbrir barra de fórmulas.

Vamos a utilizar la funciónPatchexactamente igual que la utilizamos en las aplicacionesCanvascuando queremos trabajar con registros enDataversesin utilizar los formularios de creación integrados. Para ello escribe lo siguiente en la barra de fórmulas:

```powerapps
Patch(
    Cuentas; 
    Defaults(Cuentas);
    {
        'Nombre de cuenta': "Copia de " & Self.Selected.Item.'Nombre de cuenta';
        'Correo electrónico':If(IsBlank(Self.Selected.Item.'Correo electrónico');Blank();Self.Selected.Item.'Correo electrónico')
    }
);;
Notify("Una copia de la cuenta seleccionada: '" & Self.Selected.Item.'Nombre de cuenta' & "' ha sido creada. Por favor abre la nueva cuenta y actualiza los campos necesarios.")
```

Fíjate que además de crear el registro estamos lanzando unanotificaciónal usuario que es una nueva funcionalidad también.

Por último seleccionaGuardar y Publicary prueba tu nuevo botón en la cuadrícula principalCuentas.

![](https://static.wixstatic.com/media/9456da_4f797e51a56c49bab54f053b63e7c40c~mv2.png/v1/fill/w_49,h_10,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_4f797e51a56c49bab54f053b63e7c40c~mv2.png)

Lógicamente lo que hemos visto aquí ha sido unachorraday esto se puede complicar todo lo que queramos. Por ejemplo si necesitas clonar un registro y todos sus registros hijos puedes utilizar la funciónForAllpara clonar tambien estos registros. La fórmula podría tener un aspecto como el siguiente:

```powerapps
Set(ClonedAccount,
    Patch(Cuentas; 
          Defaults(Cuentas);
          {
                'Nombre de cuenta': "Copia de " & Self.Selected.Item.'Nombre de cuenta';
                'Correo electrónico':If(IsBlank(Self.Selected.Item.'Correo electrónico');Blank();Self.Selected.Item.'Correo electrónico')
          }
         )
   );;
ForAll(
      Self.Selected.Item.Casos;
      Patch(
            Casos;
            Defaults(Casos);
            {
                  'Título de caso': "Copia de" & 'Título de caso';
                  'Cliente:':ClonedAccount 
            }
           )
      );;
Notify("Product " & Self.Selected.Item.Name & " and its assets have been cloned. Please open the records and update the necessary fields.")
```

Espero que lo que has leido hasta aquí haya servido de ayuda. ¡Hasta la próxima!

Etiquetas:

* Power Apps
* Power Fx
* Power Apps
