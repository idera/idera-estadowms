<!DOCTYPE html>
<html lang="es">
<html>
    <head>
		<meta charset="utf-8">
        <title>Estado de los servidores WMS de IDERA</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" type="text/css"/>
		<link rel="stylesheet" href="http://ckrack.github.io/fbootstrapp/bootstrap.css" type="text/css"/>
		<link rel="stylesheet" href="bootstrap/css/bootstrap-responsive.min.css" type="text/css"/>
    	
    	<script src="OpenLayers.js"></script>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	    <!--script src="servidores.js"></script-->
	    <?php
	    	if ($_GET['url']) {
	    		echo '<script type="text/javascript"> var sources = {"custom":{"url":"'. $_GET['url'] .'","title":"Particular ","ptype":"gxp_wmssource"}} </script>';
	    	} else {
	    		echo '<script type="text/javascript" src="/mapa/sources.php?format=wms"></script>';
	    	}
	    ?>

	    <script src="URI.min.js"></script>        
	    <script src="estadowms.js"></script>        
		
		<style type="text/css">
			body {
				margin-top:38px;
			}
		section > .page-header, section > .lead {
			color: #5A5A5A;
		}

		.ok {
			background-color:#DFF0D8 !important;
			color:#468847;
		}

		.warning {
			background-color:#FCF8E3 !important;
			color:#C09853;
		}

		.fail {
			background-color:#F2DEDE !important;
			color:#B94A48;
		}

		.ref {
			height:10px;
			padding: 0px 10px;
			display:inline;
			border:1px solid #DDD;
		}

		#rows td {
			max-width:20px;
			word-wrap:break-word;
		}
		
		.footer {
			padding: 70px 0;
			margin-top: 70px;
			border-top: 1px solid #E5E5E5;
			background-color: whiteSmoke;
		}

		.footer p {
			margin-bottom: 0;
			color: #777;
		}
		</style>

    </head>
    <body data-spy="scroll" data-target=".bs-docs-sidebar" onload="idera.estadowms.init();">
		<div class="topbar" data-scrollspy="scrollspy">
		    <div class="topbar-inner">
		        <div class="container-fluid">
		          <a class="brand" href="#">IDERA // Servicios WMS </a>
		          <ul class="nav" >
		            <li class="active"><a href="#estado">Estado de los servidores</a></li>
		            <li><a href="#formatos">Formatos</a></li>
		            <li><a href="#recomendaciones">Recomendaciones</a></li>
								<li class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Capas publicadas en IDERA</a>
                  <ul class="dropdown-menu" id="menucapas">
                  </ul>
                </li>		            
		          </ul>
		        </div>
		    </div>
		</div>    	

        <div class="container-fluid">
        	<div class="hero-unit" style="background-color:white; padding: 30px">
        		<img src="logo_idera.gif"/>
        		<p class="lead">En este panel se puede ver en tiempo real el estado de normalización de los servicios WMS.</p>
        	</div>

        	<form action="index.php" target="_blank" method = "get">
				<input style="width:50%" name="url" id="urlmia" type="text">
				<input type="submit" value="Verificar WMS">
        	</form>
					
					<section class="active item" 
					id="estado">
						<div >
						<p>
						<h4>Referencia</h4>
						<div class="ref ok">&nbsp;</div> Estado óptimo para la interoperabilidad.<br/>
						<div class="ref warning">&nbsp;</div> Existen algunas observaciones al estado actual del servidor.<br/>
						<div class="ref fail">&nbsp;</div> Existen algunas observaciones de caracter crítico al estado actual.
						</p>
						</div>
						<div class="page-header">
							<h2>Atributos de los servidores WMS</h2>
						</div>
						<table  class="table  table-bordered table-condensed">
							<thead>
								<tr >
									<th>Organismo</th>
									<th>Atributo WMS Title</th>
									<th>Atributo WMS Abstract</th>
									<th>Información de contacto</th>
									<th>Puerto 80 ?</th>
									<th>Atributo href (URL del servicio)</th>
									<th></th>
								</tr>
							</thead>
							<tbody id="estadoAtributos">
							</tbody>
						</table>
					</section>
					<section class="item" id="formatos">
						<div class="page-header">
							<h2>Formatos soportados por los servicios WMS</h2>
						</div>
						<table id="tablaFormatos" class="table  table-bordered table-condensed">
							<thead>
								<tr>
									<th>Organismo</th>
									<th>Soporte de Sistemas de Referencia Espacial</th>
									<th>Soporte a formatos de respuesta GetFeatureInfo</th>
									<th>Soporta formatos de Imagen</th>
									<th>Soporte a formatos de excepciones (errores)</th>
								</tr>
							</thead>
							<tbody id="estadoSoporteDeFormatos">
							</tbody>
						</table>
					</section>
					<section class="item" id="recomendaciones">
						<div class="page-header">
							<h1>Recomendaciones para normalizar los servidores WMS</h1>
						</div>
						<h2>Acerca de los atributos WMS del Servidor</h2>

						<h3>Atributo Title</h3>
						<p>
						Se recomienda completar este atributo con el objeto de que su contenido sea descriptivo para quien
						esté viendo el listado de servicios WMS en el visualizador de IDERA.
						</p>

						<h3>Atributo Abstract</h3>
						<p>
						Se recomienda completar este atributo ya que describe los datos provistos por el servicios WMS.
						</p>

						<h3>Atributo href (o URL de Recurso Online)</h3>
						<p>
						Se recomienda completar este atributo con la URL del servidor según lo especifica OGC.
						La mínima URL (o prefijo de URL) a la cual se le agregan parámetros adicionales para poder
						construir una operación WMS válida.
						</p>
						<p>
						Un prefijo de URL se define como una cadena de texto
						que incluye protocolo, nombre del host, número de puerto (opcional), path, un signo de pregunta
						(<code>?</code>), y opcionalmente, uno o más parámetros específicos para cada servidor utilizando como separador
						un ampersand (<code>&amp;</code>). De esta manera, un cliente WMS agrega los parámetros necesarios
						para un pedido WMS como pares de nombre/valor en la forma <code>name=value&</code>. La URL
						resultante <strong>deberá</strong> ser válida de acuerdo al estándar de HTTP CGI, que demanda
						la presencia de un <code>?</code> antes de la secuencia de parámetros del pedido y el <code>&amp;</code>
						entre cada parámetro.
						</p>

						<h2>Acerca del puerto 80 del Servidor</h2>

						<p>
						Es recomendable que el servicio WMS esté accesible a través del puerto 80 (el puerto estándar para la web). El 
						habilitar este puerto permite que los usuarios que deseen consultar los servicios WMS no se vean imposibilitados por algún
						proxy/firewall. Son muy comunes los proxies institucionales que sólo permiten a los usuarios de la red local,
						el acceso a sitios o páginas en el puerto estándar de la web.
						</p>

						<h2>Acerca de los atributos WMS de las capas</h2>

						<h3>Atributo Title</h3>
						<p>
						Se recomienda completar este atributo a fin de que este texto sea descriptivo de los datos que la capa contiene.
						En general, el software de servidor suele completar automáticamente este atributo con el mismo valor del atributo name.
						<strong>Se recomienda que estos dos valores difieran ya que el atributo name se utiliza como identificador único y el title
						como descripción del identificador.</strong>
						</p>

						<h3>Atributo Abstract</h3>
						<p>
						Se recomienda completar este atributo a fin de que describa los datos y tipos de datos contenidos en la capa.
						</p>

						<h3>Atributo Keywords (Palabras clave)</h3>
						<p>
						Este campo no sólo permite palabras individuales. Sino que cada keyword puede ser un término compuesto como por ejemplo <em>Aguas interiores</em>.
						Se recomienda aprovechar este atributo para que contenga entre las keywords, por lo menos uno de los <em>temas</em> definidos por el perfil de metadatos de IDERA (Ver documento “Perfíl de Metadatos” en este mismo portal, en la página del grupo Metadatos).
						Estos <em>temas</em> son <strong>Agricultura</strong>, <strong>Biota</strong>, <strong>Límites</strong>, <strong>Clima</strong>, <strong>Economía</strong>, <strong>Elevación</strong>, <strong>Medio ambiente</strong>, <strong>Información geocientífica</strong>, <strong>Salud</strong>, <strong>Coberturas Básicas</strong>, <strong>Inteligencia / Militar</strong>, <strong>Aguas interiores</strong>, <strong>Ubicación</strong>, <strong>Océanos</strong>, <strong>Planificación de catastro</strong>, <strong>Sociedad</strong>, <strong>Estructura</strong>, <strong>Transporte</strong>, <strong>Utilidades / Comunicaciones</strong>.<br/>
						Se recomienda el comienzo de cada tema con la primer letra en mayúscula tal cual las define el perfil de metadatos.
						</p>

						<h3>Atributo Link a metadatos</h3>
						<p>
						Se recomienda que en este campo se introduzca el link a un servicio de metadatos, conforme a OGC, que contenga los metadatos para el set
						de datos contenidos en esta capa.
						</p>


						<h2>Acerca de los Sistemas de Referencia Espacial</h2>

						<h3>EPSG:4326</h3>
						<p>
						Este código es el utilizado y reconocido por EPSG para representar datos geoespaciales
						basado en un datum (elipsoide y marco de referencia) <a target="_blank" href="http://es.wikipedia.org/wiki/WGS84">WGS84</a> . En este sistema, las coordenadas de un objeto en una imagen en sus ejes X e Y se corresponden
						con los valores de las coordenadas longitud y latitud de los objetos geográficos, respectivamente.
						</p>
						<h3>EPSG:3857</h3>
						<p>
						Este código es el utilizado y reconocido por EPSG para representar el sistema de referencia espacial utilizado por Google Maps,
						Bing Maps, Yahoo Maps, OpenStreetMap, ESRI Web Maps  y demás mapas web populares. 
						Utiliza una proyección de Mercator y se vale de una esfera auxiliiar cuyo datum es igual al definido por el WGS84 (o ITRF05).
						<br/>
						<div class="alert alert-info">Soportar este Sistema de Referencia espacial ofrece alta compatilibidad con servicios de mapas a nivel internacional debido
						a su uso tan común</div>
						</p>

						<h3>EPSG:900913</h3>
						<p>
						Este código es el que utilizaba una gran cantidad de software geoespacial (OpenLayers, MapServer, GeoServer, etc) utilizaban
						para representar el sistema de referencia espacial
						de Google Maps, Bing Maps, Yahoo Maps, OpenStreetMap, ESRI Web Maps
						y demás mapas web populares hasta que EPSG la reconoció entre sus datos y le asignó el código
						<strong>EPSG:3857</strong> para definirla.
						<div class="alert alert-info">Soportar este Sistema de Referencia espacial ofrece alta compatilibidad con servicios de mapas a nivel internacional debido
						a su uso tan difundido</div>
						<p>

						<h3>Gauss / POSGAR 94</h3>
						<p>
						Esta denominación hace referencia a la proyección Gauss utilizando el marco de referencia POSGAR 94,
						que corresponde a los códigos EPSG: 22181, 22182, 22183, 22184, 22185, 22186 y 22187 
						para las fajas 1 a 7 respectivamente, a fin de representar el territorio nacional en sus correctas proporciones.
						<p>

						<div class="alert alert-error">Soportar este Sistema de Referencia espacial nos permite proyectar todos los datos de la IDE
						de manera en que se pueda cumplir con la <a target="_blank" href="http://www.ign.gob.ar/AreaInstitucional/Normativa/Leyes/LeyBicontinental">ley 26.651</a>
						de <em>Obligatoriedad del uso del Mapa Bicontinental de la República Argentina</em>,  ofreciendo en escalas grandes, el territorio argentino representado en sus correctas proporciones.</div>
						</p>

						<h2>Acerca de los Formatos soportados para GetFeatureInfo</h2>

						<h3>text/html</h3>
						<p>
						Este formato es el aprovechado por el visualizador de IDERA. Y permite representar una consulta puntual
						acerca de un objeto geográfico sobre el globito que se despliega al hacer click sobre el mapa.
						</p>						

						<h3>GML 2</h3>
						<p>
						Este formato es un derivado de XML que soporta campos específicamente geoespaciales. Se utiliza a fines
						de consultas programáticas por parte de un software cuya tarea no es necesariamente representar el resultado
						para ser visto de manera gráfica aunque sí procesable por otro sistema.
						</p>						

						<h2>Acerca de los Formatos soportados para las imágenes GetMap</h2>

						<h3>image/jpeg</h3>
						<p>
						El formato JPEG de imágenes es el formato más común utilizado para las capas de los servidores WMS.
						Este formato no permite representar transparencias y por su alta compresión <strong>con pérdidas</strong>
						es generalmente utilizado para datos que no tengan origen vectorial. JPEG utiliza 24 bits para representar
						el color de cada píxel y define <strong>compresión con pérdidas regulable</strong> a la hora de almacenar la información
						de la imagen.
						</p>

						<h3>image/png</h3>
						<p>
						El formato PNG de imágenes permite representar transparencias y es el comúnmente utilizado
						para las capas superpuestas sobre una capa base. Este formato utiliza 24 bits para representar
						el color de cada pixel y define <strong>compresión sin pérdidas</strong> a la hora de almacenar la información
						de la imagen.
						</p>

						<h3>image/png8</h3>
						<p>
						Esta variación del formato permite archivos PNG de menor tamaño (en términos de bytes) ya que
						en lugar de usar 24 bits para representar el color de cada pixel, utiliza sólo 8 para representar
						el color de cada pixel con una paleta de colores no estándar que está guardada en el mismo
						archivo de imagen.
						</p>
						<p>
						Esta paleta es generada por el servidor al momento de generar la imagen
						y sólo hace referencia a los colores que sí están siendo usados en la imagen y no a todos los colores
						posibles del mundo real. Esto deviene en imágenes iguales a las logradas con PNG (salvo raras excepciones)
						pero con un tamaño muy inferior al logrado por el formato PNG de 24 bits.
						</p>

						<h2>Acerca de los Formatos soportados para las excepciones</h2>

						<h3>application/vnd.ogc.se_inimage</h3>
						<p>
						Se recomienda que el formato de excepción sea <code>application/vnd.ogc.se_inimage</code>. Es decir un 
						mensaje descriptivo del error devuelto en formato de imagen y no de texto.
						</p>
					</section>

					<section class="item" id="capas" >
						<div class="page-header">
							<h1>Capas publicadas en los servidores WMS de IDERA</h1>
						</div>

						<table  class="table table-bordered table-condensed">
							<thead>
								<tr >
									<th>Atributo WMS Title</th>
									<th>Atributo WMS Name</th>
									<th>Atributo WMS Abstract</th>
									<th>Palabras clave WMS</th>
									<th>Link a metadatos</th>
									<th>Estilos</th>
								</tr>
							</thead>
							<tbody id="rows">
							</tbody>
						</table>
					</section>

		</div> <!--container-->
		<footer class="footer">
			<div class="container" style="width:80%">
				<p>
				Desarrollado por <img style="height:100px" src="logo.png" /> 
				</p>
			</div>
		</footer>
	<script src="bootstrap/js/bootstrap.min.js"></script>        
	<script type="text/javascript">
	
	$('.bs-docs-sidenav').affix({
      offset: {
        top: function () { return $(window).width() <= 980 ? 290 : 210 }
      , bottom: 270
      }
    })
	</script>
    </body>
</html>
