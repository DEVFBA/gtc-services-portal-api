var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

const logger = require('../utils/logger');

var objeto = {
    generales: {
        currency: 'MXN',
        receiptType: 'I',
        paymentMethod: 'EX1',
        serie: 'GI',
        paymentInstrument: '27'
    },
    emisor: {
        rfc: 'GTC140218GX2',
        nombreRazon: 'Garantía Total en Consultoría Tecnológica Avanzada SA de CV',
        idTaxRegimen: '601',
        lugarExpedicion: '03230'
    },
    receptor: {
        rfc: { value: 'HEOA961021BE4', label: 'HEOA961021BE4' },
        nombreRazon: 'Alexis Hernández Olvera',
        cfdiUse: { value: '15', label: '15 - ADUANA' },
        domicilioFiscal: '61080',
        taxRegime: { value: '601', label: '601 - General de Ley Personas Morales' }
    },
    conceptos: {
        dataConceptos: [ 
            {
                Cantidad: '2',
                Id_Item: 'ITEM-002',
                Clave_Producto_Desc: 'Animales vivos de granja',
                Clave_Producto: '10101500',
                Descripcion: 'Animales vivos de granja',
                Precio_Unitario: '2',
                Clave_Unidad: 'EX7',
                Clave_Unidad_Desc: 'Clave Unidad EX7',
                Objeto_Impuesto: '02',
                Objeto_Impuesto_Desc: 'Si objeto de impuesto',
                Subtotal: 4,
                Impuestos: [ 
                    { 
                        Traslados: [ 
                            { 
                                Traslado_Importe: 8, 
                                Traslado_Objeto: {
                                    Id_Item_Taxes: 2,
                                    Id_Customer: 1,
                                    Customer: 'Garantía Total en Consultoría Tecnológica Avanzada SA de CV',
                                    Id_Item: 'ITEM-002',
                                    Item: 'EJEMPLO 1',
                                    Id_Factor_Type: '001',
                                    Factor_Type: 'Tasa',
                                    Id_Tax: '001',
                                    Tax: 'ISR',
                                    Tax_Type: 'T',
                                    Tax_Value: 2,
                                    Status: true,
                                    Modify_By: 'AHERNANDEZ',
                                    Modify_Date: '2022-07-20T15:07:26.323Z',
                                    Modify_IP: '192.168.1.254'
                                }
                            }
                        ] 
                    }, 
                    { 
                        Retenciones: [
                            { 
                                Retencion_Importe: 8, 
                                Retencion_Objeto: {
                                    Id_Item_Taxes: 2,
                                    Id_Customer: 1,
                                    Customer: 'Garantía Total en Consultoría Tecnológica Avanzada SA de CV',
                                    Id_Item: 'ITEM-002',
                                    Item: 'EJEMPLO 1',
                                    Id_Factor_Type: '001',
                                    Factor_Type: 'Tasa',
                                    Id_Tax: '001',
                                    Tax: 'ISR',
                                    Tax_Type: 'T',
                                    Tax_Value: 2,
                                    Status: true,
                                    Modify_By: 'AHERNANDEZ',
                                    Modify_Date: '2022-07-20T15:07:26.323Z',
                                    Modify_IP: '192.168.1.254'
                                }
                            }
                        ] 
                    } 
                ],
                Traslados: 8,
                Retenciones: 0,
                Total: 12
            },
            {
                Cantidad: '2',
                Id_Item: 'ITEM-003',
                Clave_Producto_Desc: 'Gatos vivos',
                Clave_Producto: '10101501',
                Descripcion: 'Gatos vivos',
                Precio_Unitario: '2',
                Clave_Unidad: 'EX7',
                Clave_Unidad_Desc: 'Clave Unidad EX7',
                Objeto_Impuesto: '02',
                Objeto_Impuesto_Desc: 'Si objeto de impuesto',
                Subtotal: 4,
                Impuestos: [
                    {
                        Traslados: [
                            {
                                Traslado_Importe: 932,
                                Traslado_Objeto: {
                                    Id_Item_Taxes: 3,
                                    Id_Customer: 1,
                                    Customer: 'Garantía Total en Consultoría Tecnológica Avanzada SA de CV',
                                    Id_Item: 'ITEM-003',
                                    Item: 'EJEMPLO 2',
                                    Id_Factor_Type: '001',
                                    Factor_Type: 'Tasa',
                                    Id_Tax: '001',
                                    Tax: 'ISR',
                                    Tax_Type: 'T',
                                    Tax_Value: 233,
                                    Status: true,
                                    Modify_By: 'ahernandez@gtcta.mx',
                                    Modify_Date: '2022-07-20T15:27:17.097Z',
                                    Modify_IP: '189.225.242.76'
                                }
                            },
                            {
                                Traslado_Importe: 0.16,
                                Traslado_Objeto: {
                                    Id_Item_Taxes: 6,
                                    Id_Customer: 1,
                                    Customer: 'Garantía Total en Consultoría Tecnológica Avanzada SA de CV',
                                    Id_Item: 'ITEM-003',
                                    Item: 'EJEMPLO 2',
                                    Id_Factor_Type: '001',
                                    Factor_Type: 'Tasa',
                                    Id_Tax: '003',
                                    Tax: 'IEPS',
                                    Tax_Type: 'T',
                                    Tax_Value: 0.04,
                                    Status: true,
                                    Modify_By: 'ahernandez@gtcta.mx',
                                    Modify_Date: '2022-07-26T13:36:02.410Z',
                                    Modify_IP: '187.190.159.211'
                                }
                            }
                        ] 
                    },
                    { 
                        Retenciones: [] 
                    }
                ], 
                Traslados: 932.16,
                Retenciones: 0,
                Total: 936.16
            }
        ],
        subtotal: 8,
        traslados: 940.16,
        retenciones: 0,
        total: 948.16
    }
}

