const router = require('express').Router();
const auth = require('./auth');

const dbroutes = require('../controllers/routes')

//Ruta para obtener el menú dependiendo del tipo de cliente
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        piIdCustomer : request.query.piIdCustomer,
        pvIdRole : request.query.pvIdRole
    };
    dbroutes.getRoutes(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;