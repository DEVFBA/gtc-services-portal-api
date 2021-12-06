const router = require('express').Router();
const auth = require('./auth');
const authDistances = require('./authDistances');
var config2 = require('../configs/config');
// Para el logger
const logger = require('../utils/logger');

const dbdistances = require('../controllers/distances')

//Ruta para iniciar sesion
router.route('/login').post((request, response)=>{
    let userRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/login - POST -")
    dbdistances.login(userRegister, response).then(result => {
       
        if(result[0].error !== undefined)
        {
            response.status(401)
        }
        response.json(result[0]);
    })
})

//Ruta para obtener distancias
router.route('/').post(authDistances, (request, response)=>{
    let distances = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/ - POST -")
    dbdistances.getDistance(distances, response).then(result => {
        if(result.error!== undefined)
        {
            response.status(400)
        }
        response.json(result);
    })
})

//Ruta para obtener distancias sin token
router.route('/WT/').post((request, response)=>{
    let distances = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/WT/ - POST -")
    dbdistances.getDistanceWT(distances, response).then(result => {
        if(result.error!== undefined)
        {
            response.status(400)
        }
        response.json(result);
    })
})

module.exports = router;