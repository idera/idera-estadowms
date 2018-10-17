# IDERA – Estado WMS

Aplicación que revisa e informa el **estado** y cumplimiento de **estándares** **IDERA** de un servicio **WMS**.

# Funcionamiento

La revisión estado consta de dos partes:

 - Revisión del funcionamiento del geoserver: controla que el geoserver responda ante peticiones; o sea, que esté activo y sea accesible.
 - Revisión del estado de WMS: controla que el servicio WMS esté devolviendo un XML válido y que contenga datos.

El cuanto al cumplimiento de estándares, las revisiones son:

 - Análisis global del WMS:
	 - Atributos de los servidores WMS: muestra por pantalla Organismo, Atributo WMS Title, Atributo WMS Abstract, Información de contacto, Puerto, Atributo href (URL del servicio) e indica con colores si cumple completamente, medianamente o no cumple con estándares IDERA (verde, amarillo o rojo).
	 - Formatos soportados por los servicios WMS: muestra por pantalla Organismo, Soporte de Sistemas de Referencia Espacial, Soporte a formatos de respuesta GetFeatureInfo, Soporta formatos de imágenes, Soporte a formatos de excepciones (errores) e indica con colores si cumple completamente, medianamente o no cumple con estándares IDERA (verde, amarillo o rojo).
 - Análisis de capas publicadas en los servidores WMS:
	 - Muestra por pantalla los datos Atributo WMS Title, Atributo WMS Name, Atributo WMS Abstract, Palabras clave WMS, Link a metadatos, Estilos e indica con colores si cumple completamente, medianamente o no cumple con estándares IDERA (verde, amarillo o rojo).

## Uso

La aplicación puede ejecutarse de manera desatendida (toma los datos de los servidores WMS desde el recurso /mapa/sources.php?format=wms, el mismo se encuentra en https://github.com/idera/geoservicios) o de manera manual.

Si se desea utilizar de manera manual, el script index.php recibe por GET los siguientes parámetros:

 - url: indica la url completa del servidor WMS a ser revisado

Internamente el script index.php genera una variable javascript llamada **sources** cuyo contenido es un json con el siguiente formato:

    var sources = {"custom":{"url":"<URL_OBTENIDA_POR_GET>","title":"Particular ","ptype":"gxp_wmssource"}}

La lógica contenida en el archivo **estadowms.js** espera que exista la variable **sources** para funcionar.

## Ejemplo

Como ejemplo de uso de la aplicación para la revisión de un servidor WMS es:

    <url_de_instalación_de_la_aplicación>/index.php?url=https%3A%2F%2Fidecor-ws.cba.gov.ar%2Fgeoserver%2Fidecor%2Fwms%3F

Como ejemplo de consulta real en el servidor web oficial de IDERA es:

    http://servicios.idera.gob.ar/idera-estadowms/index.php?url=https%3A%2F%2Fidecor-ws.cba.gov.ar%2Fgeoserver%2Fidecor%2Fwms%3F

## TODO

 - Revisar que se realicen todas las validaciones correspondientes y se condigan con los estándares actuales de IDERA ([issue #4](https://github.com/idera/idera-estadowms/issues/4)).
 - Generar una fuente de datos normalizada para la obtención de los datos WMS de todos los nodos IDERA y que esta sea utilizada como única fuente de consulta de los servicios disponibles para todas las aplicaciones ([issue #5](https://github.com/idera/idera-estadowms/issues/5)).
 - Desarrollar la funcionalidad de ejecución desatendida para realizar una revisión periódica de todos los nodos IDERA (por ejemplo, mediante cron) y exponer resultados en el sitio web oficial ([issue #6](https://github.com/idera/idera-estadowms/issues/6)).
 - Separar la presentación de la lógica de negocio. Ver la posibilidad de separar la lógica en una API y que la parte visual la consuma ([issue #3](https://github.com/idera/idera-estadowms/issues/3)).
