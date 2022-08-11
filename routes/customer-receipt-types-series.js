const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

const dbcustomerreceipttypesseries = require('../controllers/customer-receipt-types-series')

//Ruta para obtener todos los Customers receipt types series
router.route('/').get(auth, (request, response)=>{
    dbcustomerreceipttypesseries.getCustomersReceiptTypesSeries().then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener todos los Customers receipt types series
router.route('/:idCustomer').get(auth, (request, response)=>{
    dbcustomerreceipttypesseries.getCustomerReceiptTypesSeries(request.params.idCustomer).then(result => {
        response.json(result[0]);
    })
})

//Ruta para insertar un customer receipt types series
router.route('/insert').post(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/insert - POST -")
    dbcustomerreceipttypesseries.insertCustomerReceiptTypesSeries(register).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un customer receipt types series
router.route('/update').put(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update - POST -")
    dbcustomerreceipttypesseries.updateCustomerReceiptTypesSeries(register).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;