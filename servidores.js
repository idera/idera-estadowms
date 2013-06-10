/**
 * Las URLs están normalizadas según específica OGC en el documento :
 * http://portal.opengeospatial.org/files/?artifact_id=1081&version=1&format=pdf
 * en la sección 6.2.2.
 *
 * Es decir cada URL es lo que debería ir en el campo URL de Recurso Online de cada servidor
 */
var sources = {
		ign: {
			title:"Instituto Geográfico Nacional",
			url: "http://wms.ign.gob.ar/geoserver/wms?",
			ptype: "gxp_wmscsource"
		},
		indec: {
			name:'chuu',
			title: "Instituto Nacional de Estadísticas y Censos",
			url: "http://200.51.91.231/cgi-bin/mapserv?program=/cgibin/mapserv&map=/prosiga/INDEC_WMS_Poblacion.map&",
		},
		mapaeducativo: {
			title: "Programa Nacional Mapa Educativo",
			url: "http://www.mapaeducativo.edu.ar/geoserver/ogc/wms?",
		},
		inta: {
			title: "Instituto Nacional de Tecnología Agropecuaria",
			url: "http://geointa.inta.gov.ar/geoserver/wms?",
		},
		se: {
			title: "Secretaría de Energía",
			url: "http://sig.se.gob.ar/cgi-bin/mapserv6?map=/var/www/html/visor/geofiles/map/mapase.map&",
		},
		arba: {
			title: "ARBA",
			url: "http://cartoservices.arba.gov.ar/geoserver/wms?",
		},
		mapaescolar: {
			title: "Educación (Mapa Escolar)",
			url: "http://190.210.101.129/cgi-bin/mapaescolar?",
		},
		urbasig: {
			title: "Dirección Provincial de Ordenamiento Urbano y Territorial (Subsecretaria de Gobierno, Ministerio de Gobierno (urBAsig))",
			url: "http://www.mosp.gba.gov.ar/webmapping/cgi-bin/urbasig?",
		},
		hidraulica: {
			title: "Dirección de Hidráulica (Ministerio de Infraestructura)",
			url: "http://www.mosp.gba.gov.ar/wms_hidraulica/cgi-bin/mapserv.exe?map=/ms4w/apps/m/wms.map&",
		},
		etisigchaco: {
			title: "ETISIG CHACO",
			url: "http://etisig.siup.gov.ar/mapasetisig.map?",
		},
		ideformosa: {
			title: "IDE FORMOSA",
			url: "http://idef.formosa.gob.ar/servicios/wms?",
		},
		etisigcatamarca: {
			title: "ETISIG CATAMARCA",
			url: "http://www.atlas.catamarca.gov.ar:8080/cgi-bin/wms_acat?",
		},
		idesantacruz: {
			title: "IDE SANTA CRUZ",
			url: "http://www.sitsantacruz.gov.ar:8080/geoserver/ows?",
		},
		idesantafe: {
			title: "IDE SANTA FE",
			url: "http://www.idesf.santafe.gov.ar/cgi-bin/idesf?",
		},
		idetucuman: {
                        title: "IDET TUCUMÁN",
                        url: "http://central.tucuman.gov.ar:8180/cgi-bin/wms_idet?",
                },
		rides1: {
			title: "RIDES - Información Min. Des. Productivo",
			url: "http://rides.producciontucuman.gov.ar/ArcGIS/services/Informacion_Productiva/mapserver/WMSServer?",
		},	
		rides2: {
			title: "RIDES - Imágenes Min. Des. Productivo",
			url: "http://rides.producciontucuman.gov.ar/ArcGIS/services/ImagenesMDP/mapserver/WMSServer?",
		},
		rosario: {
			title: "Municipalidad de Rosario",
			url: "http://www.rosario.gov.ar/wms/planobase?",
		}

  };
