# Paginación de grandes volúmenes de datos en Power Automate

![](https://static.wixstatic.com/media/9456da_cde2281cae1f4bf3a729f71a508e1939~mv2.jpg/v1/fill/w_111,h_52,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_cde2281cae1f4bf3a729f71a508e1939~mv2.jpg)

Los que venimos del mundo de Dynamics nos hemos pegado mas de una y mas de dos veces a la hora de procesar grandes cantidades de registros de una tabla deDataverse. La plataforma presenta ciertos límites para asegurar que los recursos no se colapsen y puedan rendir de forma óptima para todos los usuarios y servicios independientemente de las operaciones que estos realicen.

En este post vamos a ver como iterar desdePower Automatelos registros de una tabla deDataversecuando los registros sobre los que tenemos que trabajar son mas de 5.000. Lo que vamos a ver hoy aquí no es la única forma de procesar grandes volúmenes de registros ya que podríamos hacerlo tambien utilizando lasPaging Cookiesde losFetchXml.

Llegados a este punto  vamos a procesar los datos utilizando la paginación propia deDataverse. Aunque también podríamos procesar los datos usando la paginación dePower Automate, activando la opciónPaginaciónen laConfiguraciónde la acción que queramos paginar. Para esta segunda opción debes tener en cuenta los propios límites dePower Automatesegún la licencia delownerdel flujo. Puedes consultar estos límitesaquí.

Como decía, hoy vamos a procesar los resultados con la paginación propia deDataverse. Vamos a partir de una tabla que almacenaAplicacionesque como puedes ver a través de una búsqueda avanzada, la plataforma nos indica que tiene más de 6.100 registros:

![](https://static.wixstatic.com/media/9456da_6d5f28816d69471ea9e861c4050a9c32~mv2.png/v1/fill/w_73,h_9,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_6d5f28816d69471ea9e861c4050a9c32~mv2.png)

![](https://static.wixstatic.com/media/9456da_0d7338db07e54d99ba64ba69591654f1~mv2.png/v1/fill/w_49,h_40,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_0d7338db07e54d99ba64ba69591654f1~mv2.png)

Por otro lado, disponemos de un flujoPower Automateque consulta esta tabla sin ningún tipo de filtro ni configuración adicional. Posteriormente a la consulta de la tabla lo único que hacemos es obtener la longitud del array de items obtenidos para chequear los registros que devuelve la consulta.

![](https://static.wixstatic.com/media/9456da_65268024d04449208e2c50debb9feed8~mv2.jpg/v1/fill/w_112,h_69,al_c,q_80,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_65268024d04449208e2c50debb9feed8~mv2.jpg)

Si ejecuto el flujo de la imagen anterior, efectivamente obtenemos los primeros 5.000 registros por lo que llegados aquí... ¿Cómo procesamos el resto de los registros?

Fácil y sencillo. Si has trabajado con la API deMicrosoft Graphestarás familiarizado también con los famososnextLinkde las respuestas que devuelve esa API. Nosotros vamos a utilizar lo mismo aunque como siempreaquíte dejo la documentación oficial. Manos a la obra.

Lo único que tenemos que hacer es obtener el valor de la propiedadnextLink (asegúrate de tener la paginación dePower Automatedesactivada o de lo contrario esta propiedad no aparecerá en elbodyde laresponse), extraer de ella el valor del parámetroskipTokeny volver a llamar aDataverseutilizando este último parámetro. Para ello vamos a hacer uso de dos variables nuevas donde almacenar esta información. Nada nuevo.

![](https://static.wixstatic.com/media/9456da_0920f3c379804f13af96316c1445695a~mv2.png/v1/fill/w_62,h_41,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_0920f3c379804f13af96316c1445695a~mv2.png)

Una vez tenemos las variables inicializadas, vamos a dar forma a un bucle que se va a ejecutar hasta que la propiedadnextLinksea nula. Dentro de ese bucle lo único que tenemos que hacer es establecer el valor deskipTokeny volver a invocar aDataversepasándole ese valor. La fórmula que estoy utilizando para extraer elskipTokentiene el siguiente aspecto:

```powerapps
decodeUriComponent(last(split(uriQuery(variables('nextLink')), 'skiptoken=')))
```

Finalmente el bucle resultante es muy sencillo:

![](https://static.wixstatic.com/media/9456da_87524273e97645fb8662cc33d0e552c0~mv2.png/v1/fill/w_64,h_79,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/9456da_87524273e97645fb8662cc33d0e552c0~mv2.png)

Lo único que nos quedaría ahora es procesar los registros obtenidos en cada lote, para lo que te recomiendo la creación de otro flujo dePower Automateque actúe comochild flowde este flujo. No olvides que la API deDataversetambién presenta sus limitaciones quenuncapuedes perder de vista y que puedes consultaraquí.

Espero que esta publicación sirva de ayuda. ¡Nos vemos en la siguiente!