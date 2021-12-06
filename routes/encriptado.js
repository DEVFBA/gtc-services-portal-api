const router = require('express').Router();
const auth = require('./auth');

// Para el logger
const logger = require('../utils/logger');

const encrypt = require('../controllers/encriptado')

//Ruta para crear un registro para los catalogos del Portal
router.route('/create').post((request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create - POST -")
    encrypt.createEncrypt(catRegister).then(result => {
        response.json(result);
    })
})

module.exports = router;