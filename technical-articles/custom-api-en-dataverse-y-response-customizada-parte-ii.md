# Custom API en Dataverse y response customizada (Parte II)

![](./assets/capi/9456da_5c03e23782874e52b0858c418c0e452b~mv2.avif)

Esta es la segunda parte hablando sobre las Custom API que ofreceDataverse. De dónde venimos lo puedes consultar aquí.

El post de hoy va a ser un poco mas breve ya que la parte mas extensa se nos va en la configuración de nuestra Custom API. Hoy sólo vamos a cambiar los parámetros de entrada y salida y por supuesto el código que ejecuta la API.

¿Qué pasa si no queremos devolver toda la información del registro en el response de la API? ¿Qué pasa si queremos jugar con el cuerpo de la respuesta a nuestro antojo sin necesidad de crear una nueva tabla enDataverse? Hoy vamos a ver comoinventarnosal en tiempo de ejecución la respuesta que devuelve nuestra API.

Siguiendo con el ejemplo anterior, supongamos que tenemos una tabla que almacenaentornosy cada entorno tiene una lista deaplicacionesasociadas. Por otro lado tenemos una tabla que registraorganizacionesque a su vez tienen desde uno hasta nentornos. Dicho de otra forma:1 Organización --> N Entornosy1 Entorno --> N Aplicaciones.

Nuestra Custom APIva a ser capaz de devolver un objeto Organización con una lista anidada deentornosque a su vez tienen una lista anidada deaplicaciones. Tanto la definición del objetoOrganizacióncomo la definición de las listas, la vamso a hacer al vuelo. Es decir no hay ninguna tabla de Dataverse de por medio que defina la estructura de la response que vamos a devolver como hacíamos en la Parte I.

No nos vamos a entrener en cómo dar de alta la propia API ni los parámetros de entrada ya que eso lo vimos en el post anterior. Vamos a partir de unaCustom APIya definida que he llamado GetOrganization, que recibe un parámetro de entrada de tipostringal que he llamado OrgName. Donde si nos vamos a detener es en el parámetro de salida que es aquí donde empieza la magia.

Crea un nuevo parámetro de salida asociado a tu Custom API y en el campo tipo establece el valor EntityCollection.

Vámonos al código. Abre el proyecto que creamos en el post anterior y en la clase APIController.cs crea un nueva condición que se ejecute cuando el mensaje entrante sea el de tu API customizada. El resto lo puedes consultar en la siguiente porción de código. Como ves la magia ocurrecuando creamos objetos de tipo Entity.

![](https://gist.github.com/acmbpp/fbf8f027294fe4f094bef51d658c0d27.js)

Lo importante del fragmento de código es como construimos los objetos Entity. Este código no es un código válido para ser ejecutado en escenarios reales por que puede ocasionar problemas de rendimiento. Si me gustaría aprovechar esta ocasión para destacar que dependiendo en qué escenarios, puede ser mucho más interesante cargar los registros con los que vamos a trabajar al principio y luego utilizar LINQ para obtener los que nos interesen, que estar lanzando RetrieveMultiple dentro de un ForEach. Es de cajón, pero por desgracia esta tontería ocasiona muchos problemas en entornos productivos.

Si esto lo ejecutamos en Postman obtenemos una response totalmente customizada a nuestro gusto. Algo parecido a esto:

![](https://gist.github.com/acmbpp/0fce0096c4aa0995c73f2b30496d7188.js)

¡¡Espero que este post haya sido de utilidad!!