const router = require('express').Router();
const auth = require('./auth');

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

module.exports = router;