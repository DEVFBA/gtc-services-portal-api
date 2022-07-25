const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const {
    getTempFilesPath,
    getEnvironment
} = require('./cat-general-parameters');

const {
    getApplicationSettings
} = require('./external-applications');

const { 
    getAvailableStampings 
} = require('./customer-stampings');

const {
    getBase64String
} = require('../utils/base64');

const {
    getCustomerByTaxId
} = require('./customers');

const {
    serializeXML
} = require('../utils/xml');

const {
    getInvoicePDF
} = require('../utils/Timbrado/PDF_Generation/pdf-orchestrator');

const {
    certificar,
    getCadena,
    getSello,
    getCadena40
} = require('../utils/SAT');

const { 
    timbrarFactura
} = require('../utils/Timbrado/InvoiceOne');

const {
    getTemporalFileName
} = require('../utils/general');

async function timbrar(req) {
  
    let response = {
        data: {
            success: false,
            message: '',
            cfdis: []
        }
    }

    try {
        
        logger.info('**************************************************************'); 
        logger.info('Iniciando Proceso de Timbrado Multicompañía Invoice One.');
        logger.info('**************************************************************');
    
        /**
             * * 1. Main Constants and Variables Definition
         */
    
        /**
         * * ****** 1.1 General constants and variables
         */
    
         logger.info('***Recuperando constantes y variables generales.***');
         const tempFilesPath            = await getTempFilesPath();
         const body                     =  req.body;
    
        /**
         * * ****** 1.2 Data for configuration settings
         */
    
         logger.info('***Recuperando datos necesarios para determinar los settings del Timbrado.***');
    
         const decode                   = jwt.decode(req.headers.authorization.split(' ')[1]);
         const idApplication            = decode.serverApplication;
         const idParentCustomer         = decode.idCustomer;
         const user                     = decode.userName;
    
        /**
          * ****** 1.3 Validate if Customer has Available Stamps
         */
    
         logger.info('***Validando si el Cliente tiene Timbres Disponibles.***');
    
         const availableStamps = await getAvailableStampings( idParentCustomer );
    
         if( !availableStamps ) {
    
             response.data.success = false;
             response.data.message = 'El Cliente no cuenta con Timbres Disponibles o Vigentes.';
    
             return response;
    
         }
    
        /**
         * * * 2. Retrieve main application configuration
         */
    
         logger.info('***Recuperando las configuraciones de la aplicación principal***');
    
         let timbradoSettings = await getApplicationSettings(idApplication, idParentCustomer);
    
         console.log('Settings Timbrado: ', timbradoSettings);
    
         if( !timbradoSettings.data.success ) {
    
            response.data.success = timbradoSettings.data.success;
            response.data.message = timbradoSettings.data.message;
    
            logger.error('ERROR: No se pudieron recuperar las configuraciones de la Aplicación de Timbrado: ' + idApplication + ' para el Cliente: ' + idCustomer);
            logger.info('Saliendo de Timbrar y regresando el Response.');
    
            return response;
    
        }
    
        /**
         * * * 3. Validate Data to Process
         * *      Validation of no Empty Body or No Empty xmls Array
         */
         if ( Object.entries(body).length === 0 ) { // If body is empty
    
            response.data.success = false;
            response.data.message = 'Request Body incorrecto - Se está enviando vacío el Body del Request';
    
            logger.info('Error: Se está enviando vacío el Body del Request');
            logger.info('***Saliendo de Timbrar y regresando el response.***');
        
            return response;
        
        } else if( !body.xmls || body.xmls.length === 0 ){ // If xmls Array is empty or null
    
            response.data.success = false;
            response.data.message = 'Request Body incorrecto - Se está enviando el array xmls vacío o no se está enviando correctamente';
    
            logger.info('Error: Se está enviando el array xmls vacío o no se está enviando correctamente');
            logger.info('***Saliendo de Timbrar y regresando el response.***');
        
            return response;
    
        }
    
        /**
         * * * 4. Retrieve CFDI Version
         * *      If Version in Portal is not blank, null or a white space, version is determined in
         * *      body's Version attribute; else version will be determined by Portal Application 
         * *      Settings for the Customer.
         */
         let cfdiVersion = null;
    
         if( !timbradoSettings.data.configuration.TimbradoVersion || !timbradoSettings.data.configuration.TimbradoVersion.trim() ) {
    
             if( !body.version || body.version.trim() === '' ) {
        
                 logger.info('***La versión del CFDI es 3.3 determinada por la configuración del Requester.***');
        
                 cfdiVersion = '3.3'
        
             } else {
        
                 logger.info('***La versión del CFDI es ' + body.version + ' determinada por la configuración del Requester***');
        
                 cfdiVersion = body.version;
        
             }
    
         }
         else {
    
            logger.info('***La versión del CFDI es ' + timbradoSettings.data.configuration.TimbradoVersion + ' determinada por la configuración de la Aplicación en el Servidor***');
    
            cfdiVersion = timbradoSettings.data.configuration.TimbradoVersion;
    
         }
    
        /**
         * * * 5. Retrieve Data to Process
         */
         const xmls = body.xmls;
    
         const cfdis = await procesarXMLs( xmls, timbradoSettings, tempFilesPath, idParentCustomer, user, cfdiVersion );

         if( !cfdis ) {

            response.data.success   = false;
            response.data.message = 'Hubo un error al Procesar los XMLs, revise el Log de la Aplicación para más detalle.';
    
            logger.info('Error: Hubo un error en la función procesarXMLs.');
            logger.info('***Saliendo de Timbrar y regresando el response.***');
        
            return response;

         }
    
         response.data.success = true;
         response.data.cfdis = cfdis;
     
         return response;

    } catch (error) {

        console.log('Error en timbrar: ', error);
        logger.error('Error en timbrar: ' + error);

        response.data.success   = false;
        response.data.message   = 'Hubo un error en el Timbrado, revise el Log de la Aplicación para más detalle.';
    
        logger.info('Error: Hubo un error en la función timbrar.');
        logger.info('***Saliendo de Timbrar y regresando el response.***');
        
        return response;

    }

}

