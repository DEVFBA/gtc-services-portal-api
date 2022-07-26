const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const {
    getTempFilesPath,
    getEnvironment
} = require('./cat-general-parameters');

const {
    serializeXML
} = require('../utils/xml');

const {
    sendMail
} = require('../utils/mail');

const {
    getApplicationSettings
} = require('./external-applications');

const {
    certificar,
    getCadena,
    getSello,
    getCadena40
} = require('../utils/SAT');

const {
    addCustomerStampingRecord
} = require('./request-customer-stamping')

const {
    getBase64String
} = require('../utils/base64');

const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const { 
    timbrarFactura,
    getComprobante
} = require('../utils/Timbrado/InvoiceOne');

const {
    getInvoicePDF
} = require('../utils/Timbrado/PDF_Generation/pdf-orchestrator');

const {
    getTemporalFileName
} = require('../utils/general');

const { 
    getAvailableStampings 
} = require('./customer-stampings');

async function timbrar(req) {

    const body =  req.body;

    let response = {
        data: {
            success: false,
            message: '',
            cfdis: []
        }
    }

    try {

        /**
         * * Retrieve Parameters for procesarXMLs
         */
        const decode        = jwt.decode(req.headers.authorization.split(' ')[1]);
        const idApplication = decode.serverApplication;
        const idCustomer    = decode.idCustomer;
        const user          = decode.userName;

        const tempFilesPath = await getTempFilesPath();

        /**
         * * Validate if Customer has Available Stamps
         */
        logger.info('Validando si el Cliente tiene Timbres Disponibles.');
        const availableStamps = await getAvailableStampings( idCustomer );

        if( !availableStamps ) {

            response.data.success = false;
            response.data.message = 'El Cliente no cuenta con Timbres Disponibles o Vigentes.';

            return response;

        }

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
         * * Retrieve CFDI Version
         */
        let cfdiVersion = null;

        if( !body.version || body.version.trim() === '' ) {

            logger.info('La versión del CFDI es 3.3.');

            cfdiVersion = '3.3'

        } else {

            logger.info('La versión del CFDI es ' + body.version);

            cfdiVersion = body.version;

        }

        /**
         * * Retrieve Data to Process
         */
        const xmls = body.xmls;

        const cfdis = await procesarXMLs( xmls, timbradoSettings, tempFilesPath, idCustomer, user, cfdiVersion );

        response.data.success = true;
        response.data.cfdis = cfdis;
    
        return response;

    } catch (error) {

        logger.error('Error en Timbrar: ' + error);

    }

}

