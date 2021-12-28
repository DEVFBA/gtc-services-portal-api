var fonts = {
    Roboto: {
      normal: './fonts/Montserrat-Regular.ttf',
      bold: './fonts/Montserrat-Bold.ttf',
      italics: './fonts/Montserrat-Italic.ttf',
      bolditalics: './fonts/Montserrat-BoldItalic.ttf'
    }
};

var convert = require('xml-js');
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");
const xml = require('./xml.js')

const dbcatcatalogs = require('../controllers/cat-catalogs')
const dbcatgeneralparameters = require('../controllers/cat-general-parameters')

async function getPDFCasaDiaz(docBase64, pathLogo, nameFile)
{
    
    try {

        var xmlString = await xml.serializeXML(docBase64)
    
        var options = {compact: false, ignoreComment: true, spaces: 4};
        const jsonString = convert.xml2json(xmlString, options);
        const jsonData = JSON.parse(jsonString)
        var emisor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Emisor")
        var receptor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Receptor")
        var attributes = jsonData.elements[0].attributes
        var complemento = jsonData.elements[0].elements.find( o => o.name === "cfdi:Complemento")
        var timbreFiscal = complemento.elements.find( o => o.name === "tfd:TimbreFiscalDigital")
        var conceptos = jsonData.elements[0].elements.find( o => o.name === "cfdi:Conceptos")
        var cartaP = complemento.elements.find( o => o.name === "cartaporte20:CartaPorte")
        //console.log(cartaP)
    
        var datosEmisor = {
            text: [
                {text: `${emisor.attributes.Nombre}\n`, style: 'textotablaboldlarge'},
                {text: "\n", style: 'espacios'},
                {text: `R.F.C.: ${emisor.attributes.Rfc}\n`, style: 'encabezadoRfc'},
                {text: "\n", style: 'espacios'},
                {text: "DOMICILIO FISCAL: \n", style: 'encabezadoDomicilio'},
                {text: "AQUI VA EL DOMICILIO \n", style: 'encabezadoTexto'},
                {text: "\n", style: 'espacios'},
                {text: `LUGAR DE EXPEDICIÓN: `, style: 'encabezadoDomicilio'},
                {text: `${attributes.LugarExpedicion}\n`, style: 'encabezadoTexto'},
                {text: "\n", style: 'espacios'},
                {text: `FECHA Y HORA DE EXPEDICIÓN: `, style: 'encabezadoDomicilio'},
                {text: `${attributes.Fecha}`, style: 'encabezadoTexto'},
            ]
        }
    
        var paramsTipoComprobante = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.TipoDeComprobante,
            table: "SAT_Cat_Receipt_Types"
        }
    
        var resTipoTraslado = await dbcatcatalogs.getCatalogIdDescription(paramsTipoComprobante)
    
        var paramsRegimenFiscal = {
            pvOptionCRUD: "R",
            pvIdCatalog: emisor.attributes.RegimenFiscal,
            table: "SAT_Cat_Tax_Regimens"
        }
    
        var resRegimenFiscal = await dbcatcatalogs.getCatalogIdDescription(paramsRegimenFiscal)
        
    
        var encabezado =
        {
            columns: [
                [
                    {text: "\n", style: 'espacios'},
                    {text: "\n", style: 'espacios'},
                    { image: pathLogo, width: 140, height: 60, alignment: 'center'},
                    {text: "\n", style: 'espacios'},
                ],
                [
                    {text: datosEmisor}
                ],
                [
                    {
                        table: {
                            body: [
                                [
                                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'TRASLADO', alignment: 'center', style: 'textoTablaTrasladoHeader'},
                                ],
                                [
                                    {border: [true, false, true, false], text: `SERIE: ${attributes.Serie} FOLIO: ${attributes.Folio}`, style: 'textotablaboldblack',  alignment: 'left'},
                                ],
                                [
                                    { border: [true, false, true, false], text: `VERSIÓN: ${attributes.Version}`, style: 'textotabla', alignment: 'left'}, 
                                ],
                                [
                                    { border: [true, false, true, false], text: `FOLIO FISCAL: ${timbreFiscal.attributes.UUID}`, style: 'textotabla', alignment: 'left'},
                                ],
                                [
                                    { border: [true, false, true, false], text: `FECHA Y HORA DE CERTIFICACIÓN: ${timbreFiscal.attributes.FechaTimbrado}`, style: 'textotabla', alignment: 'left'},
                                ],
                                [
                                    {border: [true, false, true, false], text: `FECHA Y HORA DE EMISIÓN: ${attributes.Fecha}`, style: 'textotabla' , alignment: 'left'},
                                ],
                                [
                                    {border: [true, false, true, false], text: `TIPO DE COMPROBANTE: ${attributes.TipoDeComprobante} - ${resTipoTraslado}`, style: 'textotabla' , alignment: 'left'},
                                ],
                                [
                                    {border: [true, false, true, true], text: `RÉGIMEN FISCAL: ${emisor.attributes.RegimenFiscal} - ${resRegimenFiscal}`, style: 'textotabla' , alignment: 'left'},
                                ],
                            ]
                        },
                        layout: {
                            hLineWidth: function () {
                                return  0.7;
                            },
                            vLineWidth: function () {
                                return 0.7;
                            },
                            hLineColor: function () {
                                return 'gray';
                            },
                            vLineColor: function () {
                                return 'gray';
                            },
                        }	
                    }
                ]
            ]
        } 
    
        var paramsUsoCFDI = {
            pvOptionCRUD: "R",
            pvIdCatalog: receptor.attributes.UsoCFDI,
            table: "SAT_Cat_CFDI_Uses"
        }
    
        var resUsoCFDI = await dbcatcatalogs.getCatalogIdDescription(paramsUsoCFDI)
    
        var cliente = {
            table: {
                widths: ["*", 130, 90],
                body: [
                    [
                        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'CLIENTE', alignment: 'center', style: 'textoTablaClienteHeader', colSpan:3},
                        {},
                        {}
                    ],
                    [
                        {text: `NOMBRE`, style: 'textoTablaClienteBoldblack',  alignment: 'center'},
                        {text: `R.F.C.:`, style: 'textoTablaClienteBoldblack',  alignment: 'center'},
                        {text: `USO DE CFDI:`, style: 'textoTablaClienteBoldblack',  alignment: 'center'},
                    ],
                    [
                        {text: `${receptor.attributes.Nombre}`, style: 'textoTablaCliente', alignment: 'center'}, 
                        {text: `${receptor.attributes.Rfc}`, style: 'textoTablaCliente', alignment: 'center'}, 
                        {text: `${receptor.attributes.UsoCFDI} - ${resUsoCFDI}`, style: 'textoTablaCliente', alignment: 'center'}, 
                    ],
                ]
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        var conceptosArray = []
        var cCount = 0
    
        conceptosArray[cCount] = [
            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Clave Producto / Servicio', alignment: 'center', style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Cantidad', alignment: 'center', style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Clave Unidad', alignment: 'center', style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Unidad', alignment: 'center', style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Descripción', alignment: 'center', style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Valor Unitario', alignment: 'center', style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Importe', alignment: 'center', style: 'textoTablaTrasladoHeader'},
        ]
    
        cCount++
    
        for(var i=0; i<conceptos.elements.length; i++)
        {
            var paramsClaveUnidad= {
                pvOptionCRUD: "R",
                pvIdCatalog: conceptos.elements[i].attributes.ClaveUnidad,
                table: "SAT_Cat_UoM_Codes"
            }
        
            var resClaveUnidad = await dbcatcatalogs.getCatalogIdDescription(paramsClaveUnidad)
    
            var paramsClaveProd= {
                pvOptionCRUD: "R",
                pvIdCatalog: conceptos.elements[i].attributes.ClaveProdServ,
                table: "SAT_Cat_Product_Service_Codes"
            }
        
            var resClaveProd = await dbcatcatalogs.getCatalogIdDescription(paramsClaveProd)
    
            conceptosArray[cCount] = [
                {text: `${conceptos.elements[i].attributes.ClaveProdServ} - ${resClaveProd}`, alignment: 'center', style: 'textoTablaCliente'},
                {text: `${conceptos.elements[i].attributes.Cantidad}`, alignment: 'center', style: 'textoTablaCliente'},
                {text: `${conceptos.elements[i].attributes.ClaveUnidad} - ${resClaveUnidad}`, alignment: 'center', style: 'textoTablaCliente'},
                {text: `${conceptos.elements[i].attributes.Unidad}`, alignment: 'center', style: 'textoTablaCliente'},
                {text: `${conceptos.elements[i].attributes.Descripcion}`, alignment: 'left', style: 'textoTablaCliente'},
                {text: `${conceptos.elements[i].attributes.ValorUnitario}`, alignment: 'center', style: 'textoTablaCliente'},
                {text: `${conceptos.elements[i].attributes.Importe}`, alignment: 'center', style: 'textoTablaCliente'},
            ]
            cCount++
        }
    
        var conceptos = {
            table: {
                headerRows: 1,
                widths: [80, 40, 50, 60, "*", 60, 40],
                body: conceptosArray
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        var paramsMoneda= {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.Moneda,
            table: "SAT_Cat_Currencies"
        }
    
        var resMoneda = await dbcatcatalogs.getCatalogIdDescription(paramsMoneda)
    
        var totales = 
        {
            columns: [
                {
                    width: "*",
                    text: `Moneda: ${attributes.Moneda} - ${resMoneda}`,
                    style: 'moneda'
                },
                {
                    width: 200,
                    table: {
                        widths: ["*", 50],
                        body: [
                            [
                                {text: 'SUBTOTAL', alignment: 'right', style: 'textotablabold'},
                                {text: `${attributes.SubTotal}`, alignment: 'right', style: 'textotablabold'},
                            ],
                            [
                                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'TOTAL', alignment: 'right', style: 'textoTablaTrasladoHeader'},
                                {border: [false, false, false, false], fillColor: '#eaa01b', text: `${attributes.Total}`, alignment: 'right', style: 'textoTablaTrasladoHeader'},
                            ],
                        ]
                    },
                    layout: {
                        hLineWidth: function () {
                            return  0.7;
                        },
                        vLineWidth: function () {
                            return 0.7;
                        },
                        hLineColor: function () {
                            return 'gray';
                        },
                        vLineColor: function () {
                            return 'gray';
                        },
                    }	
                },
            ]
        }
    
        //Se arma la CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACIÓN DIGITAL DEL SAT
        var version = timbreFiscal.attributes.Version 
        if(version === undefined)
        {
            version = ""
        }
        else {
            version = version + "|"
        }
    
        var uuid = timbreFiscal.attributes.UUID
        if(uuid === undefined)
        {
            uuid = ""
        }
        else {
            uuid = uuid + "|"
        }
    
        var fechaTimbrado = timbreFiscal.attributes.FechaTimbrado
        if(fechaTimbrado === undefined)
        {
            fechaTimbrado = ""
        }
        else {
            fechaTimbrado = fechaTimbrado + "|"
        }
    
        var rfcProvCertif = timbreFiscal.attributes.RfcProvCertif
        if(rfcProvCertif === undefined)
        {
            rfcProvCertif = ""
        }
        else{ 
            rfcProvCertif = rfcProvCertif + "|"
        }
    
        var selloCFD = timbreFiscal.attributes.SelloCFD
        if(selloCFD === undefined)
        {
            selloCFD = ""
        }
        else {
            selloCFD = selloCFD + "|"
        }
    
        var noCertificadoSAT = timbreFiscal.attributes.NoCertificadoSAT 
        if(noCertificadoSAT == undefined)
        {
            noCertificadoSAT = ""
        }
        
        var complementoCertificacionSAT = "||" + version + uuid + fechaTimbrado + rfcProvCertif + selloCFD + noCertificadoSAT + "||"
    
        var cadenaCodigo = {
            text: [
                {text: "NÚMERO DE SERIE DEL CERTIFICADO DEL SAT: ", style: 'textoTablaCodigoBold'},
                {text: `${timbreFiscal.attributes.NoCertificadoSAT}\n`, style: 'textoTablaCodigo'},
                {text: "\n", style: 'espacios'},
                {text: "NÚMERO DE SERIE DEL CSD DEL EMISOR: ", style: 'textoTablaCodigoBold'},
                {text: `${attributes.NoCertificado}\n`, style: 'textoTablaCodigo'},
                {text: "\n", style: 'espacios'},
                {text: "SELLO DIGITAL DEL SAT:\n", style: 'textoTablaCodigoBold'},
                {text: `${timbreFiscal.attributes.SelloSAT}\n`, style: 'textoTablaCodigo'},
                {text: "\n", style: 'espacios'},
                {text: "SELLO DIGITAL DEL CFDI:\n", style: 'textoTablaCodigoBold'},
                {text: `${timbreFiscal.attributes.SelloCFD}\n`, style: 'textoTablaCodigo'},
                {text: "\n", style: 'espacios'},
                {text: "CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACIÓN DIGITAL DEL SAT:\n", style: 'textoTablaCodigoBold'},
                {text: `${complementoCertificacionSAT}\n`, style: 'textoTablaCodigo'},
            ]
        }
    
        //Se arma el url para el código QR
        var finSelloDig = timbreFiscal.attributes.SelloCFD.substr(-8);
        var url = "https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx" + "?&id=" +
                    timbreFiscal.attributes.UUID + "&re=" + emisor.attributes.Rfc + "&rr=" + receptor.attributes.Rfc + "&tt=" + attributes.Total  + "&fe=" + finSelloDig
    
        var paramsTemporalFiles = {
            pvOptionCRUD: "R",
            piIdParameter: "20",
        }
    
        var resTemporalFiles = await dbcatgeneralparameters.getGeneralParametersbyID(paramsTemporalFiles)
        console.log((resTemporalFiles[0])[0].Value)
    
        var imageQR = timbreFiscal.attributes.UUID + ".png"
        //console.log(imageQR)
    
        const buffer = await new AwesomeQR({
            text: url,
            size: 500,
        }).draw();
    
        var temporalFilesPath = (resTemporalFiles[0])[0].Value
          
        fs.writeFileSync(temporalFilesPath + imageQR, buffer);
        
        var codigos = {
            table: {
                widths: [110, 430],
                body: [
                    [
                        {image: temporalFilesPath + imageQR, width: 120, height: 120, alignment: 'center', verticalAlign: 'middle'},
                        {border: [false, true, true, true], text: cadenaCodigo, alignment: 'left'},
                    ],
                ]
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        var cartaPorte = {
            table: {
                dontBreakRows: true, 
                widths: [170, "*", 170],
                        body: [
                            [
                                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'COMPLEMENTO CARTA PORTE ' + cartaP.attributes.Version, alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:3},
                                {},
                                {},
                            ],
                            [
                                {text: 'VERSIÓN', alignment: 'center', style: 'textoTablaClienteBoldblack'},
                                {text: "TRANSPORTE INTERNACIONAL", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                                {text: "TOTAL DE DISTANCIA RECORRIDA", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                            ],
                            [
                                {text: cartaP.attributes.Version, alignment: 'center', style: 'textoTablaCliente'},
                                {text: cartaP.attributes.TranspInternac, alignment: 'center', style: 'textoTablaCliente'},
                                {text: cartaP.attributes.TotalDistRec, alignment: 'center', style: 'textoTablaCliente'},
                            ]
                        ]
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        var ubicacionesCP = cartaP.elements.find( o => o.name === "cartaporte20:Ubicaciones")
    
        var ubicacionesArray = []
        var uCount = 0
    
        ubicacionesArray[uCount] = [
            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'UBICACIONES', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
            {},
            {},
            {},
            {},
            {},
            {},
        ]
    
        uCount++
    
        ubicacionesArray[uCount] = [
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
        ]
        
        uCount++ 
    
        for(var i=0; i<ubicacionesCP.elements.length; i++)
        {
            //console.log(ubicacionesCP.elements[i].elements[0].attributes)
            var noC = i+1
            if(ubicacionesCP.elements[i].attributes.TipoUbicacion === "Origen")
            {
                ubicacionesArray[uCount] = [
                    {border: [false, false, false, true], fillColor: '#eaa01b', text: 'UBICACIÓN ' + noC, alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                ]
            
                uCount++
        
                ubicacionesArray[uCount] = [
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'TIPO DE UBICACIÓN', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'ID DE UBICACIÓN', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'RFC REMITENTE', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'NOMBRE DEL REMITENTE O DESTINATARIO', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'FECHA Y HORA DE SALIDA O DE LLEGADA', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'DISTANCIA RECORRIDA', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'DOMICILIO', alignment: 'center', style: 'textotablacolor'},
                ]
            
                uCount++
    
                var calle = ubicacionesCP.elements[i].elements[0].attributes.Calle
                if(calle === undefined)
                {
                    calle = ""
                }
    
                var noExterior = ubicacionesCP.elements[i].elements[0].attributes.NumeroExterior;
                if(noExterior === undefined)
                {
                    noExterior = ""
                }
    
                var noInterior = ubicacionesCP.elements[i].elements[0].attributes.NumeroInterior;
                if(noInterior === undefined)
                {
                    noInterior = ""
                }
    
                var referencia = ubicacionesCP.elements[i].elements[0].attributes.Referencia;
                if(referencia === undefined)
                {
                    referencia = ""
                }
    
                var estado = ubicacionesCP.elements[i].elements[0].attributes.Estado;
                if(estado === undefined)
                {
                    estado = ""
                }
    
                var pais = ubicacionesCP.elements[i].elements[0].attributes.Pais;
                if(pais === undefined)
                {
                    pais = ""
                }
    
                var codigoPostal = ubicacionesCP.elements[i].elements[0].attributes.CodigoPostal;
                if(codigoPostal === undefined)
                {
                    codigoPostal = ""
                }
    
                var colonia = ubicacionesCP.elements[i].elements[0].attributes.Colonia;
                var localidad;
                var municipio;
                if(colonia === undefined)
                {
                    colonia = ""
                }
                else {
                    const params = {
                        pvIdState: estado,
                        pvIdCounty : colonia,
                    }
                    console.log(params)
                    const res = await dbcatcatalogs.getUbicZipCodeCounty(params)
                    
                    colonia = "(" + colonia + ") " + (res[0])[0].Description
    
                    var localidad = ubicacionesCP.elements[i].elements[0].attributes.Localidad;
                    if(localidad === undefined)
                    {
                        localidad = ""
                    }
                    else {
                        localidad = "(" + localidad + ") " + (res[0])[0].Location_Desc
                    }
    
                    var municipio = ubicacionesCP.elements[i].elements[0].attributes.Municipio;
                    if(municipio === undefined)
                    {
                        municipio = ""
                    }
                    else {
                        municipio = "(" + municipio + ") " + (res[0])[0].Municipality_Desc
                    }
                }
    
                var domicilio = calle + " " + noExterior + " " + noInterior + " " +  "Col. " + colonia + ", " + localidad + ", " + referencia + municipio + ", " + estado + ", " + pais  + ", " + "C.P. " + codigoPostal
        
                ubicacionesArray[uCount] = [
                    {text: `${ubicacionesCP.elements[i].attributes.TipoUbicacion}`, alignment: 'center', style: 'ubicacionesTexto'},
                    {text: `${ubicacionesCP.elements[i].attributes.IDUbicacion}`, alignment: 'center', style: 'ubicacionesTexto'},
                    {text: `${ubicacionesCP.elements[i].attributes.RFCRemitenteDestinatario}`, alignment: 'center', style: 'ubicacionesTexto'},
                    {text: `${ubicacionesCP.elements[i].attributes.NombreRemitenteDestinatario}`, alignment: 'center', style: 'ubicacionesTexto'},
                    {text: `${ubicacionesCP.elements[i].attributes.FechaHoraSalidaLlegada}`, alignment: 'left', style: 'ubicacionesTexto'},
                    {text: "0", alignment: 'center', style: 'ubicacionesTexto'},
                    {text: domicilio, alignment: 'center', style: 'ubicacionesTexto'},
                ]
        
                uCount++ 
    
                ubicacionesArray[uCount] = [
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                ]
    
                uCount++ 
            }
            else 
            {
                ubicacionesArray[uCount] = [
                    {border: [false, false, false, true], fillColor: '#eaa01b', text: 'UBICACIÓN ' + noC, alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                ]
            
                uCount++
        
                ubicacionesArray[uCount] = [
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'TIPO DE UBICACIÓN', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'ID DE UBICACIÓN', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'RFC REMITENTE', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'NOMBRE DEL REMITENTE O DESTINATARIO', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'FECHA Y HORA DE SALIDA O DE LLEGADA', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'DISTANCIA RECORRIDA', alignment: 'center', style: 'textotablacolor'},
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'DOMICILIO', alignment: 'center', style: 'textotablacolor'},
                ]
            
                uCount++
    
                var calle = ubicacionesCP.elements[i].elements[0].attributes.Calle
                if(calle === undefined)
                {
                    calle = ""
                }
    
                var noExterior = ubicacionesCP.elements[i].elements[0].attributes.NumeroExterior;
                if(noExterior === undefined)
                {
                    noExterior = ""
                }
    
                var noInterior = ubicacionesCP.elements[i].elements[0].attributes.NumeroInterior;
                if(noInterior === undefined)
                {
                    noInterior = ""
                }
    
                var referencia = ubicacionesCP.elements[i].elements[0].attributes.Referencia;
                if(referencia === undefined)
                {
                    referencia = ""
                }
    
                var estado = ubicacionesCP.elements[i].elements[0].attributes.Estado;
                console.log(estado)
                if(estado === undefined)
                {
                    estado = ""
                }
    
                var pais = ubicacionesCP.elements[i].elements[0].attributes.Pais;
                if(pais === undefined)
                {
                    pais = ""
                }
    
                var codigoPostal = ubicacionesCP.elements[i].elements[0].attributes.CodigoPostal;
                if(codigoPostal === undefined)
                {
                    codigoPostal = ""
                }
    
                var colonia = ubicacionesCP.elements[i].elements[0].attributes.Colonia;
                var localidad;
                var municipio;
                if(colonia === undefined)
                {
                    colonia = ""
                }
                else {
                    const params = {
                        pvIdState: estado,
                        pvIdCounty : colonia,
                    }
                    console.log(params)
                    const res = await dbcatcatalogs.getUbicZipCodeCounty(params)
                    
                    colonia = "(" + colonia + ") " + (res[0])[0].Description
    
                    var localidad = ubicacionesCP.elements[i].elements[0].attributes.Localidad;
                    if(localidad === undefined)
                    {
                        localidad = ""
                    }
                    else {
                        localidad = "(" + localidad + ") " + (res[0])[0].Location_Desc
                    }
    
                    var municipio = ubicacionesCP.elements[i].elements[0].attributes.Municipio;
                    if(municipio === undefined)
                    {
                        municipio = ""
                    }
                    else {
                        municipio = "(" + municipio + ") " + (res[0])[0].Municipality_Desc
                    }
                }
    
                var domicilio = calle + " " + noExterior + " " + noInterior + " " +  "Col. " + colonia + ", " + localidad + ", " + referencia + municipio + ", " + estado + ", " + pais  + ", " + "C.P. " + codigoPostal
        
                ubicacionesArray[uCount] = [
                    {text: `${ubicacionesCP.elements[i].attributes.TipoUbicacion}`, alignment: 'center', style: 'ubicacionesTexto'},
                    {text: `${ubicacionesCP.elements[i].attributes.IDUbicacion}`, alignment: 'center', style: 'ubicacionesTexto'},
                    {text: `${ubicacionesCP.elements[i].attributes.RFCRemitenteDestinatario}`, alignment: 'center', style: 'ubicacionesTexto'},
                    {text: `${ubicacionesCP.elements[i].attributes.NombreRemitenteDestinatario}`, alignment: 'center', style: 'ubicacionesTexto'},
                    {text: `${ubicacionesCP.elements[i].attributes.FechaHoraSalidaLlegada}`, alignment: 'left', style: 'ubicacionesTexto'},
                    {text: `${ubicacionesCP.elements[i].attributes.DistanciaRecorrida}`, alignment: 'center', style: 'ubicacionesTexto'},
                    {text: domicilio, alignment: 'center', style: 'ubicacionesTexto'},
                ]
        
                uCount++
    
                ubicacionesArray[uCount] = [
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                    {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                ]
            
                uCount++
            }
        }
    
        var ubicaciones = {
            table: {
                dontBreakRows: true, 
                headerRows: 1,
                widths: [40, 50, 50, 80, 60, 50, "*"],
                body: ubicacionesArray
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        var mercanciasCP = cartaP.elements.find( o => o.name === "cartaporte20:Mercancias")
    
        //console.log(mercanciasCP)
    
        var mercanciasEncabezado = {
            table: {
                headerRows: 3,
                widths: [120, 120, "*"],
                body: [
                    [
                        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'MERCANCÍAS', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:3},
                        {},
                        {},
                    ],
                    [
                        {text: 'PESO BRUTO TOTAL', alignment: 'center', style: 'textoTablaClienteBoldblack'},
                        {text: "UNIDAD DE PESO", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                        {text: "NÚMERO TOTAL DE MERCANCÍAS", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                    ],
                    [
                        {text: mercanciasCP.attributes.PesoBrutoTotal, alignment: 'center', style: 'textoTablaCliente'},
                        {text: mercanciasCP.attributes.UnidadPeso, alignment: 'center', style: 'textoTablaCliente'},
                        {text: mercanciasCP.attributes.NumTotalMercancias, alignment: 'center', style: 'textoTablaCliente'},
                    ]
                ]
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        var mercanciasArray = []
        var mCount = 0
    
        //Para guardar solo las mercancias
        var mercanciasAux = []
        var mAuxC = 0
        for(var y=0; y< mercanciasCP.elements.length; y++)
        {
            if(mercanciasCP.elements[y].name === "cartaporte20:Mercancia")
            {
                mercanciasAux[mAuxC] = mercanciasCP.elements[y]
                mAuxC++
            }
        }
    
        for(var i=0; i<mercanciasAux.length; i++)
        {
            var noC = i+1
            mercanciasArray[mCount] = [
                {fillColor: '#eaa01b', text: 'MERCANCÍA ' + noC, alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
                {},
                {},
                {},
                {},
                {},
                {},
            ]
        
            mCount++
    
            mercanciasArray[mCount] = [
                {fillColor: '#eaa01b', text: 'BIENES TRANSPORTADOS', alignment: 'center', style: 'textotablacolor'},
                {fillColor: '#eaa01b', text: 'DESCRIPCIÓN', alignment: 'center', style: 'textotablacolor'},
                {fillColor: '#eaa01b', text: 'CANTIDAD', alignment: 'center', style: 'textotablacolor'},
                {fillColor: '#eaa01b', text: 'CLAVE UNIDAD', alignment: 'center', style: 'textotablacolor'},
                {fillColor: '#eaa01b', text: 'PESO EN KILOGRAMOS', alignment: 'center', style: 'textotablacolor'},
                {fillColor: '#eaa01b', text: 'VALOR DE LA MERCANCÍA', alignment: 'center', style: 'textotablacolor'},
                {fillColor: '#eaa01b', text: 'MONEDA', alignment: 'center', style: 'textotablacolor'},
            ]
        
            mCount++
    
            var paramsBienesTransportados= {
                pvOptionCRUD: "R",
                pvIdCatalog: mercanciasAux[i].attributes.BienesTransp,
                table: "SAT_Cat_Product_Service_Codes"
            }
        
            var resBienesTransportados = await dbcatcatalogs.getCatalogIdDescription(paramsBienesTransportados)
    
            mercanciasArray[mCount] = [
                {text: `${mercanciasAux[i].attributes.BienesTransp} - ${resBienesTransportados}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${mercanciasAux[i].attributes.Descripcion}`, alignment: 'left', style: 'ubicacionesTexto'},
                {text: `${mercanciasAux[i].attributes.Cantidad}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${mercanciasAux[i].attributes.ClaveUnidad}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${mercanciasAux[i].attributes.PesoEnKg}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${mercanciasAux[i].attributes.ValorMercancia}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${mercanciasAux[i].attributes.Moneda}`, alignment: 'center', style: 'ubicacionesTexto'},
            ]
    
            mCount++
    
            mercanciasArray[mCount] = [
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            ]
        
            mCount++
        }
    
        var mercancias = {
            table: {
                headerRows: 3,
                widths: [70, "*", 50, 60, 60, 50, 50],
                body: mercanciasArray
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        var autotransporteAux = []
        var mAuxT = 0
        for(var y=0; y< mercanciasCP.elements.length; y++)
        {
            if(mercanciasCP.elements[y].name === "cartaporte20:Autotransporte")
            {
                autotransporteAux[mAuxT] = mercanciasCP.elements[y]
                mAuxT++
            }
        }
    
        var autotransporte = {
            table: {
                headerRows: 3,
                widths: [265, "*"],
                body: [
                    [
                        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'AUTOTRANSPORTE', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:2},
                        {},
                    ],
                    [
                        {text: 'PERMISO SCT', alignment: 'center', style: 'textoTablaClienteBoldblack'},
                        {text: "NÚMERO DE PERMISO", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                    ],
                    [
                        {border: [true, false, false, false], text: autotransporteAux[0].attributes.PermSCT, alignment: 'center', style: 'textoTablaCliente'},
                        {border: [true, false, true, false], text: autotransporteAux[0].attributes.NumPermisoSCT, alignment: 'center', style: 'textoTablaCliente'},
                    ]
                ]
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        //console.log(autotransporteAux[0].elements)
    
        var identificacionVehicularCP = autotransporteAux[0].elements.find( o => o.name === "cartaporte20:IdentificacionVehicular")
        //console.log(identificacionVehicularCP)
    
        var identificacionVehicular = {
            table: {
                headerRows: 3,
                widths: [150, "*", 150],
                body: [
                    [
                        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'IDENTIFICACIÓN VEHICULAR', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:3},
                        {},
                        {},
                    ],
                    [
                        {text: 'CONFIGURACIÓN VEHICULAR', alignment: 'center', style: 'textoTablaClienteBoldblack'},
                        {text: "PLACA VEHÍCULO MOTOR", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                        {text: "AÑO MODELO", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                    ],
                    [
                        {border: [true, false, false, false], text: identificacionVehicularCP.attributes.ConfigVehicular, alignment: 'center', style: 'textoTablaCliente'},
                        {border: [true, false, true, false], text: identificacionVehicularCP.attributes.PlacaVM, alignment: 'center', style: 'textoTablaCliente'},
                        {border: [true, false, true, false], text: identificacionVehicularCP.attributes.AnioModeloVM, alignment: 'center', style: 'textoTablaCliente'},
                    ]
                ]
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        var segurosCP = autotransporteAux[0].elements.find( o => o.name === "cartaporte20:Seguros")
        //console.log(segurosCP)
    
        var seguros = {
            table: {
                headerRows: 3,
                widths: ["*", 60, 60, 60, 60, 60, 60],
                body: [
                    [
                        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'SEGUROS', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},
                    ],
                    [
                        {text: 'ASEGURADORA DE RESPONSABILIDAD CIVIL', alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                        {text: "NÚMERO DE PÓLIZA DE SEGURO POR RESPONSABILIDAD CIVIL", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                        {text: "ASEGURADORA DE MEDIO AMBIENTE", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                        {text: "NÚMERO DE PÓLIZA DE SEGURO POR MEDIO AMBIENTE", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                        {text: "ASEGURADORA DE LA CARGA TRANSPORTADA", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                        {text: "NÚMERO DE PÓLIZA DE LA CARGA TRANSPORTADA", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                        {text: "VALOR DE LA PRIMA DEL SEGURO", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                    ],
                    [
                        {text: segurosCP.attributes.AseguraRespCivil, alignment: 'center', style: 'textoTablaCliente'},
                        {text: segurosCP.attributes.PolizaRespCivil, alignment: 'center', style: 'textoTablaCliente'},
                        {text: segurosCP.attributes.AseguraMedAmbiente, alignment: 'center', style: 'textoTablaCliente'},
                        {text: segurosCP.attributes.PolizaMedAmbiente, alignment: 'center', style: 'textoTablaCliente'},
                        {text: segurosCP.attributes.AseguraCarga, alignment: 'center', style: 'textoTablaCliente'},
                        {text: segurosCP.attributes.PolizaCarga, alignment: 'center', style: 'textoTablaCliente'},
                        {text: segurosCP.attributes.PrimaSeguro, alignment: 'center', style: 'textoTablaCliente'},
                    ]
                ]
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'gray';
                },
                vLineColor: function () {
                    return 'gray';
                },
            }	
        }
    
        var docDefinition = {
            pageMargins: [ 20, 30, 20, 50 ],
            footer: function(currentPage, pageCount) {
                return {
                    margin: [ 30, 0, 30, 30 ],
                    columns: [
                        {
                            text: 'ESTE DOCUMENTO ES UNA REPRESENTACIÓN IMPRESA DE UN CFDI 3.3\n CFDI emitido por Garantía Total en Consultoría Tecnológica Avanzada S.A. de C.V. Proveedor Autorizado de Certificación (PAC) 55270\n www.gtcta.mx', style: 'footer', alignment: 'left'
                        },
                        {
                            text: 'Página ' + currentPage.toString() + ' de ' + pageCount, style: 'footer', alignment: 'right'
                        },
                    ]
                }
            },
            content: [
                encabezado,
                "\n",
                cliente, 
                "\n",
                conceptos,
                "\n",
                totales,
                "\n",
                codigos,
                "\n",
                cartaPorte,
                "\n",
                ubicaciones,
                "\n",
                mercanciasEncabezado,
                mercancias,
                "\n",
                autotransporte,
                identificacionVehicular,
                seguros
                
            ],
            pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
            },
            styles: {
                encabezadoRfc: {
                    fontSize: 10,
                    bold: true,
                    color: '#bd8635',
                },
                encabezadoDomicilio: {
                    fontSize: 7,
                    bold: true,
                    color: '#bd8635',
                },
                encabezadoTexto: {
                    fontSize: 7,
                },
                textoTablaTrasladoHeader: {
                    fontSize: 8,
                    color: '#ffffff',
                    bold: true,
                },
                textoTablaClienteHeader: {
                    fontSize: 11,
                    color: '#ffffff',
                    bold: true,
                },
                textoTablaClienteBoldblack: {
                    fontSize: 9,
                    bold: true,
                    color: '#000000',
                },
                textoTablaClienteBoldblack2: {
                    fontSize: 6,
                    bold: true,
                    color: '#000000',
                },
                textoTablaCliente: {
                    fontSize: 8,
                },
                textoTablaCodigo: {
                    fontSize: 6,
                },
                textoTablaCodigoBold: {
                    fontSize: 6,
                    bold: true,
                },
                espacios: {
                    fontSize: 5,
                },
                moneda: {
                    fontSize: 8,
                },
                ubicacionesTexto: {
                    fontSize: 6,
                },
                header: {
                    fontSize: 15,
                    bold: true,
                    color: '#d82b26',
                },
                index: {
                    fontSize: 11,
                    color: '#d82b26',
                },
                indexbackground: {
                    fontSize: 11,
                    color: '#d82b26',
                    bold: true,
                    background: '#eaa01b'
                },
                subheader: {
                    fontSize: 13,
                    bold: true,
                    color: '#d82b26',
                },
                textosubrayado: {
                    fontSize: 9,
                },
                textolista: {
                    fontSize: 7,
                },
                textolista2: {
                    fontSize: 8,
                },
                textotabla: {
                    fontSize: 6.5,
                },
                textotablabold: {
                    fontSize: 6.5,
                    bold: true,
                    color: '#bd8635',
                },
                textotablaboldlarge: {
                    fontSize: 12,
                    bold: true,
                    color: '#bd8635',
                },
                textotablaboldblack: {
                    fontSize: 7,
                    bold: true,
                    color: '#000000',
                },
                textotablacolor: {
                    fontSize: 6.5,
                    color: '#ffffff',
                    bold: true,
                },
                parrafo: {
                    fontSize: 8,
                },
                parrafoBold: {
                    fontSize: 8,
                    bold: true,
                },
                parrafoItalic: {
                    fontSize: 8,
                    italics: true,
                },
                footer: {
                    fontSize: 6,
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 8
                },
                minispace: {
                    fontSize: 3
                }
            }   
        };
        var nameF = nameFile + ".pdf"
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(temporalFilesPath + nameF));
        pdfDoc.end();
        
    } catch (err) {
        console.error(err);
    }

    try {
        fs.unlinkSync(temporalFilesPath + imageQR)
        //file removed
    } catch(err) {
        console.error(err)
    }
}

//getPDFCasaDiaz()

module.exports = {
    getPDFCasaDiaz : getPDFCasaDiaz
}