const router = require('express').Router();
const auth = require('./auth');
const dbcustomersstamping = require('../controllers/customer-stampings')
// Para el logger
const logger = require('../utils/logger');

//Ruta para obtener todos los Customers Stamping
router.route('/:id').get(auth, (request, response)=>{
    dbcustomersstamping.getCustomersStamping(request.params.id).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;