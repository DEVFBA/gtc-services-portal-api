const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

const dbcustomerbilltos = require('../controllers/customer-bill-tos')

//Ruta para obtener todos los Customers Bill Tos
router.route('/').get(auth, (request, response)=>{
    dbcustomerbilltos.getCustomersBillTos().then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener todos los Customers
router.route('/:idCustomer').get(auth, (request, response)=>{
    dbcustomerbilltos.getCustomerBillTos(request.params.idCustomer).then(result => {
        response.json(result[0]);
    })
})

//Ruta para insertar un customer uoms
router.route('/insert').post(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/insert - POST -")
    dbcustomerbilltos.insertCustomerBillTos(register).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un customer uoms
router.route('/update').put(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update - POST -")
    dbcustomerbilltos.updateCustomerBillTos(register).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;