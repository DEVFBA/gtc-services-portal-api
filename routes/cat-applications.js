const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

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

//Ruta para crear una aplicación
router.route('/create-application').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-application - POST -")
    dbcatapplications.insertCatRegisterApplication(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar una aplicación
router.route('/update-application').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-application - POST -")
    dbcatapplications.updateCatRegisterApplication(catRegister).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;