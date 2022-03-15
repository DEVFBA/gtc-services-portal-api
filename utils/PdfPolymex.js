/*var fonts = {
    Roboto: {
      normal: 'C:/GTC/Fonts/Roboto-Regular.ttf',
      bold: 'C:/GTC/Fonts/Roboto-Bold.ttf',
      italics: 'C:/GTC/Fonts/Montserrat-Italic.ttf',
      bolditalics: 'C:/GTC/Fonts/Montserrat-BoldItalic.ttf'
    }
};*/

var fonts = {
    Roboto: {
      normal: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Roboto-Regular.ttf',
      bold: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Roboto-Bold.ttf',
      italics: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Montserrat-Italic.ttf',
      bolditalics: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Montserrat-BoldItalic.ttf'
    }
};

var convert = require('xml-js');
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");
const xml = require('./xml.js')
const pdf2base64 = require('pdf-to-base64');

const dbcatcatalogs = require('../controllers/cat-catalogs')
const dbcatgeneralparameters = require('../controllers/cat-general-parameters');
const e = require('connect-timeout');

var xml64 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPGNmZGk6Q29tcHJvYmFudGUgeG1sbnM6Y2ZkaT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6c2NoZW1hTG9jYXRpb249Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9jZmQvMyBodHRwOi8vd3d3LnNhdC5nb2IubXgvc2l0aW9faW50ZXJuZXQvY2ZkLzMvY2ZkdjMzLnhzZCIgVmVyc2lvbj0iMy4zIiBTZXJpZT0iUkkiIEZvbGlvPSI5MDA3MSIgRmVjaGE9IjIwMjItMDMtMDhUMTc6MDQ6MTgiIFNlbGxvPSIiIEZvcm1hUGFnbz0iOTkiIE5vQ2VydGlmaWNhZG89IiIgQ2VydGlmaWNhZG89IiIgQ29uZGljaW9uZXNEZVBhZ289IjYwIERJQVMgTkVUT1MiIFN1YlRvdGFsPSI1MDU1NCIgTW9uZWRhPSJNWE4iIFRpcG9DYW1iaW89IjEiIFRvdGFsPSI1ODY0Mi42NCIgVGlwb0RlQ29tcHJvYmFudGU9IkkiIE1ldG9kb1BhZ289IlBQRCIgTHVnYXJFeHBlZGljaW9uPSI3NjI0NiI+Cgk8Y2ZkaTpFbWlzb3IgUmZjPSJJUE02MjAzMjI2QjQiIE5vbWJyZT0iSVRXIFBvbHltZXggUyBERSBSTCBERSBDViIgUmVnaW1lbkZpc2NhbD0iNjAxIi8+Cgk8Y2ZkaTpSZWNlcHRvciBSZmM9IkRNQTk4MDcyNTJWQSIgTm9tYnJlPSJESVNUUklCVUlET1JBIE1BUlBWRUwgREUgQVVUT1BBUlRFUyBTQSAgREUgQ1YiIFVzb0NGREk9IkcwMSIvPgoJPGNmZGk6Q29uY2VwdG9zPgoJCTxjZmRpOkNvbmNlcHRvIENsYXZlUHJvZFNlcnY9IjMxMjAxNjMxIiBOb0lkZW50aWZpY2FjaW9uPSIxMDMtQSIgQ2FudGlkYWQ9IjEwIiBDbGF2ZVVuaWRhZD0iWDRHIiBVbmlkYWQ9IkNBIiBEZXNjcmlwY2lvbj0iSU5GTEEtTExBTlRBUyBRVEYgMzQxRyIgVmFsb3JVbml0YXJpbz0iNzgzLjMwMDAiIEltcG9ydGU9Ijc4MzMuMDAiID4KCQkJPGNmZGk6SW1wdWVzdG9zPgoJCQk8Y2ZkaTpUcmFzbGFkb3M+CgkJCQk8Y2ZkaTpUcmFzbGFkbyBCYXNlPSI3ODMzLjAwIiBJbXB1ZXN0bz0iMDAyIiBUaXBvRmFjdG9yPSJUYXNhIiBUYXNhT0N1b3RhPSIwLjE2MDAwMCIgSW1wb3J0ZT0iMTI1My4yOCIgLz4KCQkJPC9jZmRpOlRyYXNsYWRvcz4KCQkJPC9jZmRpOkltcHVlc3Rvcz4KCQk8L2NmZGk6Q29uY2VwdG8+CgkJPGNmZGk6Q29uY2VwdG8gQ2xhdmVQcm9kU2Vydj0iMzEyMDE2MjciIE5vSWRlbnRpZmljYWNpb249IjE0LUEiIENhbnRpZGFkPSIxMCIgQ2xhdmVVbmlkYWQ9Ilg0RyIgVW5pZGFkPSJDQSIgRGVzY3JpcGNpb249IkZJSkFET1IgVEYgMjQ1IEFaVUwgNk1MIiBWYWxvclVuaXRhcmlvPSIxOTAxLjIwMDAiIEltcG9ydGU9IjE5MDEyLjAwIiA+CgkJCTxjZmRpOkltcHVlc3Rvcz4KCQkJPGNmZGk6VHJhc2xhZG9zPgoJCQkJPGNmZGk6VHJhc2xhZG8gQmFzZT0iMTkwMTIuMDAiIEltcHVlc3RvPSIwMDIiIFRpcG9GYWN0b3I9IlRhc2EiIFRhc2FPQ3VvdGE9IjAuMTYwMDAwIiBJbXBvcnRlPSIzMDQxLjkyIiAvPgoJCQk8L2NmZGk6VHJhc2xhZG9zPgoJCQk8L2NmZGk6SW1wdWVzdG9zPgoJCTwvY2ZkaTpDb25jZXB0bz4KCQk8Y2ZkaTpDb25jZXB0byBDbGF2ZVByb2RTZXJ2PSIzMTIwMTYwMCIgTm9JZGVudGlmaWNhY2lvbj0iMjItQyIgQ2FudGlkYWQ9IjEwIiBDbGF2ZVVuaWRhZD0iWDRHIiBVbmlkYWQ9IkNBIiBEZXNjcmlwY2lvbj0iU0VMTEEgRlVHQVMgUkFESUFET1IgMzU1TUwiIFZhbG9yVW5pdGFyaW89IjQwMS44MDAwIiBJbXBvcnRlPSI0MDE4LjAwIiA+CgkJCTxjZmRpOkltcHVlc3Rvcz4KCQkJPGNmZGk6VHJhc2xhZG9zPgoJCQkJPGNmZGk6VHJhc2xhZG8gQmFzZT0iNDAxOC4wMCIgSW1wdWVzdG89IjAwMiIgVGlwb0ZhY3Rvcj0iVGFzYSIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIEltcG9ydGU9IjY0Mi44OCIgLz4KCQkJPC9jZmRpOlRyYXNsYWRvcz4KCQkJPC9jZmRpOkltcHVlc3Rvcz4KCQk8L2NmZGk6Q29uY2VwdG8+CgkJPGNmZGk6Q29uY2VwdG8gQ2xhdmVQcm9kU2Vydj0iNDcxMzE4MjEiIE5vSWRlbnRpZmljYWNpb249IjI1MTA4IiBDYW50aWRhZD0iMTAiIENsYXZlVW5pZGFkPSJYNEciIFVuaWRhZD0iQ0EiIERlc2NyaXBjaW9uPSJGQVNUIE9SQU5HRSBMSU1QSUFET1IgTUFOT1MgNy4iIFZhbG9yVW5pdGFyaW89IjYyNy4yMDAwIiBJbXBvcnRlPSI2MjcyLjAwIiA+CgkJCTxjZmRpOkltcHVlc3Rvcz4KCQkJPGNmZGk6VHJhc2xhZG9zPgoJCQkJPGNmZGk6VHJhc2xhZG8gQmFzZT0iNjI3Mi4wMCIgSW1wdWVzdG89IjAwMiIgVGlwb0ZhY3Rvcj0iVGFzYSIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIEltcG9ydGU9IjEwMDMuNTIiIC8+CgkJCTwvY2ZkaTpUcmFzbGFkb3M+CgkJCTwvY2ZkaTpJbXB1ZXN0b3M+CgkJPC9jZmRpOkNvbmNlcHRvPgoJCTxjZmRpOkNvbmNlcHRvIENsYXZlUHJvZFNlcnY9IjMxMjAxNjAwIiBOb0lkZW50aWZpY2FjaW9uPSI2MS1BIiBDYW50aWRhZD0iMTAiIENsYXZlVW5pZGFkPSJYNEciIFVuaWRhZD0iQ0EiIERlc2NyaXBjaW9uPSJTT0xEQURVUkEgRU4gRlJJTyBUIDcwRyIgVmFsb3JVbml0YXJpbz0iMTM0MS45MDAwIiBJbXBvcnRlPSIxMzQxOS4wMCIgPgoJCQk8Y2ZkaTpJbXB1ZXN0b3M+CgkJCTxjZmRpOlRyYXNsYWRvcz4KCQkJCTxjZmRpOlRyYXNsYWRvIEJhc2U9IjEzNDE5LjAwIiBJbXB1ZXN0bz0iMDAyIiBUaXBvRmFjdG9yPSJUYXNhIiBUYXNhT0N1b3RhPSIwLjE2MDAwMCIgSW1wb3J0ZT0iMjE0Ny4wNCIgLz4KCQkJPC9jZmRpOlRyYXNsYWRvcz4KCQkJPC9jZmRpOkltcHVlc3Rvcz4KCQk8L2NmZGk6Q29uY2VwdG8+Cgk8L2NmZGk6Q29uY2VwdG9zPgoJPGNmZGk6SW1wdWVzdG9zIFRvdGFsSW1wdWVzdG9zVHJhc2xhZGFkb3M9IjgwODguNjQiPgoJCTxjZmRpOlRyYXNsYWRvcz4KCQkJPGNmZGk6VHJhc2xhZG8gSW1wdWVzdG89IjAwMiIgVGlwb0ZhY3Rvcj0iVGFzYSIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIEltcG9ydGU9IjgwODguNjQiIC8+CgkJPC9jZmRpOlRyYXNsYWRvcz4KCTwvY2ZkaTpJbXB1ZXN0b3M+Cgk8Y2ZkaTpDb21wbGVtZW50bz4KCQk8bGV5ZW5kYXNGaXNjOkxleWVuZGFzRmlzY2FsZXMgVmVyc2lvbj0iMS4wIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOmxleWVuZGFzRmlzYz0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2xleWVuZGFzRmlzY2FsZXMiIHRhcmdldE5hbWVzcGFjZT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2xleWVuZGFzRmlzY2FsZXMiPgoJCQk8bGV5ZW5kYXNGaXNjOkxleWVuZGEgZGlzcG9zaWNpb25GaXNjYWw9IlJHQ0UiIG5vcm1hPSI1LjIuNi4iIHRleHRvTGV5ZW5kYT0iRGUgY29uZm9ybWlkYWQgYWwgYXJ0w61jdWxvIDI5LCBmcmFjY2nDs24gSSBkZSBsYSBMZXkgZGVsIElWQSB5IGxhIHJlZ2xhIDUuMi41LiwgZnJhY2Npw7NuIElJLCBkZSBsYXMgUmVnbGFzIEdlbmVyYWxlcyBkZSBDb21lcmNpbyBFeHRlcmlvciBwYXJhIDIwMjIgc2UgcmVhbGl6YSBsYSBwcmVzZW50ZSBvcGVyYWNpw7NuIGN1bXBsaWVuZG8gY29uIGxvIGVzdGFibGVjaWRvIGVuIGxhcyByZWdsYXMgNC4zLjIxLiB5IDUuMi42LiBTZSB0cmFuc2ZpZXJlIGxhIG1lcmNhbmPDrWEgYSBERUxNRVggREUgSlVBUkVaIFMgREUgUkwgREUgQ1YgcXVpZW4gY3VlbnRhIGNvbiBuw7ptZXJvIGRlIHJlZ2lzdHJvIElNTUVYIDcwMi0yMDA2LiIvPgoJCTwvbGV5ZW5kYXNGaXNjOkxleWVuZGFzRmlzY2FsZXM+Cgk8L2NmZGk6Q29tcGxlbWVudG8+CjwvY2ZkaTpDb21wcm9iYW50ZT4="

