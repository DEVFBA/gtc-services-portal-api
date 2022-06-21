const router = require('express').Router();
const auth = require('./auth');
const dbcustomers = require('../controllers/customers')
// Para el logger
const logger = require('../utils/logger');

//Ruta para obtener todos los Customers
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbcustomers.getCustomers(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener un cliente por id
router.route('/:id').get(auth, (request, response)=>{
    dbcustomers.getCustomerById(request.params.id).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener un cliente por nombre
router.route('/get-by-name/:name').get(auth, (request, response)=>{
    dbcustomers.getCustomer(request.params.name).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un cliente
router.route('/create-customer').post(auth, (request, response)=>{
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    let userRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-customer - POST -")
    dbcustomers.insertCustomerRegister(userRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un cliente
router.route('/update-customer').put((request, response)=>{
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    let userRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-customer - PUT -")
    dbcustomers.updateCustomerRegister(userRegister).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;