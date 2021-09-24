const router = require('express').Router();
const auth = require('./auth');

const dbcustomerapplicationsusers = require('../controllers/customer-applications-users')

//Ruta para obtener todos los customer applications users
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        piIdCustomer: request.query.piIdCustomer,
        pIdApplication: request.query.pIdApplication
    };
    dbcustomerapplicationsusers.getCustomerApplicationsUsers(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear usuario
router.route('/create-customer-application-user').post(auth, (request, response)=>{
    let userRegister = {...request.body}
    dbcustomerapplicationsusers.insertCustomerApplicationsUsers(userRegister).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;