async function getPDFPolymex(docBase64, pathLogo, nameFile, domicilioFiscal, nombreEmisor)
{

    try {

        var xmlString = await xml.serializeXML(docBase64)

        var options = {compact: false, ignoreComment: true, spaces: 4};
        const jsonString = convert.xml2json(xmlString, options);
        const jsonData = JSON.parse(jsonString)
        var conceptos = jsonData.elements[0].elements.find( o => o.name === "cfdi:Conceptos")
        var attributes = jsonData.elements[0].attributes
        console.log(attributes)
        var emisor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Emisor")
        var receptor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Receptor")
        var impuestos = jsonData.elements[0].elements.find( o => o.name === "cfdi:Impuestos")
        var trasladosN = impuestos.elements.find( o => o.name === "cfdi:Traslados")
        console.log(trasladosN.elements[0].attributes.Importe)
        /*var complemento = jsonData.elements[0].elements.find( o => o.name === "cfdi:Complemento")
        var timbreFiscal = complemento.elements.find( o => o.name === "tfd:TimbreFiscalDigital")
        var conceptos = jsonData.elements[0].elements.find( o => o.name === "cfdi:Conceptos")
        var cartaP = complemento.elements.find( o => o.name === "cartaporte20:CartaPorte")*/

        var datosEmisor = {
            text: [
                "\n",
                "\n",
                {text: `ITW Polymex S DE RL DE CV\n`, style: 'textotablaboldlarge'},
                {text: "DOMICILIO FISCAL \n", style: 'encabezadoDomicilio'},
                {text: "Carretera Nacional No. 7821\n", style: 'encabezadoTexto'},
                {text: "La Estanzuela\n", style: 'encabezadoTexto'},
                {text: "Monterrey NUEVO LEON, CP: 64988, MEX\n", style: 'encabezadoTexto'},
                {text: "Tel: 50892870\n", style: 'encabezadoTexto'},
                {text: "IPM6203226B4\n", style: 'encabezadoTexto'},
                {text: "Lugar de expedición: " + attributes.LugarExpedicion + "\n", style: 'encabezadoTexto'},
            ]
        }

        /*var paramsTipoComprobante = {
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

        var resRegimenFiscal = await dbcatcatalogs.getCatalogIdDescription(paramsRegimenFiscal)*/

        var encabezado =
        {
            columns: [
                [
                    {text: datosEmisor}
                ],
                [
                    {
                        table: {
                            body: [
                                [
                                    {border: [false, false, false, false], text: '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', alignment: 'center', style: 'textoinvisible'},
                                ],
                                [
                                    {fillColor: "#050583", text:"CFDI versión " + attributes.Version , alignment: 'center', style: 'textotablawhite'},
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
                                return 'black';
                            },
                            vLineColor: function () {
                                return 'black';
                            },
                        }	
                    },
                    { image: pathLogo, width: 180, height: 80, alignment: 'left'},
                    {
                        table: {
                            widths: ["*", 80],
                            body: [
                                [
                                    {fillColor: "#050583", text:"Fecha", alignment: 'center', style: 'textotablawhite'},
                                    {fillColor: "#050583", text:"Factura No.", alignment: 'center', style: 'textotablawhite'},
                                ],
                                [
                                    {text: attributes.Fecha, alignment: 'center', style: 'textotablablack'},
                                    {text: attributes.Serie + attributes.Folio, alignment: 'center', style: 'textotablablack'},
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
                                return 'black';
                            },
                            vLineColor: function () {
                                return 'black';
                            },
                        }	
                    },
                ]
            ]
        }

        var emisorReceptor = 
        {
            table: {
                widths: ["*", 262],
                body: [
                    [
                        {text: 
                            [
                                {text: `Nombre o Razón Social:\n`, style: 'textotablaEmisorReceptor'},
                                {text: `ZONE COMPRA S DE RL DE CV\n`, style: 'textotablaEmisorReceptor'},
                                {text: `GUERRERO 2911-B\n`, style: 'textotablaEmisorReceptor'},
                                {text: `GUERRERO\n`, style: 'textotablaEmisorReceptor'},
                                {text: `NUEVO LAREDO, NUEVO LEON CP:88240\n`, style: 'textotablaEmisorReceptor'},
                                {text: `RFC: ZCO980914I98\t\t\t\t\t\t\t\t\t\t2229911\n`, style: 'textotablaEmisorReceptor'},
                                {text: `Tel: +52 1 81 8155 7200\n`, style: 'textotablaEmisorReceptor'},
                            ]
                        },
                        {text: 
                            [
                                {text: `Consignatario\n`, style: 'textotablaEmisorReceptor'},
                                {text: `ZONE COMPRA, S. DE R.L. DE C.V. (PROV 36509)\n`, style: 'textotablaEmisorReceptor'},
                                {text: `BOULEVARD ZENTRUM 04 MZA. 013\n`, style: 'textotablaEmisorReceptor'},
                                {text: `PARQUE INDUSTRIAL TEPEJI\n`, style: 'textotablaEmisorReceptor'},
                                {text: `TEPEJI DEL RIO DE OCAMPO, HIDALGO, MEX CP.\n`, style: 'textotablaEmisorReceptor'},
                                {text: `42884\n`, style: 'textotablaEmisorReceptor'},
                            ]
                        },
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }	
        }

        var paramsUsoCFDI = {
            pvOptionCRUD: "R",
            pvIdCatalog: receptor.attributes.UsoCFDI,
            table: "SAT_Cat_CFDI_Uses"
        }

        var resUsoCFDI = await dbcatcatalogs.getCatalogIdDescription(paramsUsoCFDI)

        var paramsTipoComprobante = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.TipoDeComprobante,
            table: "SAT_Cat_Receipt_Types"
        }

        var resTipoComprobante = await dbcatcatalogs.getCatalogIdDescription(paramsTipoComprobante);

        var paramsMetodoPago = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.MetodoPago,
            table: "SAT_Cat_Payment_Methods"
        }

        var resMetodoPago = await dbcatcatalogs.getCatalogIdDescription(paramsMetodoPago);

        var paramsFormaPago = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.FormaPago,
            table: "SAT_Cat_Payment_Instruments"
        }

        var resFormaPago = await dbcatcatalogs.getCatalogIdDescription(paramsFormaPago);

        var tipoComprobante = 
        {
            table: {
                widths: [100,120,90,90,"*"],
                body: [
                    [
                        {border: [true, false, true, false], text: `Tipo de comprobante`, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, false], text: `Tipo de Relación entre CFDI`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Clave de Uso de CFDI`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Método de Pago`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Forma de Pago`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                    ],
                    [
                        {border: [true, false, true, true], text: attributes.TipoDeComprobante + " - " +  resTipoComprobante, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, true], text: ``, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: receptor.attributes.UsoCFDI + " - " + resUsoCFDI, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: attributes.MetodoPago + " - " + resMetodoPago, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: attributes.FormaPago + " - " + resFormaPago, style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }	
        }

        var condiciones = 
        {
            table: {
                widths: ["*",90,90,101],
                body: [
                    [
                        {border: [true, false, true, false], text: `Condiciones`, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, false], text: ``, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Fecha Vencimiento`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Orden de Compra`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                    ],
                    [
                        {border: [true, false, true, true], text: attributes.CondicionesDePago, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, true], text: `2462042/SO (TXT)`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: `DATO DE TXT`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: `DATO DE TXT`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }
        }

        var vendedor = 
        {
            table: {
                widths: [80,200,90,"*"],
                body: [
                    [
                        {border: [true, false, true, false], text: `Vendedor`, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, false], text: `Abono Bancario / Transferencia Electrónica`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Referencia Pago`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Referencia Pago Interbarcario`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                    ],
                    [
                        {border: [true, false, true, true], text: `DATO DE TXT`, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, true], text: `DATO DE TXT`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: `DATO DE TXT`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: `DATO DE TXT`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }
        }
        
        var concepts = []
        var psItems = 0;

        concepts[psItems] = [
            {border: [true, true, false, true], text: `Clave Producto`, style: 'textotabla', alignment: "center"},
            {border: [false, true, false, true], text: `Clave SAT`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Descripción`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Unidad`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Clave Unidad`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Cant.`, style: 'textotabla', alignment: "center"},
            {border: [false, true, false, true], text: `Lote`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Piezas`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Precio Unitario`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Base`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Impuesto`, style: 'textotabla', alignment: "center"},
            {border: [false, true, false, true], text: `Factor`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Tasa`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, true, true], text: `Importe`, style: 'textotabla', alignment: "center"}, 
        ]

        psItems++

        //Iteramos cada uno de los conceptos
        for(var i=0; i<conceptos.elements.length; i++)
        {
            var impuestos = conceptos.elements[i].elements.find( o => o.name === "cfdi:Impuestos")
            var traslados = impuestos.elements.find( o => o.name === "cfdi:Traslados")
            
            if(i !== conceptos.elements.length-1)
            {
                concepts[psItems] = [
                    {border: [true, false, false, false], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.Descripcion, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.Lote, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: "PIEZA", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.ValorUnitario, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: traslados.elements[0].attributes.Base, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, false], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, true, false], text: conceptos.elements[i].attributes.Importe, style: 'textotabla', alignment: "center"}, 
                ]
        
                psItems++
            }
            else {
                concepts[psItems] = [
                    {border: [true, false, false, true], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.Descripcion, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.Lote, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: "PIEZA", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.ValorUnitario, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: traslados.elements[0].attributes.Base, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, true], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, true, true], text: conceptos.elements[i].attributes.Importe, style: 'textotabla', alignment: "center"}, 
                ]
        
                psItems++
            }
        }

        var conceptosTable = 
        {
            table: {
                dontBreakRows: true, 
                headerRows: 1,
                widths: [27,35,"*",27,27,27,27,27,27,27,28,27,27,27],
                body: concepts
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }
        }

        //Se arma la CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACIÓN DIGITAL DEL SAT
        /*var version = timbreFiscal.attributes.Version 
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
        }*/

        var cadenaCodigo = {
            text: [
                {text: "Cadena original del complemento de certificación digital del SAT:\n", style: 'textotablaEmisorReceptor'},
                {text: `||1.1|f63a6a0d-90c3-44db-aa8b-c212ce5ee084|2022-01- 04T09:25:08|LSO1306189R5|YDiRYxIKArYynu+fD9xbXPlB1s/Pr3DCrW/AR90UBtWk4d5VpOA6hqsQk/SEBnkrT146wO3KDBwIyf6C2bF3QxVOoANMqDQw3t2DULuUGjF5Ev0B1GCXlgbeQ2tXh0VtspvKF uG8rdflDjZwZ9J2nsgbtm0lAQrUdoST7QhYd2ZCZoanzmwNJTgQLjJgv9hN6hsrDMNFb/NaUH2Qv/frMIzzJktjZxbST9z+x8QgYi3upiFnqrsPyDfN8pUSyO5PeCvOnoPsa1Mn2qtPUOH1PAywwmQqXhSz+Y2 J0XO0A5Cbb7kt7FZrhYbSLAcN0ZTpFl41RuEi2o30/VP+qKittA==|00001000000509846663||\n`, style: 'textotabla'},
                {text: "\n", style: 'espacios'},
                {text: "Sello digital del CFDI:\n", style: 'textotablaEmisorReceptor'},
                {text: `HGhMGnpnVJsxF5knqp78JEUfFjlJCJfIzvp9zA0XsqdwqSy9/rmojti+zopgvZrrsQ+iKRkKpYBKrIvVMx8pcLJ/RZU8cCxRDMYjgLyv6ObNPyxU7sugM72AtoVrbDGgQXRIZSFWQxWSmPGueyTYCqjnZZE2bj5 P7vKvv1BO15cAb5Ove/vXjO/YRiuRiIb0kbukHza/H4wqvJpo8DtxG/eWk6LN1gx8z/WU3NCCj7kRViclQr1n/Ji2tFfoXII/+i6S/kzC9eJDwBwVZzXwQ+kXX4SLdMrsGN6STHpBID+loMwXyV9X4+OXGYWo0Hx E4YU/LmqicYzFsd2X7CER3A==\n`, style: 'textotabla'},
                {text: "\n", style: 'espacios'},
                {text: "Sello digital del SAT:\n", style: 'textotablaEmisorReceptor'},
                {text: `YDiRYxIKArYynu+fD9xbXPlB1s/Pr3DCrW/AR90UBtWk4d5VpOA6hqsQk/SEBnkrT146wO3KDBwIyf6C2bF3QxVOoANMqDQw3t2DULuUGjF5Ev0B1GCXlgbeQ2tXh0VtspvKFuG8rdflDjZwZ9J2nsgbtm0lAQ rUdoST7QhYd2ZCZoanzmwNJTgQLjJgv9hN6hsrDMNFb/NaUH2Qv/frMIzzJktjZxbST9z+x8QgYi3upiFnqrsPyDfN8pUSyO5PeCvOnoPsa1Mn2qtPUOH1PAywwmQqXhSz+Y2J0XO0A5Cbb7kt7FZrhYbSLA cN0ZTpFl41RuEi2o30/VP+qKittA==\n`, style: 'textotabla'},
            ]
        }

        var cadenasTable = 
        {
            table: {
                body: [
                    [
                        cadenaCodigo
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }
        }

        //Se arma el url para el código QR
       /* var finSelloDig = timbreFiscal.attributes.SelloCFD.substr(-8);
        var url = "https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx" + "?&id=" +
                    timbreFiscal.attributes.UUID + "&re=" + emisor.attributes.Rfc + "&rr=" + receptor.attributes.Rfc + "&tt=" + attributes.Total  + "&fe=" + finSelloDig

        var paramsTemporalFiles = {
            pvOptionCRUD: "R",
            piIdParameter: "20",
        }

        var resTemporalFiles = await dbcatgeneralparameters.getGeneralParametersbyID(paramsTemporalFiles)
        //console.log((resTemporalFiles[0])[0].Value)

        var imageQR = timbreFiscal.attributes.UUID + ".png"
        //console.log(imageQR)

        const buffer = await new AwesomeQR({
            text: url,
            size: 500,
        }).draw();

        var temporalFilesPath = (resTemporalFiles[0])[0].Value
        //console.log(temporalFilesPath)
        
        fs.writeFileSync(temporalFilesPath + imageQR, buffer);*/

        var url = "https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx"

        var paramsTemporalFiles = {
            pvOptionCRUD: "R",
            piIdParameter: "20",
        }

        var resTemporalFiles = await dbcatgeneralparameters.getGeneralParametersbyID(paramsTemporalFiles)

        var imageQR = "QRPRUEBA" + ".png"

        const buffer = await new AwesomeQR({
            text: url,
            size: 500,
        }).draw();

        var temporalFilesPath = (resTemporalFiles[0])[0].Value
        //console.log(temporalFilesPath)
        
        fs.writeFileSync(temporalFilesPath + imageQR, buffer);

        var paramsMoneda = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.Moneda,
            table: "SAT_Cat_Currencies"
        }

        var resMoneda = await dbcatcatalogs.getCatalogIdShortDescription(paramsMoneda);
        console.log(resMoneda)

        var totalLetra = numeroALetras(attributes.Total, {
            plural: resMoneda.toUpperCase(),
            singular: resMoneda.toUpperCase(),
        });

        console.log(totalLetra)
        
        var codigos = {
            table: {
                widths: [110, "*", 40,80],
                body: [
                    [
                        {image: temporalFilesPath + imageQR, width: 100, height: 100, alignment: 'center', verticalAlign: 'middle', rowSpan: 3},
                        {border: [false, true, true, true], text:  `DEBO(EMOS) Y PAGARE(MOS) A LA ORDEN DE ITW POLYMEX S DE RL DE CV A LA VISTA LA CANTIDAD INDICADA, PAGOS EFECTUADOS DESPUES DEL VENCIMIENTO CAUSARÁN INTERESES MORATORIOS A RAZÓN DEL % MENSUAL. \n\n ${totalLetra} ${attributes.Moneda}`, alignment: 'left', style: "textotablaEmisorReceptor", rowSpan: 3},
                        {border: [false, true, true, false], text:  "Subtotal", alignment: 'left', style: "textotablatotales"},
                        {border: [false, true, true, false], text:  "$" + Intl.NumberFormat("en-IN").format(attributes.SubTotal), alignment: 'left', style: "textotablatotales"},
                    ],
                    [
                        {},
                        {},
                        {border: [false, false, true, false], text:  "I.V.A. 16%", alignment: 'left', style: "textotablatotales"},
                        {border: [false, false, true, false], text:  "$" + Intl.NumberFormat("en-IN").format(trasladosN.elements[0].attributes.Importe), alignment: 'left', style: "textotablatotales"},
                    ],
                    [
                        {},
                        {},
                        {border: [false, false, true, true], text: "Total", alignment: 'left', style: "textotablatotales"},
                        {border: [false, false, true, true], text:  "$" + Intl.NumberFormat("en-IN").format(attributes.Total), alignment: 'left', style: "textotablatotales"},
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }	
        }

        var docDefinition = {
            pageMargins: [ 25, 10, 25, 50 ],
            footer: function(currentPage, pageCount) {
                return {
                    margin: [ 30, 0, 30, 30 ],
                    columns: [
                        {
                            width: "*",
                            text: 'Este documento es una representación impresa de un CFDI. Régimen fiscal emisor: 601 General de Ley Personas Morales\nFolio Fiscal: f63a6a0d-90c3-44db-aa8b-c212ce5ee084 Fecha de certificación: 2022-01-04T09:25:08\nCertificado del emisor: 00001000000506742308 Certificado del SAT: 00001000000509846663 Consulta nuestro aviso de privacidad en www.itwpolymex.com', style: 'footer', alignment: 'left'
                        },
                        {
                            width: 90,
                            text: 'Página ' + currentPage.toString() + ' de ' + pageCount, style: 'footer', alignment: 'right'
                        },
                    ]
                }
            },
            content: [
                encabezado,
                "\n",
                emisorReceptor,
                tipoComprobante,
                condiciones,
                vendedor,
                "\n",
                conceptosTable,
                "\n",
                cadenasTable, 
                "\n",
                codigos
                /*conceptos,
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
                {text: "\n", style: "textotabla"},
                autotransporte,
                identificacionVehicular,
                seguros,
                "\n",
                figuraTransporte*/
                
            ],
            pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
            },
            styles: {
                textoinvisible: {
                    fontSize: 2,
                    color: '#ffffff',
                },
                encabezadoRfc: {
                    fontSize: 10,
                    bold: true,
                    color: '#bd8635',
                },
                encabezadoDomicilio: {
                    fontSize: 10,
                    color: '#000000',
                },
                encabezadoTexto: {
                    fontSize: 10,
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
                    fontSize: 12,
                    bold: true,
                    color: '#ffffff',
                },
                textotablaboldlarge: {
                    fontSize: 12,
                    bold: true,
                    color: '#000000',
                },
                textotablaboldblack: {
                    fontSize: 7,
                    bold: true,
                    color: '#000000',
                },
                textotablawhite: {
                    fontSize: 11,
                    color: '#ffffff',
                },
                textotablablack: {
                    fontSize: 11,
                },
                textotablaEmisorReceptor: {
                    fontSize: 9,
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
                },
                textotablatotales: {
                    fontSize: 8
                }
            }   
        };

        var nameF = nameFile + ".pdf"
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream("Documento.pdf"));
        pdfDoc.end();

        
        /*return new Promise( ( resolve, reject ) => {

            var pdfDoc = printer.createPdfKitDocument(docDefinition);
            fs.unlinkSync(temporalFilesPath + imageQR)

            var chunks = [];
            var result;
            var base64 = '';

            pdfDoc.on('data', function (chunk) {
                chunks.push(chunk);
            });
            
            pdfDoc.on('end', function () {

                result = Buffer.concat(chunks);

                base64 = result.toString('base64');

                resolve(base64);

            });

            pdfDoc.on('error', (error) => {
                
                console.log(error);
                
                reject('')

            });

            pdfDoc.end();

        });*/

    } catch (err) {

        console.error('Error: ', err)

    }
    
}

