const soap              = require('soap');
const logger = require('./logger');

async function timbrarFactura( stringXML, timbradoWSURL, timbradoWSUser, timbradoPassword ) {

    try {

        const args = {
            usuario: timbradoWSUser,
            contrasena: timbradoPassword,
            xmlComprobante: stringXML
        }

        let response = await getTimbradoResponse(timbradoWSURL, args);

        console.log('Response: ', response);
    
    } catch (error) {

        console.log('ERROR: Error en timbrarFactura: ', error);
        logger.error('ERROR: Error en timbrarFactura: ', JSON.stringify(error));
        
    }

}

async function getTimbradoResponse(timbradoWSURL, args) {

    try {
        
        return new Promise( (resolve, reject) => {

            soap.createClient(timbradoWSURL, function(err, client) {

                if(err){

                    console.log('Err en createClient: ', err);
                    logger.error('ERROR: Error en createClient: ', + JSON.stringify(err));

                }

                client.ObtenerCFDIPrueba(args, function(err, result) {

                    if(err){

                        console.log('Err en ObtenerCFDIPrueba:' , err);
                        logger.error('ERROR: Error en ObtenerCFDIPrueba: ' + JSON.stringify(err));

                        response.success = 0;
                        response.data = err.data;

                        reject();

                    }

                    let response = {
                        success: 0,
                        data: ''
                    }

                    if(result.status !== 200) {

                        response.success = 0;
                        response.data = result.data;

                        resolve(response);

                    }

                    response.success = 1;
                    response.data    = result.ObtenerCFDIPruebaResult.Xml;

                    resolve(response);
                    
                });
            });

        });

    } catch (error) {

        console.log('ERROR: Error en getTimbradoResponse: ', error);
        logger.error('ERROR: Error en getTimbradoResponse: ' + JSON.stringify(error));
        
    }

}

module.exports = {
    timbrarFactura
}
