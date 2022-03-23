const router = require('express').Router();
const auth = require('./auth');
const dbrequestcustomersstamping = require('../controllers/request-customer-stamping')
// Para el logger
const logger = require('../utils/logger');

//Ruta para obtener todos los Customers Stamping de un cliente
router.route('/:id').get(auth, (request, response)=>{
    dbrequestcustomersstamping.getRequestsCustomersStamping(request.params.id).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;