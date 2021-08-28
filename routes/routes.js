const router = require('express').Router();

const dbroutes = require('../controllers/routes')

//Ruta para todas las commercial releases
router.route('/').get((request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        pIdCustomer : request.query.pIdCustomer,
        pvIdRole : request.query.pvIdRole
    };
    dbroutes.getRoutes(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;