async function procesarXMLs( xmls, timbradoSettings, tempFilesPath, idParentCustomer, user, cfdiVersion ) {

    try {

        logger.info('**************************************************************'); 
        logger.info('       Procesando los XMLs recibidos.');
        logger.info('**************************************************************');

        let cfdis                   = [];
        const xmlsLength            = xmls.length;

        for( let i = 0;  i < xmlsLength; i++ ) {

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
                  pdf: '',
                  emailTo: [],
                  emailCC: []
                }
            };

            let taxId = null;

            logger.info('XML ' + (i + 1)  + ' de ' + xmlsLength + ' en proceso...');
            logger.info('Procesando el XML: ' + JSON.stringify(xmls[i]));

            /**
             * * * 1. Validate if File Name is not Empty
             */
             logger.info('***Validando el nombre del XML.***');

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
              * * * 2. Validate xml File Base 64 content
              * * *    Validation of no Empty xml Base 64
             */
             logger.info('***Validando el atributo xmlBase64.***');
 
             if( !xmls[i].xmlBase64 || xmls[i].xmlBase64 === '' ) {
 
                 cfdiData.error = true;
                 cfdiData.message = 'Request Body incorrecto - Se está enviando el atributo xmlBase64 de xmls vacío, o no se está enviando correctamente';
 
                 logger.info('Se está enviando el atributo xmlBase64 de xmls vacío, o no se está enviando correctamente.');
 
                 cfdis = [...cfdis, cfdiData];
 
                 continue;
 
             }
 
             logger.info('Atributo xmlBase64 correcto.');
 
             /**
              * * * 3. Serialize XML
              */
             logger.info('***Serializando el XML.***');

             const xmlBase64        = getBase64String(xmls[i].xmlBase64);
             let xmlDoc             = await serializeXML( xmlBase64 );
 
             logger.info('XML a Procesar: ' + xmlDoc);

            /**
             * * * 4. Determine Tax ID from XML to be processed
             * * *    Tax Id will be used to determine particular configuration for stamping such
             * * *    as Certificates, Logo, etc.
            */
             if( !xmlDoc.getElementsByTagName('cfdi:Emisor')[0] ) {

                logger.info('El Base 64 no es un XML válido de CFDI.');

                cfdiData.error      = true;
                cfdiData.message    = 'El Base 64 no es un XML válido de CFDI.';

                cfdis = [...cfdis, cfdiData];

                continue;

             } else if( !xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Rfc') ) {

                logger.info('El XML no cuenta con RFC Emisor.');

                cfdiData.error      = true;
                cfdiData.message    = 'El XML no cuenta con RFC Emisor.';

                cfdis = [...cfdis, cfdiData];

                continue;

             } else {
                
                taxId               = xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Rfc');

                logger.info('El RFC del documento que se está procesando es: ' + taxId);

             }
             
            /**
              * * * 5. Determine Customer for Tax Id to retrieve configuration for stamping.
              *        TODO: For now Country Parameter is hardcoded to MEX, but it must be changed
              *        TODO: in case another country uses this function
            */
             logger.info('***Determinando el Id del Cliente del RFC.***');

             const taxIdCustomer = await getCustomerByTaxId(taxId, 'MEX');
             
            /**
              * ****** 5.1 Determine if Company is valid 
            */
             logger.info('***Determinando si el Id de Cliente es válido para el Parent Customer del Timbrado.***');

             const validCompanies = timbradoSettings.data.configuration.ValidCompanies.split(',');

             const validCompany = validCompanies.indexOf(taxIdCustomer.toString()) === -1 ? false : true;

             if( !validCompany ) {

                cfdiData.error      = true;
                cfdiData.message    = 'El RFC no corresponde a una compañía válida de timbrado para el Cliente.';

                logger.error('El RFC no corresponde a una compañía válida de timbrado para el Cliente.');

                cfdis = [...cfdis, cfdiData];

                continue;

             }
            
            /**
              * ****** 5.2 Retrieve Tax Id Company configurations
            */
             logger.info('***Recuperando las configuraciones de Timbrado del RFC.***');

             const taxIdTimbradoSettings    = await getApplicationSettings(timbradoSettings.data.configuration.RFCTimbradoApplication, taxIdCustomer);

             if( !taxIdTimbradoSettings.data.success ) {

                cfdiData.error      = true;
                cfdiData.message    = 'El RFC no tiene sus configuraciones de Timbrado.';

                logger.error('El RFC no tiene sus configuraciones de Timbrado.');

                cfdis = [...cfdis, cfdiData];

                continue;

             } else {

                logger.info('Configuraciones de Timbrado para el RFC recuperadas exitosamente.');

             }
             
             console.log('Configuraciones de Timbrado del RFC: ', taxIdTimbradoSettings);

             const cerFile              = taxIdTimbradoSettings.data.configuration.CerFile;
             const keyFile              = taxIdTimbradoSettings.data.configuration.KeyFile;
             const keyPassword          = taxIdTimbradoSettings.data.configuration.KeyPassword;
             const pdfLogo              = taxIdTimbradoSettings.data.configuration.PDFLogo;
             const pdfFunction          = taxIdTimbradoSettings.data.configuration.PDFFunction;
             const xmlPath              = taxIdTimbradoSettings.data.configuration.XMLPath;
             const pdfPath              = taxIdTimbradoSettings.data.configuration.PDFPath;

            /**
              * ****** 5.3 Configuration Pre validations
            */
             logger.info('***Validando Archivo .cer***');

             if( !fs.existsSync(taxIdTimbradoSettings.data.configuration.CerFile) ) {

               cfdiData.error      = true;
               cfdiData.message    = 'El archivo cer de la ruta ' + taxIdTimbradoSettings.data.configuration.CerFile + ' no existe.';

               logger.error('El archivo cer de la ruta ' + taxIdTimbradoSettings.data.configuration.CerFile + ' no existe.');

               cfdis = [...cfdis, cfdiData];

               continue;

             }

             logger.info('***Validando Archivo .key***');

             if( !fs.existsSync(taxIdTimbradoSettings.data.configuration.KeyFile) ) {

                cfdiData.error      = true;
                cfdiData.message    = 'El archivo key de la ruta ' + taxIdTimbradoSettings.data.configuration.KeyFile + ' no existe.';
 
                logger.error('El archivo key de la ruta ' + taxIdTimbradoSettings.data.configuration.KeyFile + ' no existe.');
 
                cfdis = [...cfdis, cfdiData];
 
                continue;
 
             }

             logger.info('***Pre Validaciones de las configuraciones correctas***');

            /**
             * * * 6. Get Certificado and NoCertificado
            */
             logger.info('***Recuperando Archivo .cer***');

             const certificateNumber         = certificar(cerFile);

             if( !certificateNumber ) {

                cfdiData.error      = true;
                cfdiData.message    = 'No se pudo resolver el Número de Certificado con el archivo Certificado configurado.';

                logger.error('No se pudo resolver el Número de Certificado con el archivo Certificado configurado.');

                cfdis = [...cfdis, cfdiData];

                continue;

             }

             const cer                  = fs.readFileSync(cerFile, 'base64');
 
            /**
             * * * 7. Certificate Invoice
            */
             logger.info('***Certificando Factura, asignación de NoCertificado y Certificado.***');
             
             xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('NoCertificado', certificateNumber);
       
             xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Certificado', cer);
            
            /**
             * * * 8. Get Serie and Folio
            */
             logger.info('***Recuperando Serie y Folio.***');

             let serie = '';
             let folio = '';
 
             if( !xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Serie') ) {
 
                 logger.info('El Documento XML recibido no tiene Serie.');

                 serie = '';
 
             } else {
 
                 logger.info('El Documento XML recibido contiene Serie.');

                 serie = xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Serie');
 
             }
 
             if( !xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Folio') ) {
 
                 logger.info('El Documento XML recibido no tiene Folio.');

                 folio = '';
 
             } else {
 
                 logger.info('El Documento XML recibido contiene Folio.');

                 folio = xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Folio');
 
             }
 
            /**
              * * * 9. Get Issuer Name
            */
             logger.info('***Recuperando Nombre del Emisor.***');

             let issuerName = '';
  
             if( !xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Nombre') ) {
  
                  logger.info('El Documento XML recibido no tiene Nombre del Emisor.');

                  issuerName = '';
  
             } else {
  
                  logger.info('El Documento XML recibido contiene Nombre del Emisor.');

                  issuerName = xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Nombre');
  
             }

            /**
             * * * 10. Generate Certificated XML Invoice
            */
             let stringXML = new XMLSerializer().serializeToString(xmlDoc);
            
             logger.info('Guardando archivo Temporal de Factura Certificada: ' + `${tempFilesPath}${fileName}.`);
 
             fs.writeFileSync(`${tempFilesPath}${fileName}`, stringXML);

            /**
             * * * 11. Generate cadena
            */
             logger.info('***Generando cadena.***');

             let cadena = null;

             if( cfdiVersion === '3.3' ) {

               cadena = await getCadena('./resources/XSLT/cadenaoriginal_3_3.xslt', `${tempFilesPath}${fileName}`);

             } else if ( cfdiVersion === '4.0' ) {
               
               cadena = await getCadena40('./resources/XSLT_4_0/cadenaoriginal.xslt', `${tempFilesPath}${fileName}`);

             }
             
            /**
             * * * 12. Seal XML
            */
             logger.info('***Sellando XML.***');

             const prm = await getSello(keyFile, keyPassword);
         
             const sign = crypto.createSign('RSA-SHA256');
         
             sign.update(cadena);
         
             const sello = sign.sign(prm, 'base64');
         
             const xml = fs.readFileSync(`${tempFilesPath}${fileName}`, 'utf8');
         
             xmlDoc = new DOMParser().parseFromString(xml);//
         
             xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Sello', sello);
         
             stringXML = new XMLSerializer().serializeToString(xmlDoc);
 
             logger.info('Borrando archivo Temporal ' + `${tempFilesPath}${fileName}`);
         
             fs.unlinkSync(`${tempFilesPath}${fileName}`);

             logger.info('***XML Sellado con éxito.***');

            /**
             * * * 13. Determine Stamping Environment
            */
             logger.info('***Determinando el ambiente de Timbrado.***');

             const environment = await getEnvironment();

             if( !environment ) {

                cfdiData.error      = true;
                cfdiData.message    = 'No es posible resolver el ambiente de Timbrado.';

                logger.error('No es posible resolver el ambiente de Timbrado.');

                cfdis = [...cfdis, cfdiData];

                continue;

             } else {

                logger.info('El ambiente de Timbrado es: ' + environment);

             }

            /**
             * * * 14. Stamp CFDI
            */
             logger.info('***Enviando a Timbrar el XML del CFDI***');

             const timbradoResult = await timbrarFactura(stringXML, timbradoSettings.data.configuration.TimbradoWSURL, timbradoSettings.data.configuration.TimbradoWSUser, timbradoSettings.data.configuration.TimbradoWSPassword, environment);

             if( !timbradoResult ) {

                cfdiData.error      = true;
                cfdiData.message    = 'Hubo un error al momento de recuperar la Respuesta de Timbrado.';

                logger.error('Hubo un error al momento de recuperar la Respuesta de Timbrado.');

                cfdis = [...cfdis, cfdiData];

                continue;

             }

            /**
             * * * 15. Retrieve Timbrado Response Data
            */
             let timbradoRequest        = timbradoResult.request;
             let timbradoResponse       = timbradoResult.response;
             let timbradoError          = timbradoResult.error;

             let uuid                   = timbradoResult.uuid;

             let timbradoFileName       = path.basename(fileName, '.xml');
             let timbradoSuccess        = false;
             cfdiData.timbrado.serie    = serie;
             cfdiData.timbrado.folio    = folio;

             if( timbradoError ) {

                logger.info('El CFDI no fue timbrado exitosamente.');

                cfdiData.error          = true;          
                cfdiData.message        = timbradoResult.errorMessage;
                cfdiData.statusCFDI     = timbradoResult.errorCode;

                cfdis = [...cfdis, cfdiData];

                logger.info('Se regresa el error del timbrado en el Response del XML Procesado.');

                continue;

            }
             
            logger.info('El CFDI se timbró exitosamente.');
            
            
            /**
             * * * 16. Save Stamped XML File and get Base64
             */
            logger.info('***Guardando XML del CFDI Timbrado.***');
            
            fs.writeFileSync(`${xmlPath}${timbradoFileName}.xml`, timbradoResult.cfdiTimbrado.toString(), {encoding: 'utf-8'});
            
            logger.info('Se ha guardado el archivo: ' + `${xmlPath}${timbradoFileName}.xml`);
            
            /**
             * * * 17. Get XML Data for cfdis Array -- XML Section
             */
             logger.info('***Asignando datos de Timbrado a la Sección XML del Array CFDIs');
            
             const stampedXMLBase64             = Buffer.from(timbradoResult.  cfdiTimbrado.toString()).toString('base64');
             cfdiData.statusCFDI                = 200;
             cfdiData.timbrado.uuid             = uuid;
             cfdiData.timbrado.file             = timbradoFileName;
             cfdiData.timbrado.cfdiTimbrado     = stampedXMLBase64; 
             
            /**
             * * * 18. Generate PDF and Retrieve Data for Mail
            */
             logger.info('***Generando PDF y recuperando datos para correo electrónico.***');

             let pdfBase64          = null;
             let emailTo            = null;
             let emailCC            = null;
             let poNumber           = null;

             if ( !pdfFunction || pdfFunction.trim() === '' ) {

                pdfBase64 = ''

             } else {

                const pdfOptions        = {
                    pdfLogo: pdfLogo,
                    pdfFunction: pdfFunction
                }

                const pdfData               = await getInvoicePDF( tempFilesPath, xmlBase64, xmls[i].additionalFiles, pdfOptions );

                pdfBase64                   = getBase64String(pdfData.pdfBase64);
                emailTo                     = pdfData.emailTo;
                emailCC                     = pdfData.emailCC;
                poNumber                    = pdfData.poNumber;

                console.log('PO Number:', poNumber);

             }
             
             cfdis = [...cfdis, cfdiData];
             
            }

            console.log('CFDIs: ', cfdis );
            
            return cfdis;
            
        } catch (error) {
            
            console.log('Error en procesarXMLs: ', error);
            logger.error('Error en procesarXMLs: ' + error);
            
            return false;
            
        }
        
    }

module.exports = {
    timbrar
}