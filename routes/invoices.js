const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

const dbinvoices = require('../controllers/invoices')

//Ruta para obtener todas las facturas generadas
router.route('/').get(auth, (request, response)=>{
    dbinvoices.getInvoices().then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener una factura en específico
router.route('/:idInvoice').get(auth, (request, response)=>{
    dbinvoices.getInvoice(request.params.idCustomer).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear una factura
router.route('/create').post(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create - POST -")
    dbinvoices.insertInvoice(register).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar una factura
router.route('/update').put(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update - POST -")
    dbinvoices.updateInvoice(register).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;