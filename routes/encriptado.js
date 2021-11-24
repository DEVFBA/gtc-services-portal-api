const router = require('express').Router();
const auth = require('./auth');

const encrypt = require('../controllers/encriptado')

//Ruta para crear un registro para los catalogos del Portal
router.route('/create').post((request, response)=>{
    let catRegister = {...request.body}
    encrypt.createEncrypt(catRegister).then(result => {
        response.json(result);
    })
})

module.exports = router;