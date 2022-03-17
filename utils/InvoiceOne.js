const soap              = require('soap');
const logger            = require('./logger');

const { 
    DOMParser
}                       = require('@xmldom/xmldom');

const {
    getCircularReplacer
}                       = require('../utils/JSONHelper');

async function timbrarFactura( stringXML, timbradoWSURL, timbradoWSUser, timbradoPassword, environment ) {

    try {

        let timbradoResponse = {
            error: 0,
            errorMessage: '',
            errorCode: null,
            uuid: '',
            cfdiTimbrado: '',
            serie: '',
            folio: ''
        }

        const args = {
            usuario: timbradoWSUser,
            contrasena: timbradoPassword,
            xmlComprobante: stringXML
        }

        logger.info('Empieza proceso de función timbrarFactura.');

        let response = await getTimbradoResponse(timbradoWSURL, args, environment);

        const responseXML   = new DOMParser().parseFromString(response.data);

        logger.info('Respuesta de Invoice One: ' + responseXML);

        if( response.success === 0 ) {

            const errorMessage                  = responseXML.getElementsByTagName('MensajeError')[0].textContent;
            const errorCode                     = responseXML.getElementsByTagName('CodigoError')[0].textContent;
            
            timbradoResponse.error              = 1;
            timbradoResponse.errorMessage       = errorMessage;
            timbradoResponse.errorCode          = errorCode;

            return timbradoResponse;

        } else {

            const uuid                          = responseXML.getElementsByTagName('tfd:TimbreFiscalDigital')[0].getAttribute('UUID');

            timbradoResponse.uuid               = uuid;
            timbradoResponse.cfdiTimbrado       = responseXML;

            if( !responseXML.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Serie') ) {
                
                timbradoResponse.serie = '';

            } else {

                timbradoResponse.serie = responseXML.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Serie');

            }

            if( !responseXML.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Folio') ) {
                
                timbradoResponse.folio = '';

            } else {

                timbradoResponse.folio = responseXML.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Folio');

            }

            return timbradoResponse;

        }
    
    } catch (error) {

        console.log('ERROR: Error en timbrarFactura: ', error);
        logger.error('ERROR: Error en timbrarFactura: ' + error);
        
    }

}

async function getTimbradoResponse( timbradoWSURL, args, environment ) {

    try {
        
        return new Promise( (resolve, reject) => {

            soap.createClient(timbradoWSURL, function(err, client) {

                if(err){

                    console.log('Err en createClient: ', err);
                    logger.error('ERROR: Error en createClient: ', + JSON.stringify(err, getCircularReplacer()));

                }

                /**
                 * * Call Function to Get Stamped CFDI depending on environment
                 */
                if( environment === 'PROD' ) {

                    client.ObtenerCFDI(args, function(err, result) {

                        logger.info('Timbrando en Producción.');
    
                        let response = {
                            success: 0,
                            data: ''
                        }
    
                        if(err) {
    
                            console.log('Err en ObtenerCFDI:' , err);
                            logger.info('WARNING: ObtenerCFDI regresó error de Timbrado: ' + JSON.stringify(err, getCircularReplacer()));
    
                            response.success = 0;
                            response.data = result.data;
    
                            resolve(response);
    
                        } else {
    
                            response.success = 1;
                            response.data    = result.ObtenerCFDIPruebaResult.Xml;
                        
                            resolve(response);
    
                        }
    
                    });

                } else {

                    client.ObtenerCFDIPrueba(args, function(err, result) {

                        logger.info('Timbrando en Pruebas.');
    
                        let response = {
                            success: 0,
                            data: ''
                        }
    
                        if(err) {
    
                            console.log('Err en ObtenerCFDIPrueba:' , err);
                            logger.info('WARNING: ObtenerCFDIPrueba regresó error de Timbrado: ' + JSON.stringify(err, getCircularReplacer()));
    
                            response.success = 0;
                            response.data = result.data;
    
                            resolve(response);
    
                        } else {
    
                            response.success = 1;
                            response.data    = result.ObtenerCFDIPruebaResult.Xml;
                        
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

module.exports = {
    timbrarFactura
}
