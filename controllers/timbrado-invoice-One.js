const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const crypto = require('crypto');

const {
    getTempFilesPath,
    getEnvironment
} = require('./cat-general-parameters');

const {
    serializeXML
} = require('../utils/xml');

const {
    getApplicationSettings
} = require('./external-applications');

const {
    certificar,
    getCadena,
    getSello
} = require('../utils/SAT');

const {
    getBase64String
} = require('../utils/base64');

const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const { 
    timbrarFactura 
} = require('../utils/Timbrado/InvoiceOne');

const {
    getInvoicePDF
} = require('../utils/Timbrado/PDF_Generation/pdf-orchestrator');

const {
    getTemporalFileName
} = require('../utils/general');

const path = require('path');

async function timbrar(req) {

    const body =  req.body;

    let response = {
        data: {
            success: 0,
            message: '',
            cfdis: []
        }
    }

    try {

        /**
         * * Retrieve Parameters for procesarXMLs
         */
        const decode = jwt.decode(req.headers.authorization.split(' ')[1]);
        const idApplication = decode.serverApplication;
        const idCustomer = decode.idCustomer;

        const tempFilesPath = await getTempFilesPath();

        /**
         * * Retrieve Timbrado Settings
         */
        logger.info('Recuperando las configuraciones del Timbrado.');

        let timbradoSettings = await getApplicationSettings(idApplication, idCustomer);

        if( !timbradoSettings.data.success ) {

            response.data.success = timbradoSettings.data.success;
            response.data.message = timbradoSettings.data.message;

            logger.error('ERROR: No se pudieron recuperar las configuraciones de la Aplicación de Timbrado: ' + idApplication + ' para el Cliente: ' + idCustomer);
            logger.info('Saliendo de Timbrar y regresando el Response.');

            return response;

        }

        timbradoSettings = timbradoSettings.data.configuration;

        /**
         * * Validate Data to Process
         * * Validation of no Empty Body or No Empty xmls Array
         */
        if ( Object.entries(body).length === 0 ) { // If body is empty

            response.data.success = false;
            response.data.message = 'Request Body incorrecto - Se está enviando vacío el Body del Request';

            logger.info('Se está enviando vacío el Body del Request');
            logger.info('Saliendo de Timbrar y regresando el response.');
        
            return response;
        
        } else if( !body.xmls || body.xmls.length === 0 ){ // If xmls Array is empty or null
    
            response.data.success = false;
            response.data.message = 'Request Body incorrecto - Se está enviando el array xmls vacío o no se está enviando correctamente';

            logger.info('Se está enviando el array xmls vacío o no se está enviando correctamente');
            logger.info('Saliendo de Timbrar y regresando el response.');
        
            return response;
    
        }

        /**
         * * Retrieve Data to Process
         */
        const xmls = body.xmls;

        const cfdis = await procesarXMLs( xmls, timbradoSettings, tempFilesPath, idCustomer );

        response.data.success = true;
        response.data.cfdis = cfdis;
    
        return response;

    } catch (error) {

        logger.error('Error en Timbrar: ' + error);

    }

}

