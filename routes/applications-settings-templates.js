const router = require('express').Router();
const auth = require('./auth');

const dbapplicationsettings = require('../controllers/application-settings-templates')

//Ruta para obtener todas las aplicaciones
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbapplicationsettings.getApplicationsSettings(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener una aplicacion por ID
router.route('/:id').get(auth, (request, response)=>{
    
    dbapplicationsettings.getApplicationsSettingsId(request.params.id).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;