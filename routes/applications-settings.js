const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

const dbapplicationsettings = require('../controllers/applications-settings')

//Ruta para obtener todas las aplicaciones de un cliente en específico
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        piIdCustomer: request.query.piIdCustomer,
        piIdApplication: request.query.piIdApplication
    };
    console.log(params)
    dbapplicationsettings.getApplicationsSettings(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar una configuracion
router.route('/update-settings').put(auth, (request, response)=>{
    let settingRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-settings - PUT -")
    dbapplicationsettings.updateSettings(settingRegister).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;