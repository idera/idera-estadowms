var format;

var estados = {};

var temasPerfilMetadatos = {
	'Agricultura': true,
	'Biota': true,
	'Límites': true,
	'Clima': true,
	'Economía': true,
	'Elevación': true,
	'Medio ambiente': true,
	'Información geocientífica': true,
	'Salud': true,
	'Coberturas Básicas': true,
	'Inteligencia / Militar': true,
	'Aguas interiores': true,
	'Ubicación': true,
	'Océanos': true,
	'Planificación de catastro': true,
	'Sociedad': true,
	'Estructura': true,
	'Transporte': true,
	'Utilidades / Comunicaciones': true

};

function init()
	
{
	    
	OpenLayers.ProxyHost= function(url) {
		return "../proxy/?url=" + encodeURIComponent(url);
    };
	for (s in sources) {
		var $tr = $('<tr id="'+ s + '"></tr>');
		$tr.append('<td style="background-color:black;color:white" class="title">' + sources[s].title +'</td>');
		$tr.append('<td colspan=6 class="cargando">Cargando ... </td>');
		$('#servidores').append($tr);
	}
	for ( s in sources ) {
		estados[s]= {};
		go( s, sources[s] );

	}

}

function go( idSource, source )
{
    var format = new OpenLayers.Format.WMSCapabilities({
    	version: "1.1.1"
    });

	var xmlParser = new OpenLayers.Format.XML();
	
    OpenLayers.Request.GET({
        url: source.url,
        params: {
            SERVICE: "WMS",
            VERSION: "1.1.1",
            REQUEST: "GetCapabilities",
			timestamp: Math.round((new Date()).getTime() / 1000)
        },
        success: function(request) {
            var doc = request.responseXML;
            if (!doc || !doc.documentElement) {
                doc = request.responseText;
            }

            var capabilities = format.read(doc);  
//			console.log( xmlParser(doc, '', 'encoding') );
			if (idSource == 'ign') {
			_aa = capabilities;
			}

			if (capabilities.error) {
				var msj = 'El servidor ' + source.title + ' no devolvió el documento capabilities';
				fallo(idSource, msj);
				return;
			}
			console.log(capabilities);
            var layers = capabilities.capability.layers;

			imprimir(idSource, source, capabilities);

        }, 
        failure: function() {            
			var msj = 'El servidor ' + source.title + ' no está accesible.';
			fallo(idSource, msj);

        }
    });
	
}

function fallo(idSource, mensaje) 
{
	$('#' + idSource + ' .cargando')
	.attr('colspan', $('#ign td').length -1 )
	.addClass('fail')
	.text( mensaje );
}

function diagnosticar(idSource, source, capabilities)
{
	var capas = capabilities.capability.layers;
	var $a1 = $('#' + idSource);

	estados[idSource].wms = {};
	estados[idSource].wms.title = capabilities.service.title;
	estados[idSource].wms.nCapas = capas.length;
	estados[idSource].wms.abstract = capabilities.service.abstract;

	estados[idSource].wms.soporta = {};
	estados[idSource].wms.puerto = 80;
	estados[idSource].wms.soporta.srs = {};
	estados[idSource].wms.soporta.infoFormats = {};
	estados[idSource].wms.soporta.formats = {};
	estados[idSource].wms.soporta.srs['EPSG:900913'] = false;
	estados[idSource].wms.soporta.srs['EPSG:3857'] = false;
	estados[idSource].wms.soporta.srs['EPSG:4326'] = false;
	estados[idSource].wms.soporta.srs['EPSG:22183'] = false;
	estados[idSource].wms.soporta.infoFormats['text/html'] = false;
	estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml'] = false;
	estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml/3.1.1'] = false;
	estados[idSource].wms.soporta.formats['image/png'] = false;
	estados[idSource].wms.soporta.formats['image/png8'] = false;

	for (var i=0; i< capabilities.capability.layers.length; i++)
	{
		var  l = capabilities.capability.layers[i];
		if (l.srs['EPSG:900913'])	{
			estados[idSource].wms.soporta.srs['EPSG:900913'] = true;
		}
		if (l.srs['EPSG:3857'] )	{
			estados[idSource].wms.soporta.srs['EPSG:3857'] = true;
		}
		if (l.srs['EPSG:4326'] )	{
			estados[idSource].wms.soporta.srs['EPSG:4326'] = true;
		}
		if (l.srs['EPSG:22183'] )	{
			estados[idSource].wms.soporta.srs['EPSG:22183'] = true;
		}

		for (var j=0; j< l.infoFormats.length ; j++) {
			if ( l.infoFormats[j] == 'text/html') {
				estados[idSource].wms.soporta.infoFormats['text/html'] = true;
			}
		}

		for (var j=0; j< l.infoFormats.length ; j++) {
			if ( l.infoFormats[j] == 'application/vnd.ogc.gml') {
				estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml'] = true;
			}
		}

		for (var j=0; j< l.infoFormats.length ; j++) {
			if ( l.infoFormats[j] == 'application/vnd.ogc.gml/3.1.1') {
				estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml/3.1.1'] = true;
			}
		}

		for (var j=0; j< l.formats.length ; j++) {
			if ( l.formats[j] == 'image/png') {
				estados[idSource].wms.soporta.formats['image/png'] = true;
				}
		}

		for (var j=0; j< l.formats.length ; j++) {
			if ( l.formats[j] == 'image/png8') {
				estados[idSource].wms.soporta.formats['image/png8'] = true;
				}
		}

		estados[idSource].wms.puerto = URI(source.url).port() ? URI(source.url).port() : '80';

	}


}

