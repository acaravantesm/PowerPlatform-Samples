# Obtener componentes Power Platform de todo el tenant con PowerShell

![](./assets/pws/9456da_f7fe7d46f8a74cdcbfeb1b273efaa271~mv2.avif)

Algo muy rápido en esta ocasión y no tan extenso como los otros post.

Si en alguna ocasión necesitas tener una foto clara de cuántos y qué componentes hay desplegados en un tenant y no tienes tiempo para crear flujos conPower Automateni quieres ir entorno por entorno viendo los datos de análisis y telemetría, te invito a que ejecutes unos sencillos scripts dePowerShellque con cuatro (literal) líneas de código nos dan mucha información.

Lo primero que necesitas hacer si no has usado aun los comandos dePowerShellpara la administración dePower Platformes instalar los módulos necesarios. Para ello abre una consola dePowerShelly ejecuta lo siguiente:

```powerapps
Install-Module -Name Microsoft.PowerApps.Administration.PowerShell
Install-Module -Name Microsoft.PowerApps.PowerShell -AllowClobber
```

Cuando los módulos se instalen ya estará casi todo listo para que empieze elrock. Lo primero que debemos hacer es logarnos enPower Platformcon un usuario con rol deadministradorejecutando el comando:

```powerapps
Add-PowerAppsAccount
```

Si no hacemos este paso, en el momento que se ejecute el primer comando nos aparecerá una ventana emergente de login. Si por el contrario estas pensando en darle forma a unos scripts mas "serios" o que se ejecuten periódicamente igual te interesa setear las credenciales en el propio script:

```powerapps
$pass = ConvertTo-SecureString "TuContraseña" -AsPlainText -Force
Add-PowerAppsAccount -Username TuUsuario@TuOrganization.com -Password $pass
```

Cuando hayas inciado sesión, ahora si, ya está todo listo para poder empezar a ejecutar cualquier comando de los que nos brindaMicrosoft. Te dejo la documentación con todos los comandos de PowerShellaquí.

Para obtener por ejemplo una lista de todas lasPower Appsdentro de una organización podemos hacerlo de forma muy rápida con un script tan sumamente simple como este:

```powerapps
$propiedades = @{
          "NombreAplicacion" = ''
          "NombreParaMostrar" = ''
          "FechaCreacion"=''
        }

$listaPowerApps= Get-AdminPowerApp


$listaAExportar=@();
foreach ($app in $listaPowerApps)
{
    $appAExportar=New-Object -TypeName PSObject -Property $propiedades 
    $appAExportar.NombreAplicacion=$app.AppName
    $appAExportar.NombreParaMostrar=$app.DisplayName
    $appAExportar.FechaCreacion=$app.CreatedTime
 
    $listaAExportar+=$appAExportar
}
```

Si has llegado hasta aquí, te tengo una "sorpresa" preparada. Y es que a través de comandosPowerShellse pueden realizar pequeñas acciones que a día de hoyno se pueden hacer de ninguna otra formacomo por ejemplo bloquear la creación de entornos de tipoDeveloperen todo el tenant. ¿Cómo?aquíte lo explica muy bien Microsoft.

¡Nos vemos en la siguiente!
