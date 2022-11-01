const soap              = require('soap');
const logger            = require('../logger');

const { 
    DOMParser
}                       = require('@xmldom/xmldom');

const {
    getCircularReplacer
}                       = require('../JSONHelper');

async function timbrarFactura( stringXML, timbradoWSURL, timbradoWSUser, timbradoPassword, environment ) {

    try {

        let timbradoResponse = {
            error: false,
            errorMessage: '',
            errorCode: null,
            uuid: '',
            cfdiTimbrado: '',
            request: '',
            response: ''
        }

        const argsTest = {
            usuario: timbradoWSUser,
            contrasena: timbradoPassword,
            xmlComprobante: stringXML
        }

        const argsProd = {
            nombreUsuario: timbradoWSUser,
            contrasena: timbradoPassword,
            xmlComprobante: stringXML
        }

        logger.info('Empieza proceso de función timbrarFactura.');

        let args = {};

        if( environment === 'PROD' ) {

            args = argsProd;

        } else {

            args = argsTest;

        }

        let response = await getTimbradoResponse(timbradoWSURL, args, environment);

        const responseXML   = new DOMParser().parseFromString(response.data.response);
        
        logger.info('Respuesta de Invoice One: ' + responseXML);
        
        if( !response.success ) {
            
            const errorMessage                  = responseXML.getElementsByTagName('MensajeError')[0].textContent;
            const errorCode                     = responseXML.getElementsByTagName('CodigoError')[0].textContent;
            
            timbradoResponse.error              = true;
            timbradoResponse.errorMessage       = errorMessage;
            timbradoResponse.errorCode          = errorCode;
            timbradoResponse.request            = response.data.request;
            timbradoResponse.response           = response.data.response;

            return timbradoResponse;

        } else {

            const uuid                          = responseXML.getElementsByTagName('tfd:TimbreFiscalDigital')[0].getAttribute('UUID');

            timbradoResponse.uuid               = uuid;
            timbradoResponse.cfdiTimbrado       = responseXML;
            timbradoResponse.response           = response.data.response;
            timbradoResponse.request            = args.xmlComprobante;

            return timbradoResponse;

        }
    
    } catch (error) {

        console.log('ERROR: Error en timbrarFactura: ', error);
        logger.error('ERROR: Error en timbrarFactura: ' + error);

        return false;
        
    }

}

async function getTimbradoResponse( timbradoWSURL, args, environment ) {

    try {
        
        return new Promise( (resolve, reject) => {

            soap.createClient(timbradoWSURL, function(err, client) {

                if(err){

                    logger.error('ERROR: Error en createClient: ', + JSON.stringify(err, getCircularReplacer()));

                }

                /**
                 * * Call Function to Get Stamped CFDI depending on environment
                 */
                if( environment === 'PROD' ) {

                    client.ObtenerCFDI(args, function(err, result) {

                        logger.info('Timbrando en Producción.');
    
                        let response = {
                            success: false,
                            data: {
                                request: '',
                                response: ''
                            }
                        }
    
                        if(err) {
    
                            logger.info('WARNING: ObtenerCFDI regresó error de Timbrado: ' + JSON.stringify(err, getCircularReplacer()));
    
                            response.success        = false;
                            response.data.request   = result.config.data;
                            response.data.response  = result.data;
    
                            resolve(response);
    
                        } else {
    
                            response.success        = true;
                            response.data.request   = args.xmlComprobante;
                            response.data.response  = result.ObtenerCFDIResult.Xml;
                        
                            resolve(response);
    
                        }
    
                    });

                } else {

                    client.ObtenerCFDIPrueba(args, function(err, result) {

                        logger.info('Timbrando en Pruebas.');
    
                        let response = {
                            success: false,
                            data: {
                                xml: '',
                                request: '',
                                response: ''
                            }
                        }
    
                        if(err) {
    
                            logger.info('WARNING: ObtenerCFDIPrueba regresó error de Timbrado: ' + JSON.stringify(err, getCircularReplacer()));
    
                            response.success        = false;
                            response.data.request   = result.config.data;
                            response.data.response  = result.data;
    
                            resolve(response);
    
                        } else {
    
                            response.success        = true;
                            response.data.request   = args.xmlComprobante;
                            response.data.response  = result.ObtenerCFDIPruebaResult.Xml;
                        
                            resolve(response);
    
                        }
    
                    });

                }

            });

        });

    } catch (error) {

        console.log('ERROR: Error en getTimbradoResponse: ', error);
        logger.error('ERROR: Error en getTimbradoResponse: ' + error);
        
    }

}

async function getComprobante( timbradoWSURL, args, environment ) {

    try {
        
        return new Promise( (resolve, reject) => {

            soap.createClient(timbradoWSURL, function(err, client) {

                if(err){

                    logger.error('ERROR: Error en createClient: ', + JSON.stringify(err, getCircularReplacer()));

                }

                /**
                 * * Call Function to Get Stamped CFDI depending on environment
                 */
                if( environment === 'PROD' ) {

                    client.ObtenerCFDI(args, function(err, result) {

                        logger.info('Timbrando en Producción.');
    
                        let response = {
                            success: false,
                            data: {
                                request: '',
                                response: ''
                            }
                        }
    
                        if(err) {
    
                            logger.info('WARNING: ObtenerCFDI regresó error de Timbrado: ' + JSON.stringify(err, getCircularReplacer()));
    
                            response.success        = false;
                            response.data.request   = result.config.data;
                            response.data.response  = result.data;
    
                            resolve(response);
    
                        } else {
    
                            response.success        = true;
                            response.data.request   = args.xmlComprobante;
                            response.data.response  = result.ObtenerCFDIPruebaResult.Xml;
                        
                            resolve(response);
    
                        }
    
                    });

                } else {

                    client.recuperaComprobanteXML(args, function(err, result) {

                        console.log('Recuperando comprobante.');

                        console.log(args);
    
                        let response = {
                            success: false,
                            data: {
                                xml: '',
                                request: '',
                                response: ''
                            }
                        }

                        console.log('Result', result);
    
                        if(err) {
    
                            logger.info('WARNING: ObtenerCFDIPrueba regresó error de Timbrado: ' + JSON.stringify(err, getCircularReplacer()));
    
                            response.success        = false;
                            response.data.request   = result.config.data;
                            response.data.response  = result.data;
    
                            resolve(response);
    
                        } else {
    
                            response.success        = true;
                            response.data.request   = args.xmlComprobante;
                            response.data.response  = result.ObtenerCFDIPruebaResult.Xml;
                        
                            resolve(response);
    
                        }
    
                    });

                }

            });

        });

    } catch (error) {

        console.log('ERROR: Error en getComprobante: ', error);
        logger.error('ERROR: Error en getComprobante: ' + error);
        
    }

}

module.exports = {
    timbrarFactura,
    getComprobante
}
