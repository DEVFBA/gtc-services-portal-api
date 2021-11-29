const router = require('express').Router();
const auth = require('./auth-timbrado-CD');
const auth69 = require('./auth69');

const {
    login,
    timbrar
} = require('../controllers/timbrado-ws-CD');


// Ruta para iniciar sesion

router.post('/login', login);

// Ruta para timbrar

router.post('/timbrado', auth, timbrar);

module.exports = router;
        
