const router = require('express').Router();
const auth = require('./auth');
const auth69 = require('./auth69');

const {
    login
} = require('../controllers/timbrado-ws-CD');


//Ruta para iniciar sesion

router.post('/login', login);

module.exports = router;
        
