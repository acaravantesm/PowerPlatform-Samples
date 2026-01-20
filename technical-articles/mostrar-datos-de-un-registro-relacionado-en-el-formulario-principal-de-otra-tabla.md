# Mostrar datos de un registro relacionado en el formulario principal  de otra tabla

![](https://static.wixstatic.com/media/9456da_9cd704c346e54d799448ff4de078fd2c~mv2.png/v1/fill/w_49,h_8,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_9cd704c346e54d799448ff4de078fd2c~mv2.png)

Este post va a servir de inauguración a la serie Back To Basics, donde intentaré describir y ayudar con la difusión de funcionalidades muy muy simples, básicas y sencillas, a las que quizás por ese motivo no siempre se le da la relevancia que podrían tener.

Para los que venimos del mundoDynamics, lo que cuento en esta entrada no es nada nuevo. Pero para todos aquellos que hayan entrado directamente al mundo dePower Platformpuede darse el caso en que no conozcan una determinada característica que en los desarrollos deDynamicssonel pan nuestro de cada día.

Imagina que tienes una tabla relacionada con otra tabla. Imagina que necesitas modificar datos del registro relacionado pero no quieres estar navegando entre formularios: accediendo primero al fomulario principal del registropadre, haciendo clic en el registrolookup, aterrizando en el formulario de detalle del registro relacionado, modificando lo que necesites modificar y volviendo al formulario de detalle del registro principal. Si te fijas, esas son las operaciones que alguien que no conozca todas las bondades de la plataforma necesita realizar para modificar datos de un registro secundario.

Es aquí donde viene a salvarnos el componenteForm Component Control,que no es más que un componente estándar que nos va a permitir evitar todos los pasos que comentaba en el párrafo anterior, incrustando un formulario "secundario" en el formulario principal del registro padre y de esta forma poder modificar datos del registro relacionado sin tener que navegar entre múltiples ventanas.

Vamos a probar con las tablas que nunca se suelen usar para pruebas:CuentayContacto😜. Como todos sabemos una cuenta puede tener un contacto principal, por lo que vamos a mostrar los datos de este contacto en el formulario principal de cuenta.

Crea un nuevo formulario deContactocon los campos que quieras incluir. El mio tiene el siguiente aspecto:

![](https://static.wixstatic.com/media/9456da_0036ee7c79724826a04ddd86f6c4e9d7~mv2.png/v1/fill/w_49,h_27,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_0036ee7c79724826a04ddd86f6c4e9d7~mv2.png)

Quédate con el identificador único de este formulario, que lo puedes encontrar en la barra del navegador:

```powerapps
https://make.powerapps.com/e/c9db95f8-91f1-40b3-8d7d-a12f010d9342/s/10cc9b1d-fe07-ed11-82e5-6045bd8b97a1/entity/contact/form/edit/f9e75461-0008-ed11-82e5-6045bd8b97a1?source=powerappsportal
```

![](https://static.wixstatic.com/media/9456da_cbe87e1435cb416f8823cde394bfec32~mv2.png/v1/fill/w_78,h_87,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_cbe87e1435cb416f8823cde394bfec32~mv2.png)

Vámonos ahora con el formulario principal de la tablaCuenta. Ya te aviso que ahora mismo sólo puedes hacer esta configuración desde elModo Clásicopor lo que abre la edición del formulario en ese modo. Añade ellookupde Contacto Principal y haz doble clic sobre el control.

Se abrirán las propiedades del control y en la pestañaControlspodrás añadir el componente con nombreForm Component Control. Actívalo para la versión Web como mínimo.

Fíjate en la parte inferior donde podemos configurar este componente. Observa que donde indicaLookup Valuese ha establecido el campo que relaciona ambas tablas. Sólo nos falta una última configuración donde debemos indicar el formulario que queremos mostrar.

Para ello haz clic en el icono del lápiz y en el campo habilitado que muestraBind To Static Value, debes introducir lo siguiente:

```powerapps
<QuickForms><QuickFormIds><QuickFormId entityname="contact">f9e75461-0008-ed11-82e5-6045bd8b97a1</QuickFormId></QuickFormIds></QuickForms>
```

Lógicamente debes indicar el nombre de la entidad secundaria con la que estés trabajando y el identificador único del formulario que has creado en el primer paso.

Cuando hayas finalizado la configuración, debería mostrarse algo parecido a lo que ves en la siguiente imagen:

![](https://static.wixstatic.com/media/9456da_c59f111e6bb641109ec7bcd8681e9fac~mv2.png/v1/fill/w_75,h_85,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_c59f111e6bb641109ec7bcd8681e9fac~mv2.png)

¡Ya está! Muy muy sencillo, ¿no crees?. Guarda los cambios, publica la solución y... ¡voilá!

![](https://static.wixstatic.com/media/9456da_4bb7f9162411476ebf775d3f9cd8a092~mv2.png/v1/fill/w_49,h_22,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_4bb7f9162411476ebf775d3f9cd8a092~mv2.png)

¡Gracias haber llegado al final! ¡Nos vemos en la próxima!

Etiquetas:

* Power Apps
* Dataverse
* Back2Basics
* Dataverse
* Power Apps
* Back2Basics