async function procesarXMLs( xmls, timbradoSettings, tempPath, idCustomer ) {

    try {

        let cfdis = [];

        logger.info('Comienza procesarXMLs');

        const cerFile           = timbradoSettings.CerFile;
        const keyFile           = timbradoSettings.KeyFile;
        const keyPassword       = timbradoSettings.KeyPassword;
        const timbradoPassword  = timbradoSettings.TimbradoWSPassword;
        const timbradoWSURL     = timbradoSettings.TimbradoWSURL;
        const timbradoWSUser    = timbradoSettings.TimbradoWSUser;
        const pdfLogo           = timbradoSettings.PDFLogo;
        const pdfFunction       = timbradoSettings.PDFFunction;
        const xmlPath           = timbradoSettings.XMLPath;
        const pdfPath           = timbradoSettings.PDFPath;

        const xmlsLength = xmls.length;

        for( let i = 0; i < xmlsLength; i++ ) {

            let cfdiData = {
                error: false,
                message: '',
                timbrado: {
                  file: '',
                  serie: '',
                  folio: '',
                  statusCFDI: 0,
                  uuid: '',
                  cfdiTimbrado: '',
                  statusPDF: 0,
                  pdf: ''
                }
            };

            logger.info('Procesando el XML: ' + JSON.stringify(xmls[i]));

            /**
             * * Validate if File Name is not Empty
             */
            logger.info('Validando el nombre del XML');

            if( !xmls[i].fileName || xmls[i].fileName === '' ) {
                
                cfdiData.error = true;
                cfdiData.message = 'Request Body incorrecto - Se está enviando el atributo fileName de xmls vacío, o no se está enviando correctamente';

                logger.info('Se está enviando el atributo fileName de xmls vacío, o no se está enviando correctamente.');

                cfdis = [...cfdis, cfdiData];

                continue;

            }

            const fileName        = xmls[i].fileName;

            logger.info('Nombre del Archivo: ' + fileName);

            /**
             * * Validate xml File Base 64 content
             * * Validation of no Empty xml Base 64
            */
            logger.info('Validando el atributo xmlBase64.');

            if( !xmls[i].xmlBase64 || xmls[i].xmlBase64 === '' ) {

                cfdiData.error = true;
                cfdiData.message = 'Request Body incorrecto - Se está enviando el atributo xmlBase64 de xmls vacío, o no se está enviando correctamente';

                logger.info('Se está enviando el atributo xmlBase64 de xmls vacío, o no se está enviando correctamente.');

                cfdis = [...cfdis, cfdiData];

                continue;

            }

            logger.info('Atributo xmlBase64 correcto.');

            /**
             * * Serialize XML
             */
            const xmlBase64     = getBase64String(xmls[i].xmlBase64);
            let xmlDoc = await serializeXML( xmlBase64 );

            logger.info('XML a Procesar: ' + xmlDoc);

            /**
             * * Get Certificado and NoCertificado
             */
            const serialNumber = certificar(cerFile);
            const cer = fs.readFileSync(cerFile, 'base64');

            /**
             * * Certificate Invoice
             */
            logger.info('Certificando Factura, asignación de NoCertificado y Certificado.');
            
            xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('NoCertificado', serialNumber);
      
            xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Certificado', cer);

            /**
             * * Generate Certificated XML Invoice
             */
            let stringXML = new XMLSerializer().serializeToString(xmlDoc);
            
            logger.info('Guardando archivo Temporal de Factura Certificada: ' + `${tempPath}${fileName}`);

            fs.writeFileSync(`${tempPath}${fileName}`, stringXML);

            /**
             * * Seal XML
             */
            logger.info('Sellando XML.');

            const cadena = await getCadena('./resources/XSLT/cadenaoriginal_3_3.xslt', `${tempPath}${fileName}`);

            const prm = await getSello(keyFile, keyPassword);
        
            const sign = crypto.createSign('RSA-SHA256');
        
            sign.update(cadena);
        
            const sello = sign.sign(prm, 'base64');
        
            const xml = fs.readFileSync(`${tempPath}${fileName}`, 'utf8');
        
            xmlDoc = new DOMParser().parseFromString(xml);//
        
            xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Sello', sello);
        
            stringXML = new XMLSerializer().serializeToString(xmlDoc);

            logger.info('Borrando archivo Temporal ' + `${tempPath}${fileName}`);
        
            fs.unlinkSync(`${tempPath}${fileName}`);
        
            logger.info('Enviando a Timbrar a Invoice One el archivo: ' + stringXML);

            const environment = await getEnvironment();

            const timbradoResponse = await timbrarFactura(stringXML, timbradoWSURL, timbradoWSUser, timbradoPassword, environment);

            if( timbradoResponse.error ) {

                logger.info('El CFDI no fue timbrado exitosamente.');

                cfdiData.error                      = timbradoResponse.error;
                cfdiData.message                    = timbradoResponse.errorMessage;
                cfdiData.timbrado.statusCFDI        = timbradoResponse.errorCode;
                cfdiData.timbrado.file              = path.basename(fileName, '.xml');

                cfdis = [...cfdis, cfdiData];

            } else {

                logger.info('El CFDI fue timbrado exitosamente.');

                /**
                 * * Save Stamped XML File
                 */
                logger.info('Guardando XML del CFDI Timbrado.');

                const stampedXMLFileExists = fs.existsSync(`${xmlPath}${fileName}`);

                let temporalFileName = getTemporalFileName();

                if( stampedXMLFileExists ) {

                    logger.info('Ya existe un archivo previo: ' + fileName);
                    logger.info('WARNING: Es posible que haya ocurrido un timbrado múltiple del mismo archivo.');

                    temporalFileName = path.basename(fileName, '.xml') + '_' + temporalFileName;

                    fs.writeFileSync(`${xmlPath}${temporalFileName}.xml`, timbradoResponse.cfdiTimbrado.toString(), {encoding: 'utf-8'});

                    logger.info('Se ha guardado el archivo: ' + `${xmlPath}${temporalFileName}.xml`);

                } else {

                    fs.writeFileSync(`${xmlPath}${fileName}`, timbradoResponse.cfdiTimbrado.toString(), {encoding: 'utf-8'});

                    logger.info('Se ha guardado el archivo: ' + `${xmlPath}${fileName}`);

                }

                /**
                 * * Assign XML Data for cfdis Array
                 */
                const xmlBase64                     = Buffer.from(timbradoResponse.cfdiTimbrado.toString()).toString('base64');

                cfdiData.error                      = timbradoResponse.error;
                cfdiData.message                    = timbradoResponse.errorMessage;
                cfdiData.timbrado.statusCFDI        = 200;
                cfdiData.timbrado.uuid              = timbradoResponse.uuid;
                cfdiData.timbrado.cfdiTimbrado      = xmlBase64;
                cfdiData.timbrado.serie             = timbradoResponse.serie;
                cfdiData.timbrado.folio             = timbradoResponse.folio;
                cfdiData.timbrado.file              = path.basename(fileName, '.xml');

                /**
                 * * Generate PDF and get its Data (pdfBase64, emailTo and emailCC)
                 */
                const pdfOptions            = {
                    pdfLogo: pdfLogo,
                    pdfFunction: pdfFunction
                }

                const pdfData               = await getInvoicePDF( tempPath, xmlBase64, xmls[i].additionalFiles, pdfOptions );

                const pdfBase64             = getBase64String(pdfData.pdfBase64);
                const pdfEmailTo            = pdfData.emailTo;
                const pdfEmailCC            = pdfData.emailCC;

                if( pdfBase64.trim().length === 0 ) {

                    logger.info('El PDF no se generó exitosamente.');

                    cfdiData.timbrado.statusPDF         = 500;
                    cfdiData.timbrado.pdf               = '';

                } else {

                    logger.info('El PDF se generó existosamente.');
                    logger.info('Guardando PDF del CFDI Timbrado.');

                    if( stampedXMLFileExists ) {

                        logger.info('WARNING: Es posible que haya ocurrido un timbrado múltiple del mismo archivo.');
                        logger.info('Guardando archivo PDF con el mismo nombre del posible duplicado: ' + temporalFileName);

                        fs.writeFileSync(`${pdfPath}${temporalFileName}.pdf`, pdfBase64, 'base64');

                        logger.info('Archivo PDF guardado: ' + `${pdfPath}${temporalFileName}.pdf`);

                    } else {

                        fs.writeFileSync(`${pdfPath}${path.basename(fileName, '.xml')}.pdf`, pdfBase64, 'base64');

                        logger.info('Archivo PDF guardado: ' + `${pdfPath}${path.basename(fileName, '.xml')}.pdf`);

                    }

                    /**
                     * * Assign PDF Data for cfdis Array
                     */
                    cfdiData.timbrado.statusPDF         = 200;
                    cfdiData.timbrado.pdf               = pdfBase64;

                }

                cfdis = [...cfdis, cfdiData];

            }

        }

        return cfdis;
        
    } catch (error) {

        console.log('Error en Procesar XMLs: ', error);
        logger.error('Error en Procesar XMLs: ' + error);

    }

}

module.exports = {
    timbrar
}