//getPDFCasaDiaz(xml646, "/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/images/Logo_Casa_Diaz.jpg", "./Documento" , "DOMICILIO DEL CLIENTE", "CASA DÍAZ MÁQUINAS DE COSER S.A. DE C.V.")
getPDFPolymex(xml64, "/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/images/Logo_Polymex.png", "./Documento" , "DOMICILIO DEL CLIENTE", "CASA DÍAZ MÁQUINAS DE COSER S.A. DE C.V.")

var numeroALetras = (function() {
    
    function Unidades(num) {

        switch (num) {
            case 1:
                return 'UN';
            case 2:
                return 'DOS';
            case 3:
                return 'TRES';
            case 4:
                return 'CUATRO';
            case 5:
                return 'CINCO';
            case 6:
                return 'SEIS';
            case 7:
                return 'SIETE';
            case 8:
                return 'OCHO';
            case 9:
                return 'NUEVE';
        }

        return '';
    } //Unidades()

    function Decenas(num) {

        let decena = Math.floor(num / 10);
        let unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0:
                        return 'DIEZ';
                    case 1:
                        return 'ONCE';
                    case 2:
                        return 'DOCE';
                    case 3:
                        return 'TRECE';
                    case 4:
                        return 'CATORCE';
                    case 5:
                        return 'QUINCE';
                    default:
                        return 'DIECI' + Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0:
                        return 'VEINTE';
                    default:
                        return 'VEINTI' + Unidades(unidad);
                }
            case 3:
                return DecenasY('TREINTA', unidad);
            case 4:
                return DecenasY('CUARENTA', unidad);
            case 5:
                return DecenasY('CINCUENTA', unidad);
            case 6:
                return DecenasY('SESENTA', unidad);
            case 7:
                return DecenasY('SETENTA', unidad);
            case 8:
                return DecenasY('OCHENTA', unidad);
            case 9:
                return DecenasY('NOVENTA', unidad);
            case 0:
                return Unidades(unidad);
        }
    } //Unidades()

    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + Unidades(numUnidades)

        return strSin;
    } //DecenasY()

    function Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0)
                    return 'CIENTO ' + Decenas(decenas);
                return 'CIEN';
            case 2:
                return 'DOSCIENTOS ' + Decenas(decenas);
            case 3:
                return 'TRESCIENTOS ' + Decenas(decenas);
            case 4:
                return 'CUATROCIENTOS ' + Decenas(decenas);
            case 5:
                return 'QUINIENTOS ' + Decenas(decenas);
            case 6:
                return 'SEISCIENTOS ' + Decenas(decenas);
            case 7:
                return 'SETECIENTOS ' + Decenas(decenas);
            case 8:
                return 'OCHOCIENTOS ' + Decenas(decenas);
            case 9:
                return 'NOVECIENTOS ' + Decenas(decenas);
        }

        return Decenas(decenas);
    } //Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    } //Seccion()

    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
        let strCentenas = Centenas(resto);

        if (strMiles == '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    } //Miles()

    function Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
        let strMiles = Miles(resto);

        if (strMillones == '')
            return strMiles;

        return strMillones + ' ' + strMiles;
    } //Millones()

    return function NumeroALetras(num, currency) {
        currency = currency || {};
        let data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: '',
            letrasMonedaPlural: currency.plural, 
            letrasMonedaSingular: currency.singular, 
            letrasMonedaCentavoPlural: currency.centPlural,
            letrasMonedaCentavoSingular: currency.centSingular
        };

        /*if (data.centavos > 0) {
            data.letrasCentavos = 'CON ' + (function() {
                if (data.centavos == 1)
                    return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
                else
                    return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
            })();
        };*/

        data.letrasCentavos = data.centavos+"/100"

        if (data.enteros == 0)
            return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        if (data.enteros == 1)
            return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
        else
            return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    };

})();

module.exports = {
    getPDFPolymex : getPDFPolymex
}