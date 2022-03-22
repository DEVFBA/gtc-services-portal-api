const router = require('express').Router();
const auth = require('./auth-external-applications');
const dbExternalApplication = require('../controllers/external-applications.js');
const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');

/**
 * * Login Route
 */
 router.route('/login').post((request, response)=>{

    const userData = request.body;

    logger.info( '/login - POST -: ' + JSON.stringify( userData ));

    dbExternalApplication.login( userData, response).then( result => {

        if( !result.data.success ) {

            response.status(401).json( result );

        } else {

            response.json( result );

        }
        
    });

});

/**
 * * Get Client Application Settings Route
 */
router.route('/application-settings').get(auth, async(request, response) => {

    try {

        const decode = jwt.decode(request.headers.authorization.split(' ')[1]);
        const idApplication = decode.idApplication;
        const idCustomer = decode.idCustomer;

        logger.info('Se solicitó los Settings de la Aplicación Externa: ' + idApplication + ' para el Customer: ' + idCustomer);

        const result = await dbExternalApplication.getApplicationSettings(idApplication, idCustomer);

        response.json(result);
        
    } catch (error) {

        console.log('Error en Route External Application Settings: ' + error);
        logger.info('Error en Route External Application Settings: ' + JSON.stringify(error));

    }

});

module.exports = router;