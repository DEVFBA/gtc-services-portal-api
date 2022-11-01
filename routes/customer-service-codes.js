const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

const dbcustomerservice = require('../controllers/customer-service-codes')

//Ruta para obtener todos los Customers
router.route('/').get(auth, (request, response)=>{
    dbcustomerservice.getCustomersServiceCodes().then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener todos los Customers
router.route('/:idCustomer').get(auth, (request, response)=>{
    dbcustomerservice.getCustomerServiceCodes(request.params.idCustomer).then(result => {
        response.json(result[0]);
    })
})

//Ruta para insertar un customer key product
router.route('/insert').post(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/insert - POST -")
    dbcustomerservice.insertCustomerKeyProduct(register).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un customer key product
router.route('/update').put(auth, (request, response)=>{
    console.log("SI ENTRE")
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update - POST -")
    dbcustomerservice.updateCustomerKeyProduct(register).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;
