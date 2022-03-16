const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const crypto = require('crypto');

const {
    getTempFilesPath
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

const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const { 
    timbrarFactura 
} = require('../utils/InvoiceOne');

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

        if( timbradoSettings.data.success === 0 ) {

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

            response.data.success = 0;
            response.data.message = 'Request Body incorrecto - Se está enviando vacío el Body del Request';

            logger.info('Se está enviando vacío el Body del Request');
            logger.info('Saliendo de Timbrar y regresando el response.');
        
            return response;
        
        } else if( !body.xmls || body.xmls.length === 0 ){ // If xmls Array is empty or null
    
            response.data.success = 0;
            response.data.message = 'Request Body incorrecto - Se está enviando el array xmls vacío o no se está enviando correctamente';

            logger.info('Se está enviando el array xmls vacío o no se está enviando correctamente');
            logger.info('Saliendo de Timbrar y regresando el response.');
        
            return response;
    
        }

        /**
         * * Retrieve Data to Process
         */
        const xmls = body.xmls;

        const cfdis = await procesarXMLs( xmls, timbradoSettings, tempFilesPath );
    
        return response;

    } catch (error) {

        console.log('Error en Timbrar: ', error);
        logger.error('Error en Timbrar: ' + JSON.stringify(error));

    }

}

async function procesarXMLs( xmls, timbradoSettings, tempPath ) {

    try {

        let cfdis = [];

        logger.info('Comienza procesarXMLs');

        const cerFile           = timbradoSettings.CerFile;
        const keyFile           = timbradoSettings.KeyFile;
        const keyPassword       = timbradoSettings.KeyPassword;
        const timbradoPassword  = timbradoSettings.TimbradoWSPassword;
        const timbradoWSURL     = timbradoSettings.TimbradoWSURL;
        const timbradoWSUser    = timbradoSettings.TimbradoWSUser;

        const xmlsLength = xmls.length;

        for( let i = 0; i < xmlsLength; i++ ){

            cfdiData = new Object ({
                error: 0,
                message: '',
                timbrado: {
                  file: '',
                  serie: '',
                  folio: '',
                  statusCFDI: 0,
                  uuid: '',
                  cfdiTimbrado: '',
                  statusPDF: 0,
                  pdf: '',
                  emailTo: ''
                }
            });

            logger.info('Procesando el XML: ' + JSON.stringify(xmls[i]));

            /**
             * * Validate if File Name is not Empty
             */
            logger.info('Validando el nombre del XML');

            if( !xmls[i].fileName || xmls[i].fileName === '' ) {
                
                cfdiData.error = 1;
                cfdiData.message = 'Request Body incorrecto - Se está enviando el atributo fileName de xmls vacío, o no se está enviando correctamente';

                logger.info('Se está enviando el atributo fileName de xmls vacío, o no se está enviando correctamente.');

                cfdis = [...cfdis, cfdiData];

                return cfdis;

            }

            const fileName        = xmls[i].fileName;

            logger.info('Nombre del Archivo: ' + fileName);

            /**
             * * Serialize XML
             */
            let xmlDoc = await serializeXML( xmls[i].xmlBase64 );

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
        
            fs.unlinkSync(`${tempPath}${fileName}`);
        
            logger.info('Guardando XML Sellado: ' + `${tempPath}${fileName}`);

            const timbradoResponse = await timbrarFactura(stringXML, timbradoWSURL, timbradoWSUser, timbradoPassword);

        }
        
    } catch (error) {

        console.log('Error en Procesar XMLs: ', error);
        logger.error('Error en Procesar XMLs: ' + JSON.stringify(error));

    }

}

module.exports = {
    timbrar
}