const router = require('express').Router();
const auth = require('./auth-external-applications');
const dbExternalApplication = require('../controllers/external-applications.js');

const logger = require('../utils/logger');

/**
 * * Login Route
 */
 router.route('/login').post((request, response)=>{

    const userData = request.body;

    logger.info( '/login - POST -: ' + JSON.stringify( userData ));

    dbExternalApplication.login( userData, response).then( result => {
        response.json( result );
    });

});

/**
 * * Get Client Application Settings Route
 */
router.route('/application-setting/:id').get(auth, async(request, response) => {

    try {

        logger.info('Se solicitó los Settings de la Aplicación Externa: ' + request.params.id);

        const result = await dbExternalApplication.getApplicationSettings(request.params.id);

        response.json(result);
        
    } catch (error) {

        console.log('Error en Route External Application Settings: ' + error);
        logger.info('Error en Route External Application Settings: ' + JSON.stringify(error));

    }

});

module.exports = router;