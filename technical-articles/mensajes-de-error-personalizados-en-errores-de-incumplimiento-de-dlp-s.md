# Mensajes de error personalizados en errores de incumplimiento de DLP´s

![](https://static.wixstatic.com/media/9456da_e201e2202c764b52a19ec985eb000869~mv2.png/v1/fill/w_49,h_9,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_e201e2202c764b52a19ec985eb000869~mv2.png)

¿Sabías que puedes personalizar los mensajes de error que aparecen a los usuarios cuando implementan o desarrollan algún componente que utiliza un conector restringido bajo una política de prevención de pérdida de datos enMicrosoft Power Platform?

Cuando se da el caso que comento arriba, los mensajes que reciben según qué usuarios pueden resultar algo confusos. Hay que tener en cuenta que uncitizen developeren rara ocasión va a saber qué es unaDLP. Y sin embargo, cuando uno de estos usuarios quiere implementar algún componente que utiliza un conector restringido, puede ser una muy buena oportunidad para hacerle conocedor y partícipe del modelo de gobierno presente en su organización. Vamos a ver cómo podemos conseguir esto.

A día de hoy, esta customización o personalización del mensaje de error que aparece en la imagen inicial, sólo se puede realizar a traves dePowerShell. Si no lo tienes instalado, ¿a qué estas esperando 😜?. Instala también los módulos necesarios para poder trabajar conPower Platform, ejecutando los siguientes comandos:

```powerapps
Install-Module -Name Microsoft.PowerApps.Administration.PowerShell
Install-Module -Name Microsoft.PowerApps.PowerShell -AllowClobber
```

Una vez hecho esto, lo único que necesitas hacer es ejecutar el siguiente script:

```powerapps
New-PowerAppDlpErrorSettings -TenantId 'TenantId' -ErrorSettings @{  
  ErrorMessageDetails = @{ 
    enabled = $True  
    url = "URL REDIRECCIÓN" 
  } 
  ContactDetails= @{  
    enabled = $True 
    email = "MAIL DE CONTACTO" 
  } 
}
```

En mi caso, comourl de redirecciónvoy a utilizar el sitio deSharepointcreado como canal de divulgación de las políticas de  administración y gobierno deMicrosoft Power Platformque han sido definidas por el Centro de Excelencia en una organización. El resultado de la ejecución de este script es el que puedes ver en la siguiente imagen:

![](https://static.wixstatic.com/media/9456da_02c4601702ba49c381c146a53e989e99~mv2.png/v1/fill/w_49,h_12,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_02c4601702ba49c381c146a53e989e99~mv2.png)

No hay que hacer nada mas 😊. Fíjate que si ahora intentas activar o editar un flujo de automatización que incumpla alguna políticaDLP, lo que se le va a mostrar al usuario es un mensaje parecido al de la imagen.

![](https://static.wixstatic.com/media/9456da_dd7746ee41d84e54aad54b38c133ad48~mv2.png/v1/fill/w_49,h_9,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_dd7746ee41d84e54aad54b38c133ad48~mv2.png)

Una muy buena oportunidad para que una vez el usuario haga clic en el enlace del mensaje, sea conocedor de algo tan importante como las políticas de gobierno, procesos internos, metodología de uso de la plataforma, best practices, etc que se han definido en su organización. ¿No crees?

![](https://static.wixstatic.com/media/9456da_3f17f371ca7b4475817e5d214d5d450f~mv2.png/v1/fill/w_49,h_24,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_3f17f371ca7b4475817e5d214d5d450f~mv2.png)

¡Gracias por tu tiempo! ¡Nos vemos en la siguiente!

Etiquetas:

* Power Apps
* Power Automate
* Dataverse
* PowerShell
* Dataverse
* Power Apps
* Power Automate
