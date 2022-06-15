const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

const dbcustomeruoms = require('../controllers/customer-uoms')

//Ruta para obtener todos los Customers
router.route('/').get(auth, (request, response)=>{
    dbcustomeruoms.getCustomersUoMs().then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener todos los Customers
router.route('/:idCustomer').get(auth, (request, response)=>{
    dbcustomeruoms.getCustomerUoMs(request.params.idCustomer).then(result => {
        response.json(result[0]);
    })
})

//Ruta para insertar un customer uoms
router.route('/insert').post(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/insert - POST -")
    dbcustomeruoms.insertCustomerUoMs(register).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un customer uoms
router.route('/update').put(auth, (request, response)=>{
    let register = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update - POST -")
    dbcustomeruoms.updateCustomerUoMs(register).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;
