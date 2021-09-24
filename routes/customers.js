const router = require('express').Router();
const auth = require('./auth');
const dbcustomers = require('../controllers/customers')

//Ruta para obtener todos los Customers
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbcustomers.getCustomers(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un cliente
router.route('/create-customer').post(auth, (request, response)=>{
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    let userRegister = {...request.body}
    dbcustomers.insertCustomerRegister(userRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un cliente
router.route('/update-customer').put((request, response)=>{
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    let userRegister = {...request.body}
    dbcustomers.updateCustomerRegister(userRegister).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;