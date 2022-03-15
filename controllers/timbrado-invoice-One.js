const logger = require('../utils/logger');

const jwt = require('jsonwebtoken');

const {
    getTempFilesPath
} = require('./cat-general-parameters');

const {
    serializeXML
} = require('../utils/xml');

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

        const cfdis = await procesarXMLs( xmls, idApplication, idCustomer, tempFilesPath );
    
        return response;

    } catch (error) {

        console.log('Error en Timbrar: ', error);
        logger.error('Error en Timbrar: ' + JSON.stringify(error));

    }

}

async function procesarXMLs( xmls, idApplication, idCustomer, tempPath ) {

    try {

        let cfdis = [];

        logger.info('Comienza procesarXMLs');

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

        }
        
    } catch (error) {

        console.log('Error en Procesar XMLs: ', error);
        logger.error('Error en Procesar XMLs: ' + JSON.stringify(error));

    }

}

module.exports = {
    timbrar
}