async function procesarXMLs( xmls, timbradoSettings, tempPath, idCustomer, user, cfdiVersion ) {

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
                  pdf: '',
                  emailTo: [],
                  emailCC: []
                }
            };

            /**
             * * Validate if the XML still have available Stamp to use
             */
            logger.info('Validando si el XML aún tiene Timbre Disponible para Procesarse.');

            const availableStampings = await getAvailableStampings( idCustomer );

            if( !availableStampings ) {

                cfdiData.error = true;
                cfdiData.message = 'El Cliente ya no tiene timbres disponibles para procesar este archivo.';

                cfdis = [...cfdis, cfdiData];

                continue;

            }


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
             * Get Serie and Folio
             */
            logger.info('Recuperando Serie y Folio.');
            let serie = '';
            let folio = '';

            if( !xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Serie') ) {

                logger.info('El Documento XML recibido no tiene Serie');
                serie = '';

            } else {

                logger.info('El Documento XML recibido contiene Serie');
                serie = xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Serie');

            }

            if( !xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Folio') ) {

                logger.info('El Documento XML recibido no tiene Folio');
                folio = '';

            } else {

                logger.info('El Documento XML recibido contiene Folio');
                folio = xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Folio');

            }

            /**
             * Get Issuer Name
             */
             logger.info('Recuperando Nombre del Emisor.');
             let issuerName = '';
 
             if( !xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Nombre') ) {
 
                 logger.info('El Documento XML recibido no tiene Nombre del Emisor');
                 issuerName = '';
 
             } else {
 
                 logger.info('El Documento XML recibido contiene Nombre del Emisor');
                 issuerName = xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Nombre');
 
             }

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

            let cadena = null;

            if( cfdiVersion === '3.3' ) {

                cadena = await getCadena('./resources/XSLT/cadenaoriginal_3_3.xslt', `${tempPath}${fileName}`);

            } else if ( cfdiVersion === '4.0' ) {
                
                cadena = await getCadena40('./resources/XSLT_4_0/cadenaoriginal.xslt', `${tempPath}${fileName}`);

            }

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
            /** Aquí voy */
            const request                       = timbradoResponse.request;
            const response                      = timbradoResponse.response;

            let uuid                            = '';
            let successTimbrado                 = false;

            if( timbradoResponse.error ) {

                logger.info('El CFDI no fue timbrado exitosamente.');

                cfdiData.error                      = timbradoResponse.error;
                cfdiData.message                    = timbradoResponse.errorMessage;
                cfdiData.timbrado.statusCFDI        = timbradoResponse.errorCode;
                cfdiData.timbrado.serie             = serie;
                cfdiData.timbrado.folio             = folio;
                cfdiData.timbrado.file              = path.basename(fileName, '.xml');

                cfdis = [...cfdis, cfdiData];

            } else {

                logger.info('El CFDI fue timbrado exitosamente.');

                successTimbrado                 = true;
                uuid                            = timbradoResponse.uuid;;

                /**
                 * * Save Stamped XML File
                 */
                logger.info('Guardando XML del CFDI Timbrado.');

                const stampedXMLFileExists      = fs.existsSync(`${xmlPath}${fileName}`);

                let temporalFileName            = getTemporalFileName();
                let finalFileName               = path.basename(fileName, '.xml');
                let possibleExtraStamped        = false;

                if( stampedXMLFileExists ) {

                    logger.info('Ya existe un archivo previo: ' + fileName);
                    logger.info('WARNING: Es posible que haya ocurrido un timbrado múltiple del mismo archivo.');

                    possibleExtraStamped = true;

                    finalFileName = finalFileName + '_' + temporalFileName;

                    fs.writeFileSync(`${xmlPath}${finalFileName}.xml`, timbradoResponse.cfdiTimbrado.toString(), {encoding: 'utf-8'});

                    logger.info('Se ha guardado el archivo: ' + `${xmlPath}${finalFileName}.xml`);

                } else {

                    fs.writeFileSync(`${xmlPath}${finalFileName}.xml`, timbradoResponse.cfdiTimbrado.toString(), {encoding: 'utf-8'});

                    logger.info('Se ha guardado el archivo: ' + `${xmlPath}${finalFileName}`);

                }

                /**
                 * * Assign XML Data for cfdis Array
                 */
                const xmlBase64                     = Buffer.from(timbradoResponse.cfdiTimbrado.toString()).toString('base64');

                cfdiData.error                      = timbradoResponse.error;
                cfdiData.message                    = timbradoResponse.errorMessage;
                cfdiData.timbrado.statusCFDI        = 200;
                cfdiData.timbrado.uuid              = uuid;
                cfdiData.timbrado.cfdiTimbrado      = xmlBase64;
                cfdiData.timbrado.serie             = serie;
                cfdiData.timbrado.folio             = folio;
                cfdiData.timbrado.file              = path.basename(fileName, '.xml');

                /**
                 * * Generate PDF and get its Data (pdfBase64, emailTo and emailCC)
                 */
                let pdfBase64               = '';
                let emailTo                 = null;
                let emailCC                 = null;
                let poNumber                = null;
                let customMailSubject       = null;
                let mailSubject             = timbradoSettings.MailSubject;

                const sendingMail           = timbradoSettings.SendMail;
                const mailHost              = timbradoSettings.MailHost;
                const mailPort              = timbradoSettings.MailPort;
                const mailUser              = timbradoSettings.MailUser;
                const mailPassword          = timbradoSettings.MailPassword;
                const mailTemplate          = timbradoSettings.MailHTML;
                const mailSubjectFormat     = timbradoSettings.MailSubjectFormat;

                if ( !pdfFunction || pdfFunction.trim() === '' ) {

                    pdfBase64 = ''

                } else {

                    const pdfOptions            = {
                        pdfLogo: pdfLogo,
                        pdfFunction: pdfFunction
                    }
    
                    const pdfData               = await getInvoicePDF( tempPath, xmlBase64, xmls[i].additionalFiles, pdfOptions );
    
                    pdfBase64                   = getBase64String(pdfData.pdfBase64);
                    emailTo                     = pdfData.emailTo;
                    emailCC                     = pdfData.emailCC;
                    poNumber                    = pdfData.poNumber;

                }

                if( pdfBase64.trim().length === 0 ) {

                    logger.info('El PDF no se generó exitosamente o no existe función para generar PDF.');

                    cfdiData.timbrado.statusPDF         = 500;
                    cfdiData.timbrado.pdf               = '';

                } else {

                    logger.info('El PDF se generó existosamente.');
                    logger.info('Guardando PDF del CFDI Timbrado.');

                    if( possibleExtraStamped ) {

                        logger.info('WARNING: Es posible que haya ocurrido un timbrado múltiple del mismo archivo.');
                        logger.info('Guardando archivo PDF con el mismo nombre del posible duplicado: ' + finalFileName);

                    }

                    fs.writeFileSync(`${pdfPath}${finalFileName}.pdf`, pdfBase64, 'base64');

                    logger.info('Archivo PDF guardado: ' + `${pdfPath}${finalFileName}.pdf`);

                    /**
                     * * Assign PDF Data for cfdis Array
                     */
                    cfdiData.timbrado.statusPDF         = 200;
                    cfdiData.timbrado.pdf               = pdfBase64;

                }

                /**
                 * * Retrieve Email Data 
                 */
                const cleanedEmailTo = emailTo.map((mail) => {

                    const email = mail.replace(/(\r\n|\n|\r)/gm,'').trim();

                    return email;

                } );

                const cleanedEmailCC = emailCC.map((mail) => {

                    const email = mail.replace(/(\r\n|\n|\r)/gm,'').trim();

                    return email;

                } );

                cfdiData.timbrado.emailTo = cleanedEmailTo;
                cfdiData.timbrado.emailCC = cleanedEmailCC;

                if( !mailSubject || mailSubject.trim() === '' ) {

                    logger.info('Se debe enviar un Formato de Asunto Personalizado.')

                    if( !mailSubjectFormat || mailSubjectFormat.trim() === '' ){

                        logger.info('No se especifica el Formato de Asunto Personalizado, se envía genérico.')

                        mailSubject = 'Envío de Factura';

                    } else {

                        logger.info('El formato personalizado del Asunto es: ' + mailSubjectFormat);

                        const mailSubjectOptions = {

                            serie: serie,
                            folio: folio,
                            poNumber: poNumber,
                            issuer: issuerName

                        }

                        mailSubject = getCustomMailSubject( mailSubjectFormat, options );

                    }

                }

                /**
                 * * Send Mail if sendMail setting is true
                 */
                if( sendingMail ) {

                    logger.info('Se envía correo.');
                    
                    const emailOptions = {
                        mailSettingsType: 1,
                        mailManualSettings: {
                            mailHost: mailHost,
                            mailPort: mailPort,
                            mailUser: mailUser,
                            mailPassword: mailPassword,
                            mailSubject: mailSubject,
                            mailHTML: mailTemplate
                        }                    
                    }

                    let emailAttachments = [];

                    const invoiceXMLExists = fs.existsSync(`${xmlPath}${finalFileName}.xml`);
                    const invoicePDFExists = fs.existsSync(`${pdfPath}${finalFileName}.pdf`);

                    if( invoiceXMLExists ){

                        logger.info('Archivo XML agregado a los attachments.');

                        emailAttachments.push({path: `${xmlPath}${finalFileName}.xml`, filename: `${finalFileName}.xml`});

                    }

                    if( invoicePDFExists ) {

                        logger.info('Archivo PDF agregado a los attachments.');

                        emailAttachments.push({path: `${pdfPath}${finalFileName}.pdf`, filename: `${finalFileName}.pdf`});

                    }

                    const emailSent = await sendMail( emailTo, emailCC, emailAttachments, emailOptions );

                    if( emailSent ){

                        logger.info('Correo enviado correctamente.')

                    } else {

                        logger.info('WARNING: Correo no se envío correctamente.')

                    }

                } else {
                    logger.info('La configuración del timbrado indica que no se debe enviar correo.');
                }



                cfdis = [...cfdis, cfdiData];

            }

            /**
             * Update Timbres Control
             */
            let timbreData = {
                customer: idCustomer,
                uuid: uuid,
                response: response,
                request: request,
                fileName: fileName,
                serie: serie,
                folio: folio,
                executionMessage: successTimbrado ? 'EXITOSO' : 'ERROR',
                timbradoSuccess: successTimbrado,
                user: user,
                ip: '0.0.0.0'
            }

            logger.info('Timbre Data: '+  JSON.stringify(timbreData));

            const updateTimbresControl = await addCustomerStampingRecord(timbreData);

            if( updateTimbresControl.Code_Successful && updateTimbresControl.Code_Type === 'Success' ) {

                logger.info('Registro de Timbrado insertado correctamente. Los timbres disponibles fueron actualizados para el Cliente: ' + idCustomer);

            } else {

                logger.info('WARNING: No se registró el Timbrado en el Log. Los timbres disponibles no fueron actualizados para el Cliente: ' + idCustomer);
                logger.info('Mensaje de la Base de Datos: ' + updateTimbresControl.Code_Message_User );

            }

        }

        return cfdis;
        
    } catch (error) {

        console.log('Error en Procesar XMLs: ', error);
        logger.error('Error en Procesar XMLs: ' + error);

    }

}

function getCustomMailSubject(mailSubjectFormat, options) {

    logger.info('Las Opciones recibidas para el Asunto son: ' + mailSubjectOptions.toString());

    if( mailSubjectFormat === 'Serie|Folio|Issuer|PO' ) {

        return `${options.serie}${options.folio} ${options.issuer} ${options.poNumber}`;

    }

}

module.exports = {
    timbrar
}