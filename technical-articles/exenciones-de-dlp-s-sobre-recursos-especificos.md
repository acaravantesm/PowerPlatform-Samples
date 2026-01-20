# Exenciones de DLP´s sobre recursos específicos

![](https://static.wixstatic.com/media/9456da_03edeb7875e945299731e05cd4e422fe~mv2.jpg/v1/fill/w_147,h_64,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_03edeb7875e945299731e05cd4e422fe~mv2.jpg)

Si alguna vez has trabajado en algún proyecto orientado a administración y gobierno deMicrosoft Power Platform, con total seguridad te ha tocado pegarte con directivas de prevención de pérdida de datos oDLP´s.

No hay nada nuevo cuando hablamos que son directivas que agrupan los mas de 800 conectores de los que disponePower Platformhoy en día, en tres grupos:Empresariales,No EmpresarialesyBloqueados. Básicamente lo que la política nos impide es utilizar en una misma app o flujo conectores de grupos distintos o nos impide directamente utilizar conectores que están bloqueados.

Lo siguiente es configurar sobre que entornos aplica o no aplica cada políticaDLPyvoilá.

Pero... ¿qué ocurre si tenemos un entorno donde aplica una políticaDLPy donde además tenemos alguna app o flujo excepcional que necesita sí o sí por necesidades de negocio utilizar un conector bloqueado por laDLP? Pues para ayudarnos, aparecen en nuestro rescate las listas de exenciones de recursos.😎

A día de hoy, esta customización o personalización del mensaje de error que aparece en la imagen inicial, sólo se puede realizar a traves dePowerShell. Si no lo tienes instalado, ¿a qué estas esperando 😜?. Instala también los módulos necesarios para poder trabajar conPower Platform, ejecutando los siguientes comandos:

```powerapps
Install-Module -Name Microsoft.PowerApps.Administration.PowerShell
Install-Module -Name Microsoft.PowerApps.PowerShell -AllowClobber
```

Antes de ver lo que tenemos que hacer para crear una lista de exención de recursos, veamos que pasa en la actualidad cuando intentamos utilizar un conector bloqueado por unaDLPen un flujo dePower Automate. En mis entornos de prueba tengo unaDLPque tiene bloqueado el conector deDropBox. Si leíste además la entrada donde hablabamos sobrecómo personalizar los mensajes de error por incumplimiento de DLP, entenderás por que en la imagen que puedes ver a continuación obtengo el mensaje de error que aparece.

![](https://static.wixstatic.com/media/9456da_c7f91f1f31d64b31b75d1e86e130e957~mv2.png/v1/fill/w_49,h_8,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_c7f91f1f31d64b31b75d1e86e130e957~mv2.png)

Ahora sí. Imagina que este flujo es crítico para el negocio y sólo este flujo tiene que ser capaz de utilizar el conector deDropBox. Imagina también que tenemos una aplicación que utiliza el mismo conector y que tambien es crítica para el negocio.

En tal caso necesitaremos crear unaExemption Listo una lista de exención de recursos para que "escapen" de laDLPque aplica al propio entorno donde se encuentran desplegados estos dos recursos.

Para crear esa lista de exención necesitamos ejecutar el siguiente script:

```powerapps
$flow = Get-Flow -EnvironmentName #ENVIRONMENT_INTERNAL_NAME -FlowName #FLOW_INTERNAL_NAME 
$app = Get-PowerApp -EnvironmentName #ENVIRONMENT_INTERNAL_NAME -AppName #APP_INTERNAL_NAME 
$exemptFlow = [pscustomobject]@{ 
             id = $flow.Internal.id 
             type = $flow.Internal.type 
         } 
$exemptApp = [pscustomobject]@{ 
           id = $app.Internal.id 
           type = $app.Internal.type 
         } 
$exemptResources = [pscustomobject]@{ 
             exemptResources = @($exemptFlow, $exemptApp) 
         } 
New-PowerAppDlpPolicyExemptResources -TenantId #TENANT_ID -PolicyName #POLICY_INTERNAL_NAME -NewDlpPolicyExemptResources $exemptResources   
```

En mi caso el script queda como puede ves en la imagen inferior.

![](https://static.wixstatic.com/media/9456da_920dbd098abb4e0994e3e5ba89199fcd~mv2.png/v1/fill/w_49,h_12,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_920dbd098abb4e0994e3e5ba89199fcd~mv2.png)

Una vez ejecutado el script y si no ha ocurrido ningún error, dirígete de vuelta al flujo o aplicación que estaba utilizando el conector bloqueado y como podrás comprobar ya no hay ningún mensaje de error y el flujo o aplicación se ejecuta sin ningún problema. Eso si: el uso del conector bloqueado sigue estando restringido para todos los recursos de ese entorno que no formen parte de la lista de exención.

![](https://static.wixstatic.com/media/9456da_8c129256f480439bb25715966c375480~mv2.png/v1/fill/w_49,h_11,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_8c129256f480439bb25715966c375480~mv2.png)

¡Gracias por haber leído hasta aquí! ¡Hasta la próxima!