function imprimir(idSource, source, capabilities)
{

			var capas = capabilities.capability.layers;
			
			
			var $a1 = $('#' + idSource);
			$a1.find('.cargando').remove();

			estados[idSource].wms = {};
			estados[idSource].wms.title = capabilities.service.title;
			estados[idSource].wms.nCapas = capas.length;

			$a1.find('.title').append( '<br/><strong>(' + capas.length + ' capas)</strong>' );
			$a1.append( '<td >'+ capabilities.service.title +'</td>' );
			
			estados[idSource].wms.abstract = capabilities.service.abstract;

			if ( capabilities.service.abstract ) {
				$a1.append( '<td class="ok">'+ resumen(capabilities.service.abstract, 12) +'</td>' );
			} else {
				$a1.append( '<td class="warning"> SIN DEFINIR EN EL SERVIDOR</td>' );
			}
			

			estados[idSource].wms.soporta = {};
			estados[idSource].wms.puerto = 80;
			estados[idSource].wms.soporta.srs = {};
			estados[idSource].wms.soporta.infoFormats = {};
			estados[idSource].wms.soporta.formats = {};
			estados[idSource].wms.soporta.srs['EPSG:900913'] = false;
			estados[idSource].wms.soporta.srs['EPSG:3857'] = false;
			estados[idSource].wms.soporta.srs['EPSG:4326'] = false;
			estados[idSource].wms.soporta.srs['EPSG:22183'] = false;
			estados[idSource].wms.soporta.infoFormats['text/html'] = false;
			estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml'] = false;
			estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml/3.1.1'] = false;
			estados[idSource].wms.soporta.formats['image/png'] = false;
			estados[idSource].wms.soporta.formats['image/png8'] = false;

			for (var i=0; i< capabilities.capability.layers.length; i++)
			{
				var  l = capabilities.capability.layers[i];
				if (l.srs['EPSG:900913'])	{
					estados[idSource].wms.soporta.srs['EPSG:900913'] = true;
				}
				if (l.srs['EPSG:3857'] )	{
					estados[idSource].wms.soporta.srs['EPSG:3857'] = true;
				}
				if (l.srs['EPSG:4326'] )	{
					estados[idSource].wms.soporta.srs['EPSG:4326'] = true;
				}
				if (l.srs['EPSG:22183'] )	{
					estados[idSource].wms.soporta.srs['EPSG:22183'] = true;
				}

				for (var j=0; j< l.infoFormats.length ; j++) {
					if ( l.infoFormats[j] == 'text/html') {
						estados[idSource].wms.soporta.infoFormats['text/html'] = true;
					}
				}

				for (var j=0; j< l.infoFormats.length ; j++) {
					if ( l.infoFormats[j] == 'application/vnd.ogc.gml') {
						estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml'] = true;
					}
				}

				for (var j=0; j< l.infoFormats.length ; j++) {
					if ( l.infoFormats[j] == 'application/vnd.ogc.gml/3.1.1') {
						estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml/3.1.1'] = true;
					}
				}

				for (var j=0; j< l.formats.length ; j++) {
					if ( l.formats[j] == 'image/png') {
						estados[idSource].wms.soporta.formats['image/png'] = true;
						}
				}

				for (var j=0; j< l.formats.length ; j++) {
					if ( l.formats[j] == 'image/png8') {
						estados[idSource].wms.soporta.formats['image/png8'] = true;
						}
				}

				estados[idSource].wms.puerto = URI(source.url).port() ? URI(source.url).port() : '80';

			}

				var $b = $('<td></td>');
				$b.esBayer = true;
				for ( e in estados[idSource].wms.soporta.srs ) {
					var alias = e;
					if ( e == 'EPSG:22183') {
						alias = 'Gauss-Krügger / POSGAR 94';
					}
					if ( estados[idSource].wms.soporta.srs[e] )	{
						var $c = $('<span class="label label-success">Soporta ' + alias + '</span><p/>');
					} else {
						var $c = $('<span class="label label-important">No soporta ' + alias + '</span><p/>');
					}
					$b.append($c);
					$b.esBayer = $b.esBayer && estados[idSource].wms.soporta.srs[e];
				}
				if ($b.esBayer) {
					$b.addClass('ok');
				} else {
					$b.addClass('warning');
				}
				$a1.append( $b );

				var $b = $('<td></td>');
				$b.esBayer = true;
				for ( e in estados[idSource].wms.soporta.infoFormats) {
					var alias = e;
					if ( e == 'application/vnd.ogc.gml' ) {
						alias = 'GML 2'
					} else if ( e == 'application/vnd.ogc.gml/3.1.1') {

						continue;
						alias = 'GML 3';
					}
					if ( estados[idSource].wms.soporta.infoFormats[e] )	{
						var $c = $('<span class="label label-success">Soporta ' + alias + '</span><p/>');
					} else {
						var $c = $('<span class="label label-important">No soporta ' + alias + '</span><p/>');
					}
					$b.append($c);
					$b.esBayer = $b.esBayer && estados[idSource].wms.soporta.infoFormats[e];
				}
				if ($b.esBayer) {
					$b.addClass('ok');
				} else {
					$b.addClass('warning');
				}
				$a1.append( $b );

				var $b = $('<td></td>');
				$b.esBayer = true;
				for ( e in estados[idSource].wms.soporta.formats) {
					var alias = e;
					if ( e == 'image/png' ) {
						alias = 'PNG'
					} else if ( e == 'image/pn8') {
						alias = 'PNG8';
					}
					if ( estados[idSource].wms.soporta.formats[e] )	{
						var $c = $('<span class="label label-success">Soporta ' + alias + '</span><p/>');
					} else {
						var $c = $('<span class="label label-important">No soporta ' + alias + '</span><p/>');
					}
					$b.append($c);
					$b.esBayer = $b.esBayer && estados[idSource].wms.soporta.formats[e];
				}
				if ($b.esBayer) {
					$b.addClass('ok');
				} else {
					$b.addClass('warning');
				}
				$a1.append( $b );
				if (estados[idSource].wms.puerto == '80') {
					$a1.append('<td class="ok">' + estados[idSource].wms.puerto + '</td>');
				} else {
					$a1.append('<td class="fail">' + estados[idSource].wms.puerto + '</td>');
				}
				
			// tabla de capas
			var idRow = 'capas_' + idSource;
			//Agrego una fila al menú
			$('#menu').append('<li><a href="#'+idRow+'"><i class="icon-chevron-right"></i> Capas en '+idSource+'</a></li>');
			// Agrego th para principio de capas de cada servidor
			$('#rows').append( $('<tr id="'+ idRow +'"><td colspan="9" style="background-color:black !important;color:white" > <h3>Capas del servidor de ' + capabilities.service.title + '</h3></td></tr>') );			

			for(var i=0; i<capas.length; i++) {
		
				if(capas[i].name && capas[i].name!="") {
					var l = capas[i];

					imprimirCapa( l );
				
			}
	}
	//OpenLayers.Console.debug(layersStr);
}

