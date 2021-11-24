const router = require('express').Router();
const auth = require('./auth');

const dbcustomerapplications = require('../controllers/customer-applications')

//Ruta para obtener todos los customer applications
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbcustomerapplications.getCustomerApplications(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener una customer application de un cliente en especifico
router.route('/:id').get(auth, (request, response)=>{
    dbcustomerapplications.getCustomerApplicationsId(request.params.id).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los customer applications
router.route('/create-customer-application').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbcustomerapplications.insertCustomerApplication(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los customer applications
router.route('/update-customer-application').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbcustomerapplications.updateCustomerApplication(catRegister).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;