const router = require('express').Router();
const auth = require('./auth');

const dbcatapplications = require('../controllers/cat-applications')

//Ruta para obtener todas las aplicaciones
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbcatapplications.getCatApplications(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener una aplicacion por ID
router.route('/:id').get(auth, (request, response)=>{
    dbcatapplications.getApplicationId(request.params.id).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;