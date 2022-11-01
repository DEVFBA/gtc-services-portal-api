const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

const dbcustomeritems = require('../controllers/customer-items')

//Ruta para obtener todos los Customers Items
router.route('/').get(auth, (request, response)=>{
    dbcustomeritems.getCustomersItems().then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener todos los Customers por IdCustomer
router.route('/:idCustomer').get(auth, (request, response)=>{
    dbcustomeritems.getCustomerItems(request.params.idCustomer).then(result => {
        response.json(result[0]);
    })
})

//Ruta para insertar un customer item
router.route('/insert').post(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/insert - POST -")
    dbcustomeritems.insertCustomerItems(register).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un customer item
router.route('/update').put(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update - POST -")
    dbcustomeritems.updateCustomerItems(register).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;