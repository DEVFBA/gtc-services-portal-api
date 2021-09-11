const router = require('express').Router();

const dbcustomers = require('../controllers/customers')

//Ruta para obtener todos los Customers
router.route('/').get((request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbcustomers.getCustomers(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;