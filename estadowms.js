/**
 *
 * Código berreta en https://github.com/oskosk/idera-estadowms
 *
 */

var idera = idera || {};
idera.estadowms = {};
idera.capas = {};

(function (){
	var format;

	var capabilities = {};
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

	function Log( texto )
	{
		if (window.console) {
			console.log( texto);
		}
	}

	function fallo(idSource, mensaje)
	{
		var colspan = $('#estadoAtributos tr:first td').length -1;
		$('#estadoAtributos .estadoAtributos_' + idSource + ' .cargando')
		.attr('colspan', colspan )
		.addClass('fail')
		.text( mensaje );

		$('#estadoSoporteDeFormatos .estadoSoporteDeFormatos_' + idSource + ' .cargando')
		.attr('colspan', colspan )
		.addClass('fail')
		.text( mensaje );
	}

	function esHREFValida(href, urlCapabilities)
	{

		if (href == urlCapabilities) {
			return true;
		}
		return false;
	}

	idera.estadowms.init = function()
	{

		OpenLayers.ProxyHost= function(url) {
			return "/cgi-bin/proxy.cgi?url=" + encodeURIComponent(url);
		};
		for (s in sources) {
			var $tr = $('<tr class="estadoAtributos_'+ s + '"></tr>');
			$tr.append('<td style="background-color:black;color:white;font-size:1em" class="title">' + sources[s].title +'</td>');
			$tr.append('<td colspan=6 class="cargando"><img style="height:50px" alt="Cargando..." src="http://i.imgur.com/6RMhx.gif"</td>');
			$('#estadoAtributos').append($tr);

			var $tr = $('<tr class="estadoSoporteDeFormatos_'+ s + '"></tr>');
			$tr.append('<td style="background-color:black;color:white;font-size:1em" class="title">' + sources[s].title +'</td>');
			$tr.append('<td colspan=6 class="cargando"><img style="height:50px" alt="Cargando..." src="http://i.imgur.com/6RMhx.gif"</td>');
			$('#estadoSoporteDeFormatos').append($tr);
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
			callback: function(request) {
				if (request.status != 200) {
					var msj = 'El servidor ' + source.title + ' está caído';
					fallo(idSource, msj);
					return;
				}
				var doc = request.responseXML;
				if (!doc || !doc.documentElement) {
					doc = request.responseText;
				}

				capabilities[idSource] = format.read(doc);
				//Log( capabilities[idSource] );
				if (capabilities[idSource].error) {
					var msj = 'El servidor ' + source.title + ' no devolvió el documento capabilities correctamente';
					fallo(idSource, msj);
					return;
				}


				diagnosticarServicioWMS(idSource, source, capabilities[idSource]);
				imprimirDiagnosticoDeServicioWMS(idSource, capabilities[idSource].capability.layers);

			},
			failure: function() {
				var msj = 'El servidor ' + source.title + ' no está accesible.';
				fallo(idSource, msj);

			}
		});

	}



	function diagnosticarServicioWMS(idSource, source, capabilities)
	{
		var capas = capabilities.capability.layers;

		estadoSoporteDeFormatos

		estados[idSource].wms = {};
		estados[idSource].wms.title = capabilities.service.title;
		estados[idSource].wms.nCapas = capas.length;
		estados[idSource].wms.abstract = capabilities.service.abstract;
		estados[idSource].wms.href = capabilities.service.href;
		estados[idSource].wms.contacto = capabilities.service.contactInformation;

		estados[idSource].wms.soporta = {};
		estados[idSource].wms.puerto = 80;
		estados[idSource].wms.soporta.srs = {};
		estados[idSource].wms.soporta.infoFormats = {};
		estados[idSource].wms.soporta.formats = {};
		estados[idSource].wms.soporta.excepciones = {};
		estados[idSource].wms.soporta.srs['EPSG:900913'] = false;
		estados[idSource].wms.soporta.srs['EPSG:3857'] = false;
		estados[idSource].wms.soporta.srs['EPSG:4326'] = false;
		estados[idSource].wms.soporta.srs['EPSG:22183'] = false;
		estados[idSource].wms.soporta.infoFormats['text/html'] = false;
		estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml'] = false;
		estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml/3.1.1'] = false;
		estados[idSource].wms.soporta.formats['image/png'] = false;
		estados[idSource].wms.soporta.formats['image/jpeg'] = false;
		estados[idSource].wms.soporta.formats['image/png8'] = false;
		estados[idSource].wms.soporta.excepciones['application/vnd.ogc.se_inimage'] = false;
		estados[idSource].wms.soporta.excepciones['application/vnd.ogc.se_xml'] = false;

		function soportaSRS( srs, capas )
		{
			for (var i=0; i< capas.length; i++) {
				var  l = capas[i];

				if (l.srs[ srs ])	{
					return true;
				}
			}
			return false;
		}

		function soportaInfoFormat( mime, capas )
		{
			for (var i=0; i< capas.length; i++) {
				var  l = capas[i];

				for (var j=0; j< l.infoFormats.length ; j++) {
					if ( l.infoFormats[j] == mime ) {
						return true;
					}
				}
			}
			return false;
		}

		function soportaFormat( mime, capas )
		{
			for (var i=0; i< capas.length; i++) {
				var  l = capas[i];

				for (var j=0; j< l.formats.length ; j++) {
					if ( l.formats[j] == mime ) {
						return true;
					}
				}
			}
			return false;
		}

		if (soportaSRS( 'EPSG:900913' , capas )	) {
			estados[idSource].wms.soporta.srs['EPSG:900913'] = true;
		}
		if (soportaSRS( 'EPSG:3857' , capas ) ) 	{
			estados[idSource].wms.soporta.srs['EPSG:3857'] = true;
		}
		if (soportaSRS( 'EPSG:4326' , capas ) )	{
			estados[idSource].wms.soporta.srs['EPSG:4326'] = true;
		}
		if (soportaSRS( 'EPSG:22183' , capas ) )	{
			estados[idSource].wms.soporta.srs['EPSG:22183'] = true;
		}

		if ( soportaInfoFormat('text/html', capas) ) {
			estados[idSource].wms.soporta.infoFormats['text/html'] = true;
		}
		if ( soportaInfoFormat('application/vnd.ogc.gml', capas) ) {
			estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml'] = true;
		}

		if ( soportaInfoFormat('application/vnd.ogc.gml/3.1.1', capas) ) {
			estados[idSource].wms.soporta.infoFormats['application/vnd.ogc.gml/3.1.1'] = true;
		}

		for (var j=0; j< capabilities.capability.exception.formats.length ; j++) {
			if ( capabilities.capability.exception.formats[j] == 'application/vnd.ogc.se_inimage') {
				estados[idSource].wms.soporta.excepciones['application/vnd.ogc.se_inimage'] = true;
			}
			if ( capabilities.capability.exception.formats[j] == 'application/vnd.ogc.se_xml') {
				estados[idSource].wms.soporta.excepciones['application/vnd.ogc.se_xml'] = true;
			}

		}

		if ( soportaFormat('image/png', capas ) ) {
			estados[idSource].wms.soporta.formats['image/png'] = true;
		}
		if ( soportaFormat('image/png8', capas ) ) {
			estados[idSource].wms.soporta.formats['image/png8'] = true;
		}
		if ( soportaFormat('image/jpeg', capas ) ) {
			estados[idSource].wms.soporta.formats['image/jpeg'] = true;
		}
		if ( soportaFormat('image/jpeg', capas ) ) {
			estados[idSource].wms.soporta.formats['image/jpeg'] = true;
		}

		estados[idSource].wms.puerto = URI(source.url).port() ? URI(source.url).port() : '80';


	}

	function imprimirDiagnosticoDeServicioWMS(idSource, capas)
	{

		var $a1 = $('#estadoAtributos .estadoAtributos_' + idSource);
		var $a2 = $('#estadoSoporteDeFormatos .estadoSoporteDeFormatos_' + idSource);
		$a1.find('.cargando').remove();
		$a2.find('.cargando').remove();

		$a1.find('.title').append( '<br/><strong>(' + estados[idSource].wms.nCapas + ' capas)</strong>' );
		$a1.append( '<td >'+ estados[idSource].wms.title +'</td>' );

		if ( estados[idSource].wms.abstract ) {
			$a1.append( '<td rel="tooltip" title="' + estados[idSource].wms.abstract + '" class="ok">'+ resumen(estados[idSource].wms.abstract, 12) +'</td>' );
		} else {
			$a1.append( '<td rel="tooltip" title="Ver recomendaciones acerca del atributo WMS Abstract del Servicio WMS" class="fail"> SIN DEFINIR EN EL SERVIDOR</td>' );
		}

		if ( estados[idSource].wms.contacto ) {
			var contacto = estados[idSource].wms.contacto.email;
			$a1.append('<td class="ok">' + contacto + '</td>');
		} else {
			$a1.append('<td rel="tooltip" title="Ver recomendaciones acerca de los atributos de contato" class="fail">SIN DEFINIR EN EL SERVIDOR</td>');
		}

		var $b = $('<td></td>');
		$b.esBayer = true;
		for ( e in estados[idSource].wms.soporta.srs ) {
			var alias = e;
			if ( e == 'EPSG:22183') {
				alias = 'Gauss / POSGAR 94';
			}
			if ( estados[idSource].wms.soporta.srs[e] )	{
				var $c = $('<span class="label label-success">Soporta ' + alias + '</span><p/>');
			} else {
				var $c = $('<span rel="tooltip" title="Ver recomendaciones acerca de los Sistemas de Referencia Espacial" class="label label-important">No soporta ' + alias + '</span><p/>');
			}
			$b.append($c);
			$b.esBayer = $b.esBayer && estados[idSource].wms.soporta.srs[e];
		}
		if ($b.esBayer) {
			$b.addClass('ok');
		} else {
			$b.addClass('warning');
		}
		$a2.append( $b );

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
				var $c = $('<span rel="tooltip" title="Ver recomendaciones acerca de los formatos de GetFeatureInfo" class="label label-important">No soporta ' + alias + '</span><p/>');
			}
			$b.append($c);
			$b.esBayer = $b.esBayer && estados[idSource].wms.soporta.infoFormats[e];
		}
		if ($b.esBayer) {
			$b.addClass('ok');
		} else {
			$b.addClass('warning');
		}
		$a2.append( $b );

		var $b = $('<td></td>');
		$b.esBayer = true;
		for ( e in estados[idSource].wms.soporta.formats) {
			var alias = e;
			if ( e == 'image/png' ) {
				alias = 'PNG'
			} else if ( e == 'image/png8') {
				alias = 'PNG8';
			} else if ( e == 'image/jpeg') {
				alias = 'JPEG';
			}
			if ( estados[idSource].wms.soporta.formats[e] )	{
				var $c = $('<span class="label label-success">Soporta ' + alias + '</span><p/>');
			} else {
				var $c = $('<span rel="tooltip" title="Ver recomendaciones acerca de los formatos de imagen" class="label label-important">No soporta ' + alias + '</span><p/>');
			}
			$b.append($c);
			$b.esBayer = $b.esBayer && estados[idSource].wms.soporta.formats[e];
		}
		if ($b.esBayer) {
			$b.addClass('ok');
		} else {
			$b.addClass('warning');
		}
		$a2.append( $b );


		var $b = $('<td></td>');
		$b.esBayer = true;
		for ( e in estados[idSource].wms.soporta.excepciones) {
			var alias = e;
			if ( e == 'application/vnd.ogc.se_inimage' ) {
				alias = 'Imagen'
			} else if ( e == 'application/vnd.ogc.se_xml') {
				alias = 'XML';
			}
			if ( estados[idSource].wms.soporta.excepciones[e] )	{
				var $c = $('<span class="label label-success">Soporta ' + alias + '</span><p/>');
			} else {
				var $c = $('<span rel="tooltip" title="Ver recomendaciones acerca de los formatos de excepciones" class="label label-important">No soporta ' + alias + '</span><p/>');
			}
			$b.append($c);
			$b.esBayer = $b.esBayer && estados[idSource].wms.soporta.excepciones[e];
		}
		if ($b.esBayer) {
			$b.addClass('ok');
		} else {
			$b.addClass('warning');
		}
		$a2.append( $b );


		if (estados[idSource].wms.puerto == '80') {
			$a1.append('<td class="ok">' + estados[idSource].wms.puerto + '</td>');
		} else {
			$a1.append('<td rel="tooltip" title="Ver recomendaciones acerca del puerto del servicios WMS" class="fail">' + estados[idSource].wms.puerto + '</td>');
		}

		if (! estados[idSource].wms.href) {
			$a1.append('<td rel="tooltip" title="Ver recomendaciones acerca del atributo WMS href" class="fail">SIN DEFINIR EN EL SERVIDOR</td>');
		} else if ( esHREFValida(estados[idSource].wms.href, sources[idSource].url)  ) {
			$a1.append('<td class="ok">' + estados[idSource].wms.href  + '</td>');
		} else {
			$a1.append('<td rel="tooltip" title="Ver recomendaciones acerca del atributo WMS href" class="warning">' + estados[idSource].wms.href  + '</td>');
		}


		$('#estadoAtributos td').tooltip();
		$('#estadoSoporteDeFormatos td').tooltip();
		$('span').tooltip();

		idera.capas[idSource]=capas;
		$a1.append('<td rel="tooltip" title="Comprobar recomendaciones en las \
			capas del servicio" class=""> <a href="javascript: \
			idera.estadowms.imprimirCapas(\''+idSource+'\');">Verificar Capas</td>');
	}

	idera.estadowms.imprimirCapas = function(idSource)
	{
		capas=idera.capas[idSource];
		// tabla de capas
		var idRow = 'capas_' + idSource;
		//Agrego una fila al menú
		$('#menu').append('<li><a href="#'+idRow+'"><i class="icon-chevron-right"></i> Capas en '+idSource+'</a></li>');
		$('#menucapas').append('<li><a href="#'+idRow+'">Capas en '+idSource+'</a></li>');
		// Agrego th para principio de capas de cada servidor
		$('#rows').append( $('<tr id="'+ idRow +'"><td colspan="10"  > <h3>Capas de <em>' + estados[idSource].wms.title  + '</em></h3></td></tr>') );

		for(var i=0; i<capas.length; i++) {
			if(capas[i].name && capas[i].name!="") {
				var l = capas[i];
				imprimirCapa( l );
			}
		}
		scrollTo(idRow);
	}

	function imprimirCapa( l )
	{

		var $a = $('<tr></tr>');
		$('#rows').append($a);

		if (l.title == l.name) {
			$a.append('<td rel="tooltip" title="Ver recomendaciones acerca del atributo WMS Title de las capas" class="warning">' + l.title + '</td>');
		} else if (! l.title) {
			$a.append('<td rel="tooltip" title="Ver recomendaciones acerca del atributo WMS Title de las capas" class="fail">' + l.title + '</td>');
		} else {
			$a.append('<td class="ok">' + l.title + '</td>');
		}


		$a.append('<td>' + l.name + '</td>');

		if (l.abstract) {
			$a.append('<td rel="tooltip" title="' + l.abstract + '" class="ok">' + resumen(l.abstract, 12) + '</td>');
		} else {
			$a.append( '<td rel="tooltip" title="Ver recomendaciones acerca del atributo WMS Abstract de las capas" class="warning"> SIN DEFINIR EN EL SERVIDOR</td>' );
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
			$a.append( '<td el="tooltip" title="Ver recomendaciones acerca del atributo WMS Palabra Clave de las capas" class="fail">SIN DEFINIR EN EL SERVIDOR</td>' );
		} else if (usaKeywordsParaTemaPerfilMetadatos  ) {
			$a.append( '<td class="ok">'+ kwString +'</td>' );
		} else {
			$a.append( '<td el="tooltip" title="Ver recomendaciones acerca del atributo WMS Palabra clave de las capas" class="warning">'+ kwString +'</td>' );
		}

		metadataURLsString = '';
		for (var j=0; j< l.metadataURLs.length ; j++ ) {
			var metadataURL = l.metadataURLs[j].href;
			metadataURLsString = metadataURLsString + metadataURL + '<br/>';
		}

		if (! metadataURLsString ) {
			$a.append( '<td el="tooltip" title="Ver recomendaciones acerca del atributo WMS Link a metadatos de las capas" class="warning">SIN DEFINIR EN EL SERVIDOR</td>' );
		} else {
			$a.append( '<td class="ok">'+ metadataURLsString+'</td>' );
		}

		var stylesString = '';
		for ( var j=0; j < l.styles.length; j++ ) {
			var s = l.styles[j];

			stylesString = stylesString + s.name+ '<br/>';
		}
		$a.append( '<td >'+ stylesString +'</td>' );
		$a.find('td').tooltip();
	}

	function resumen( texto, cantPalabras)
	{
		return texto.split(' ').splice(0, cantPalabras).join(' ') + '...';
	}

	// desplaza pagina hasta el elemento especificado
	function scrollTo( idElem ) {
		$('html, body').animate({
        scrollTop: $('#' + idElem).offset().top
    }, 2000);
	}
})();
