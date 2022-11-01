const router = require('express').Router();
const auth = require('./auth-external-applications');
const timbrado = require('../controllers/multicompany-timbrado-invOne');

const logger = require('../utils/logger');

router.route('/timbrar').post( auth, (request, response) => {

    const body =  request.body;

    logger.info( 'XMLs recibidos para timbrar: ' + JSON.stringify(body) );

    timbrado.timbrar( request, response ).then( result => {
        response.json(result);
    } );

} );

router.route('/obtenerCFDI/:uuid').get( auth, (request, response) => {

    const uuid = request.headers.uuid;

    logger.info('Recuperando XML del UUID: ' + uuid);

    timbrado.obtenerCFDI( request, response ).then( result => {
        response.json(result);

    })

})

module.exports = router;