async function getInvoices(){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCustomer_Items_Taxes_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getInvoice(idCustomer){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdCustomer', sql.Int, idCustomer)
            .execute('spCustomer_Items_Taxes_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

//Insertar una factura
async function insertInvoice(register){
    //console.log(register.conceptos.dataConceptos[0].Impuestos[0].Traslados[0].Traslado_ISR_Objeto)
    crearXML(register);
    /*try{
        let pool = await sql.connect(config);
        let insertRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdItem', sql.VarChar, register.pvIdItem)
            .input('pvIdFactorType', sql.VarChar, register.pvIdFactorType)
            .input('pvIdTax', sql.VarChar, register.pvIdTax)
            .input('pvTaxType', sql.VarChar, register.pvTaxType)
            .input('pvTaxValue', sql.VarChar, register.pvTaxValue)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_Items_Taxes_CRUD_Records')
        console.log(JSON.stringify(insertRegister.recordsets[0][0])); 
        return insertRegister.recordsets
    }catch(error){
        console.log(error)
    }*/
}

//Actualizar una factura
async function updateInvoice(register){
    console.log(register)
    try{
        let pool = await sql.connect(config);
        let updateRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('piIdItemTaxes', sql.Int, register.piIdItemTaxes)
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdItem', sql.VarChar, register.pvIdItem)
            .input('pvIdFactorType', sql.VarChar, register.pvIdFactorType)
            .input('pvIdTax', sql.VarChar, register.pvIdTax)
            .input('pvTaxType', sql.VarChar, register.pvTaxType)
            .input('pvTaxValue', sql.VarChar, register.pvTaxValue)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_Items_Taxes_CRUD_Records')
        console.log(JSON.stringify(updateRegister.recordsets[0][0])); 
        return updateRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

async function crearXML(dataInvoice)
{
    try{
        logger.info('**************************************************************');
        logger.info('       Función crearXML.');
        logger.info('**************************************************************');
        //Para armar el string de todo el XML
        var xmlPadre;

        //Agregamos encabezado de XML
        xmlPadre = `<?xml version="1.0" encoding="utf-8"?>`

        logger.info('Creando la fecha de creación del XML.');

        /***        ATRIBUTOS GLOBALES DEL XML         ***/

        var date = new Date()
        var year = date.getFullYear();
        var month;
        if((date.getMonth() + 1) < 10)
        {
            month = "0" + (date.getMonth() + 1);
        }
        else {
            month = (date.getMonth() + 1);
        }
        
        var day;
        if(date.getDay()  < 10)
        {
            day = "0" + date.getDay();
        }
        else {
            day = date.getDay();
        }

        var hours;
        if(date.getHours() < 10)
        {
            hours = "0" + date.getHours();
        }
        else {
            hours = date.getHours();
        }

        var minutes;
        if(date.getMinutes() < 10)
        {
            minutes = "0" + date.getMinutes();
        }
        else {
            minutes = date.getMinutes();
        }

        var seconds;
        if(date.getSeconds() < 10)
        {
            seconds = "0" + date.getSeconds();
        }
        else {
            seconds = date.getSeconds();
        }

        var fechaFormat = year + "-" +  month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;

        logger.info('Obteniendo los atributos generales del XML.');

        var xmlns_cfdi = "http://www.sat.gob.mx/cfd/4";
        var xmlns_xsi = "http://www.w3.org/2001/XMLSchema-instance";
        var xsi_schemaLocation = "http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd http://www.sat.gob.mx/leyendasFiscales http://www.sat.gob.mx/sitio_internet/cfd/leyendasFiscales/leyendasFisc.xsd";
        var xmlns_leyendasFisc = "http://www.sat.gob.mx/leyendasFiscales";
        var version             = "4.0";
        var serie               = dataInvoice.generales.serie;
        var folio               = "";
        var fecha               = fechaFormat;
        //var sello               = "";
        var formaPago           = dataInvoice.generales.paymentInstrument;
        //var noCertificado       = "";
        //var certificado         = "";
        var condicionesPago     = "";
        var subTotal            = dataInvoice.conceptos.subtotal;
        var descuento           = "";
        var moneda              = dataInvoice.generales.currency;
        var tipoCambio          = "";
        var total               = dataInvoice.conceptos.total;
        var tipoDeComprobante   = dataInvoice.generales.receiptType;
        var exportacion         = "";
        var metodoPago          = dataInvoice.generales.paymentMethod;
        var lugarExpedicion     = dataInvoice.emisor.lugarExpedicion;
        var confirmacion        = "";

        logger.info('Colocando los atributos generales en el XML.');

        xmlPadre = xmlPadre + `<cfdi:Comprobante xmlns:cfdi="` + xmlns_cfdi + `" xmlns:xsi="` + xmlns_xsi + `" xsi:schemaLocation="` + xsi_schemaLocation + `" Version="` + version + `" Serie="` + serie + `" Folio="` + folio + `" Fecha="` + fecha + `" Sello=""` + ` FormaPago="` + formaPago + `" NoCertificado=""` + ` Certificado=""`;
        //Atributo opcional
        if(condicionesPago !== "")
        {
            xmlPadre = xmlPadre + ` CondicionesDePago="` + condicionesPago;
        }

        xmlPadre = xmlPadre + ` SubTotal="` + subTotal + `"`;

        //Atributo opcional
        if(descuento !== "")
        {
            xmlPadre = xmlPadre + ` Descuento="` + descuento + `"`;
        }

        xmlPadre = xmlPadre + ` Moneda="` + moneda + `"`;

        //Atributo opcional
        if(tipoCambio !== "")
        {
            xmlPadre = xmlPadre + ` TipoCambio="` + tipoCambio + `"`;
        }

        xmlPadre = xmlPadre + ` Total="` + total + `"`;

        xmlPadre = xmlPadre + ` TipoDeComprobante="` + tipoDeComprobante + `"`;

        xmlPadre = xmlPadre + ` MetodoPago="` + metodoPago + `"`;

        xmlPadre = xmlPadre + ` LugarExpedicion="` + lugarExpedicion + `"`;

        //Atributo opcional
        if(confirmacion !== "")
        {
            xmlPadre = xmlPadre + ` TipoCambio="` + tipoCambio + `"`;
        }

        xmlPadre = xmlPadre + `>`;
        
        /***        EMISOR         ***/
        logger.info('Obteniendo la información del Emisor.');
        var xmlEmisor; 
        var rfcEmisor           = dataInvoice.emisor.rfc;
        var nombreEmisor        = "";
        var regimenFiscalEmisor = dataInvoice.emisor.idTaxRegimen;
        var facAtrAdquirente    = "";
        //Validar que el nombre tenga entre 1 y 300 caracteres
        if(verifyLengthMin(dataInvoice.emisor.nombreRazon, 1) === true && verifyLengthMax(dataInvoice.emisor.nombreRazon, 300) === true)
        {
            logger.info('Verificando el nombre del Emisor.');
            nombreEmisor = dataInvoice.emisor.nombreRazon;
        }
        else {
            logger.info('ERROR. El nombre del Emisor no cumple con las especificaciones del SAT.');
            //EL NOMBRE DEL EMISOR NO CUMPLE CON LAS ESPECIFICACIONES DEL SAT, ENVIAR ERROR
        }

        logger.info('Colocando el nodo Emisor en el XML.');
        xmlEmisor = `<cfdi:Emisor Rfc="` + rfcEmisor + `" Nombre="` + nombreEmisor + `" RegimenFiscal="` + regimenFiscalEmisor + `"`;

        //Atributo opcional
        if(facAtrAdquirente !== "")
        {
            xmlEmisor = xmlEmisor + ` FacAtrAdquirente="` + facAtrAdquirente + `"`;
        }

        xmlEmisor = xmlEmisor + `/>`;
        
        xmlPadre = xmlPadre + xmlEmisor; 

        /***        RECEPTOR         ***/
        logger.info('Obteniendo la información del Receptor.');
        var xmlReceptor; 
        var rfcReceptor             = dataInvoice.receptor.rfc.value;
        var nombreReceptor          = "";
        var domicilioFiscalReceptor = dataInvoice.receptor.domicilioFiscal;
        var residenciaFiscal        = "";
        var numRegIdTrib            = "";
        var regimenFiscalReceptor   = dataInvoice.receptor.taxRegime.value;
        var usoCFDIReceptor         = dataInvoice.receptor.cfdiUse.value;
        
        //Validar que el nombre tenga entre 1 y 300 caracteres
        if(verifyLengthMin(dataInvoice.receptor.nombreRazon, 1) === true && verifyLengthMax(dataInvoice.receptor.nombreRazon, 300) === true)
        {
            logger.info('Verificando el nombre del Receptor.');
            nombreReceptor = dataInvoice.receptor.nombreRazon;
        }
        else {
            //EL NOMBRE DEL EMISOR NO CUMPLE CON LAS ESPECIFICACIONES DEL SAT, ENVIAR ERROR
            logger.info('ERROR. El nombre del Receptor no cumple con las especificaciones del SAT.');
        }

        logger.info('Colocando el nodo Receptor en el XML.');
        xmlReceptor = `<cfdi:Receptor Rfc="` + rfcReceptor + `" Nombre="` + nombreReceptor + `" DomicilioFiscalReceptor="` + domicilioFiscalReceptor + `"`;

        //Atributo opcional
        if(residenciaFiscal !== "")
        {
            xmlReceptor = xmlReceptor + ` ResidenciaFiscal="` + residenciaFiscal + `"`;
        }

        //Atributo opcional
        if(numRegIdTrib !== "")
        {
            xmlReceptor = xmlReceptor + ` NumRegIdTrib="` + numRegIdTrib + `"`;
        }

        xmlReceptor = xmlReceptor + ` RegimenFiscalReceptor="` + regimenFiscalReceptor + `"`;

        xmlReceptor = xmlReceptor + ` UsoCFDI="` + usoCFDIReceptor + `"`;

        xmlReceptor = xmlReceptor + `/>`;
        
        xmlPadre = xmlPadre + xmlReceptor; 

        /***        CONCEPTOS         ***/
        logger.info('Obteniendo la información de los Conceptos.');
        var xmlConceptos;
        xmlConceptos = `<cfdi:Conceptos>`
        for(var i=0; i<dataInvoice.conceptos.dataConceptos.length; i++)
        {
            xmlConceptos = xmlConceptos + `<cfdi:Concepto`

            var claveProdServ       = dataInvoice.conceptos.dataConceptos[i].Clave_Producto;
            var noIdentificacion    = dataInvoice.conceptos.dataConceptos[i].No_Identificacion;
            var cantidad            = dataInvoice.conceptos.dataConceptos[i].Cantidad;
            var claveUnidad         = dataInvoice.conceptos.dataConceptos[i].Clave_Unidad;
            var unidad              = dataInvoice.conceptos.dataConceptos[i].Unidad;
            var descripcion         = dataInvoice.conceptos.dataConceptos[i].Descripcion;
            var valorUnitario       = dataInvoice.conceptos.dataConceptos[i].Precio_Unitario;
            var importe             = dataInvoice.conceptos.dataConceptos[i].Total;
            var descuento           = dataInvoice.conceptos.dataConceptos[i].Descuento;
            var objetoImp           = dataInvoice.conceptos.dataConceptos[i].Objeto_Impuesto;
            
            logger.info('Colocando nodo Concepto en el XML.');
            xmlConceptos = xmlConceptos + ` ClaveProdServ="` + claveProdServ + `"`

            //Atributo opcional
            if(noIdentificacion !== undefined)
            {
                xmlConceptos = xmlConceptos + ` NoIdentificacion="` + noIdentificacion + `"`;
            }

            xmlConceptos = xmlConceptos + ` Cantidad="` + cantidad + `"`

            xmlConceptos = xmlConceptos + ` ClaveUnidad="` + claveUnidad + `"`

            //Atributo opcional
            if(unidad !== undefined)
            {
                xmlConceptos = xmlConceptos + ` Unidad="` + unidad + `"`;
            }

            xmlConceptos = xmlConceptos + ` Descripcion="` + descripcion + `"`

            xmlConceptos = xmlConceptos + ` ValorUnitario="` + valorUnitario + `"`

            xmlConceptos = xmlConceptos + ` Importe="` + importe + `"`

            //Atributo opcional
            if(descuento !== undefined)
            {
                xmlConceptos = xmlConceptos + ` Descuento="` + descuento + `"`;
            }

            xmlConceptos = xmlConceptos + ` ObjetoImp="` + objetoImp + `"`

            xmlConceptos = xmlConceptos + `>`

            /***   IMPUESTOS DE LOS CONCEPTOS */
            if(dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados.length > 0 || dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones.length > 0)
            {
                logger.info('Obteniendo la información de los Impuestos de los Conceptos que los incluyan.');
                var xmlConceptosImpuestos; 
                xmlConceptosImpuestos = `<cfdi:Impuestos>`

                /**** IMPUESTOS - TRASLADOS */
                if(dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados.length > 0)
                {
                    logger.info('Obteniendo la información de los Impuestos - Traslados de los Conceptos que los incluyan.');
                    xmlConceptosImpuestos = xmlConceptosImpuestos + `<cfdi:Traslados>`
                    for(var j=0; j<dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados.length; j++)
                    {
                        /*******************CONTINUAR */
                        console.log(dataInvoice.conceptos.dataConceptos[i])
                        var base        = dataInvoice.conceptos.dataConceptos[i].Subtotal;
                        var impuesto    = dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados[j].Traslado_Objeto.Id_Tax;
                        var tipoFactor  = dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados[j].Traslado_Objeto.Factor_Type;
                        var tasaOCuota  = dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados[j].Traslado_Objeto.Tax_Value;
                        var importe     = dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados[j].Traslado_Importe;

                        logger.info('Colocando nodo Impuesto - Traslado en el XML.');
                        xmlConceptosImpuestos = xmlConceptosImpuestos + `<cfdi:Traslado` + ` Base="` + base + `" Impuesto="` + impuesto + `" TipoFactor="` + tipoFactor + `"`

                        //Atributo opcional
                        if(tasaOCuota !== undefined)
                        {
                            xmlConceptosImpuestos = xmlConceptosImpuestos + ` TasaOCuota="` + tasaOCuota + `"`;
                        }

                        //Atributo opcional
                        if(importe !== undefined)
                        {
                            xmlConceptosImpuestos = xmlConceptosImpuestos + ` Importe="` + importe + `"`;;
                        }

                        xmlConceptosImpuestos = xmlConceptosImpuestos + `/>`
                    }
                    xmlConceptosImpuestos = xmlConceptosImpuestos + `</cfdi:Traslados>`
                }

                /**** IMPUESTOS - RETENCIONES */
                if(dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones.length > 0)
                {
                    logger.info('Obteniendo la información de los Impuestos - Retenciones de los Conceptos que los incluyan.');
                    xmlConceptosImpuestos = xmlConceptosImpuestos + `<cfdi:Retenciones>`
                    for(var j=0; j<dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones.length; j++)
                    {
                        var base        = dataInvoice.conceptos.dataConceptos[i].Subtotal;
                        var impuesto    = dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones[j].Retencion_Objeto.Id_Tax;
                        var tipoFactor  = dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones[j].Retencion_Objeto.Factor_Type;
                        var tasaOCuota  = dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones[j].Retencion_Objeto.Tax_Value;
                        var importe     = dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones[j].Retencion_Importe;

                        logger.info('Colocando nodo Impuesto - Retencion en el XML.');
                        xmlConceptosImpuestos = xmlConceptosImpuestos + `<cfdi:Retencion` + ` Base="` + base + `" Impuesto="` + impuesto + `" TipoFactor="` + tipoFactor + `" TasaOCuota="` + tasaOCuota + `" Importe="` + importe + `"/>`;

                        //Atributo requerido
                        if(tasaOCuota === undefined)
                        {
                            //MANDAR ERROR, ESTE ATRIBUTO ES OBLIGATORIO
                            logger.info('ERROR. La Tasa O Cuota del Impuesto - Retención es OBLIGATORIO.');
                        }

                        //Atributo requerido
                        if(importe === undefined)
                        {
                            //MANDAR ERROR, ESTE ATRIBUTO ES OBLIGATORIO
                            logger.info('ERROR. El Importe del Impuesto - Retención es OBLIGATORIO.');
                        }
                    }
                    xmlConceptosImpuestos = xmlConceptosImpuestos + `</cfdi:Retenciones>`
                }

                xmlConceptosImpuestos = xmlConceptosImpuestos + `</cfdi:Impuestos>`
                xmlConceptos =  xmlConceptos + xmlConceptosImpuestos;
            }
            
            xmlConceptos = xmlConceptos + `</cfdi:Concepto>`

        }
        xmlConceptos = xmlConceptos + `<cfdi:Conceptos>`

        xmlPadre = xmlPadre + xmlConceptos;

        /**** AQUI VAN LOS IMPUESTOS */
        //PRIMERO SE COLOCA LA ETIQUETA DE IMPUESTOS GLOBAL
        var xmlImpuestos;
        var areThereTaxes = false;
        for(var i=0; i<dataInvoice.conceptos.dataConceptos.length; i++)
        {
            if(dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados.length > 0 || dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones.length > 0)
            {
                areThereTaxes = true;
                //Acabamos el ciclo porque al menos si hay un impuesto que colocar
                i = dataInvoice.conceptos.dataConceptos.length;
            }
        }

        if(areThereTaxes === true)
        {
            logger.info('Obteniendo la información de los Impuestos.');
            xmlImpuestos = `<cfdi:Impuestos>`;

            //SE COLOCA LA ETIQUETA DE IMPUESTOS - RETENCIONES GLOBAL
            var areThereTaxesR = false;
            for(var i=0; i<dataInvoice.conceptos.dataConceptos.length; i++)
            {
                if(dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones.length > 0)
                {
                    areThereTaxesR = true;
                    //Acabamos el ciclo porque al menos si hay un impuesto que colocar
                    i = dataInvoice.conceptos.dataConceptos.length;
                }
            }

            //SE COLOCAN TODOS LOS IMPUESTOS - RETENCIONES
            if(areThereTaxesR === true)
            {
                logger.info('Obteniendo la información de los Impuestos - Retenciones.');
                xmlImpuestos = xmlImpuestos + `<cfdi:Retenciones>`
                for(var i=0; i<dataInvoice.conceptos.dataConceptos.length; i++)
                {
                    if(dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones.length > 0)
                    {
                        for(var j=0; j<dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones.length; j++)
                        {
                            var impuesto    = dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones[j].Retencion_Objeto.Id_Tax;
                            var importe     = dataInvoice.conceptos.dataConceptos[i].Impuestos[1].Retenciones[j].Retencion_Importe;

                            logger.info('Colocando nodo de Impuestos - Retenciones.');
                            xmlImpuestos = xmlImpuestos + `<cfdi:Retencion` + ` Base="` + base + `" Impuesto="` + impuesto + `"/>`;

                            //Atributo requerido
                            if(importe !== undefined)
                            {
                                //MANDAR ERROR, ESTE ATRIBUTO ES OBLIGATORIO
                                logger.info('ERROR. El importe del Impuesto - Retención es OBLIGATORIO.');
                            }
                        }
                    }
                }
                xmlImpuestos = xmlImpuestos + `</cfdi:Retenciones>`
            }

            //SE COLOCA LA ETIQUETA DE IMPUESTOS - TRASLADOS GLOBAL
            var areThereTaxesT = false;
            for(var i=0; i<dataInvoice.conceptos.dataConceptos.length; i++)
            {
                if(dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados.length > 0)
                {
                    areThereTaxesT = true;
                    //Acabamos el ciclo porque al menos si hay un impuesto que colocar
                    i = dataInvoice.conceptos.dataConceptos.length;
                }
            }

            //SE COLOCAN TODOS LOS IMPUESTOS - TRASLADOS
            if(areThereTaxesT === true)
            {
                logger.info('Obteniendo la información de los Impuestos - Traslados.');
                xmlImpuestos = xmlImpuestos + `<cfdi:Traslados>`
                for(var i=0; i<dataInvoice.conceptos.dataConceptos.length; i++)
                {
                    /**** IMPUESTOS - TRASLADOS */
                    if(dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados.length > 0)
                    {
                        for(var j=0; j<dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados.length; j++)
                        {
                            /*******************CONTINUAR */
                            console.log(dataInvoice.conceptos.dataConceptos[i])
                            var base        = dataInvoice.conceptos.dataConceptos[i].Subtotal;
                            var impuesto    = dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados[j].Traslado_Objeto.Id_Tax;
                            var tipoFactor  = dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados[j].Traslado_Objeto.Factor_Type;
                            var tasaOCuota  = dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados[j].Traslado_Objeto.Tax_Value;
                            var importe     = dataInvoice.conceptos.dataConceptos[i].Impuestos[0].Traslados[j].Traslado_Importe;

                            logger.info('Colocando nodo de Impuestos - Traslados.');
                            xmlImpuestos = xmlImpuestos + `<cfdi:Traslado` + ` Base="` + base + `" Impuesto="` + impuesto + `" TipoFactor="` + tipoFactor + `"`

                            //Atributo opcional
                            if(tasaOCuota !== undefined)
                            {
                                xmlImpuestos = xmlImpuestos + ` TasaOCuota="` + tasaOCuota + `"`;
                            }

                            //Atributo opcional
                            if(importe !== undefined)
                            {
                                xmlImpuestos = xmlImpuestos + ` Importe="` + importe + `"`;;
                            }

                            xmlImpuestos = xmlImpuestos + `/>`
                        }
                    }
                }
                xmlImpuestos = xmlImpuestos + `</cfdi:Traslados>`
            }
            xmlImpuestos = xmlImpuestos + `</cfdi:Impuestos>`;
            xmlPadre =  xmlPadre + xmlImpuestos;
        }

        /**** AQUI VAN LOS COMPLEMENTOS */

        /**** SE CIERRA EL XML */
        logger.info('Termina proceso de creación de XML.');
        xmlPadre = xmlPadre + `</cfdi:Comprobante>`
        console.log(xmlPadre);
    
        //Convertir xml a base 64 para enviarlo al timbrador
        logger.info('Convirtiendo XML a base 64.');
        var xml64 = Buffer.from(xmlPadre).toString('base64');

        logger.info('Enviado XML en base 64 a Timbrar...');
    }catch(error){
        logger.info('ERROR: ' + error);
        //ENVIAR RESPUESTA DE ERROR
    }
}

// function that verifies if a string has a given length or not
const verifyLengthMin = (value, length) => {
    if (value.length >= length) {
    return true;
    }
    return false;
};

const verifyLengthMax = (value, length) => {
    if (value.length <= length) {
        return true;
    }
    return false;
};

//crearXML(objeto)

module.exports = {
    getInvoices : getInvoices,
    getInvoice : getInvoice,
    insertInvoice : insertInvoice,
    updateInvoice : updateInvoice
}