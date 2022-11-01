const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

const dbcustomeritemstaxes = require('../controllers/customer-items-taxes')

//Ruta para obtener todos los Customers Items Taxes
router.route('/').get(auth, (request, response)=>{
    dbcustomeritemstaxes.getCustomersItemsTaxes().then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener todos los Customers Items Taxes por IdCustomer
router.route('/:idCustomer').get(auth, (request, response)=>{
    dbcustomeritemstaxes.getCustomerItemsTaxes(request.params.idCustomer).then(result => {
        response.json(result[0]);
    })
})

//Ruta para insertar un customer item taxes
router.route('/insert').post(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/insert - POST -")
    dbcustomeritemstaxes.insertCustomerItemsTaxes(register).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un customer item taxes
router.route('/update').put(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update - POST -")
    dbcustomeritemstaxes.updateCustomerItemsTaxes(register).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;