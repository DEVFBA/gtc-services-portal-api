const router = require('express').Router();
const auth = require('./auth');
const dbcustomersstamping = require('../controllers/customer-stampings')
// Para el logger
const logger = require('../utils/logger');

//Ruta para obtener todos los Customers Stampings
router.route('/').get(auth, (request, response)=>{
    console.log("si entre")
    dbcustomersstamping.getCustomersStampings().then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener todos los Customers Stamping
router.route('/:id').get(auth, (request, response)=>{
    dbcustomersstamping.getCustomersStamping(request.params.id).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un Customer Stamping
router.route('/create').post(auth, (request, response)=>{
    let userRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create - POST -")
    dbcustomersstamping.insertCustomerStamping(userRegister).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;