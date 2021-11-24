const router = require('express').Router();
const auth = require('./auth');
const dbcfdipdfrequest = require('../controllers/cfdi-pdf-requests')

//Ruta para obtener todos los CFDI PDF Request
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbcfdipdfrequest.getCFDIPDFRequest(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener un catálogo de catálogos en específico
router.route('/customer-cfdi-pdf').get((request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        piIdCustomer: request.query.piIdCustomer,
        pvRequestCustomer: request.query.pvRequestCustomer
    };
    dbcfdipdfrequest.getCustomerCFDI(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;