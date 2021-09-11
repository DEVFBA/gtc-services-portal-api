const router = require('express').Router();

//const dbappconfigclient = require('../controllers/routes')

//Ruta para todas las commercial releases
router.route('/:id').get((request, response)=>{
    console.log(request.params.id)
    /*const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        piIdCustomer : request.query.piIdCustomer,
        pvIdRole : request.query.pvIdRole
    };
    dbroutes.getRoutes(params).then(result => {
        response.json(result[0]);
    })*/
})

module.exports = router;