function imprimirCapa( l )
{

	var $a = $('<tr></tr>');
	$('#rows').append($a);

	if (l.title == l.name) {
		$a.append('<td class="warning">' + l.title + '</td>');
	} else if (! l.title) {
		$a.append('<td class="fail">' + l.title + '</td>');
	} else {
		$a.append('<td class="ok">' + l.title + '</td>');
	}

	
	$a.append('<td>' + l.name + '</td>');

	if (l.abstract) {
		$a.append('<td class="ok">' + resumen(l.abstract, 12) + '</td>');
	} else {
		$a.append( '<td class="warning"> SIN DEFINIR EN EL SERVIDOR</td>' );
	}

	kwString = '';
	var usaKeywordsParaTemaPerfilMetadatos = false;
	
	for ( var j=0; j < l.keywords.length; j++ ) {
		var kw = l.keywords[j];

		if ( temasPerfilMetadatos[kw] ) {
			var usaKeywordsParaTemaPerfilMetadatos = true;
		}
		kwString = kwString + kw + '<br/>';
	}
	if (! kwString ) {
		$a.append( '<td class="fail">SIN DEFINIR EN EL SERVIDOR</td>' );
	} else if (usaKeywordsParaTemaPerfilMetadatos  ) {
		$a.append( '<td class="ok">'+ kwString +'</td>' );
	} else {
		$a.append( '<td class="warning">'+ kwString +'</td>' );
	}
	
	metadataURLsString = '';
	for (var j=0; j< l.metadataURLs.length ; j++ ) {
		var metadataURL = l.metadataURLs[j].href;
		metadataURLsString = metadataURLsString + metadataURL + '<br/>';
	}

	if (! metadataURLsString ) {
		$a.append( '<td class="fail">SIN DEFINIR EN EL SERVIDOR</td>' );
	} else {
		$a.append( '<td class="ok">'+ metadataURLsString+'</td>' );
	}

	var soporta4326 = false;
	var soporta3857 = false;
	var soporta900913 = false;
	var soportaGaussKruger = false;
	var soportaGetFeatureInfoTextHTML = false;
	var soportaGetFeatureInfoGML2 = false;
	var soportaPNG = false;
	var soportaPNG8 = false


	
	for (var j=0; j< l.infoFormats.length ; j++) {
		if ( l.infoFormats[j] == 'text/html') {
			soportaGetFeatureInfoTextHTML = true;
		}
	}

	for (var j=0; j< l.infoFormats.length ; j++) {
		if ( l.infoFormats[j] == 'application/vnd.ogc.gml') {
			soportaGetFeatureInfoGML2 = true;
		}
	}

	for (var j=0; j< l.formats.length ; j++) {
		if ( l.formats[j] == 'image/png') {
			soportaPNG = true;
		}
	}

	for (var j=0; j< l.formats.length ; j++) {
		if ( l.formats[j] == 'image/png8') {
			soportaPNG8 = true;
		}
	}


	if (soportaGetFeatureInfoTextHTML) {
		$a.append( '<td class="ok"> Soporta GetFeatureInfo text/html </td>' );
	} else {
		$a.append( '<td class="fail"> No soporta GetFeatureInfo text/html </td>' );
	}

	if (soportaGetFeatureInfoGML2) {
		$a.append( '<td class="ok"> Soporta GetFeatureInfo GML 2 </td>' );
	} else {
		$a.append( '<td class="fail"> No soporta GetFeatureInfo GML 2 </td>' );
	}

	if (soportaPNG) {
		$a.append( '<td class="ok"> Soporta image/png </td>' );
	} else {
		$a.append( '<td class="fail"> No soporta image/png </td>' );
	}

	if (soportaPNG8) {
		$a.append( '<td class="ok"> Soporta image/png8 </td>' );
	} else {
		$a.append( '<td class="fail"> No soporta image/png8</td>' );
	}
}

function resumen( texto, cantPalabras)
{
	return texto.split(' ').splice(0, cantPalabras).join(' ') + '...';
}