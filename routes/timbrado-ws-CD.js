const router = require('express').Router();
const auth = require('./auth-timbrado-CD');

const {
    login,
    timbrar,
    getClientSettings
} = require('../controllers/timbrado-ws-CD');


// Login Route

router.post('/login', login);

// Route to Client application settings

router.get('/get-client-settings', auth, getClientSettings);

// Timbrar Route

router.post('/timbrado', auth, timbrar);

module.exports = router;
        
