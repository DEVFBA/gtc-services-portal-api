const router = require('express').Router();
const auth = require('./auth');
const auth69 = require('./auth69');

const dbarticulo69 = require('../controllers/article-69')
// Para el logger
const logger = require('../utils/logger');

//Ruta para obtener los datos del Articulo 69
router.route('/69').get(auth, (request, response)=>{
    const params = {
        pvIdAssumption: request.query.pvIdAssumption,
    };
    dbarticulo69.getArticle69(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener los datos del artículo 69 externamente
router.route('/external-69').get(auth69, (request, response)=>{
    dbarticulo69.getArticle69External().then(result => {
        if(result[0].error !== undefined)
        {
            response.status(422)
        }
        response.json(result[0]);
    })
})

//Ruta para obtener los datos del artículo 69 externamente
router.route('/external-69B').get(auth69, (request, response)=>{
    const params = {
        piIdCustomer: request.query.piIdCustomer,
        pIdApplication : request.query.pIdApplication,
        pvIdUser : request.query.pvIdUser,
        pvPassword : request.query.pvPassword,
    };
    dbarticulo69.getArticle69BExternal(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener los datos del articulo 69 b
router.route('/69-B').get(auth, (request, response)=>{
    dbarticulo69.getArticle69B().then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del Portal
router.route('/create-article-69').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-article-69 - POST -")
    dbarticulo69.insertArticle69(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del Portal
router.route('/create-article-69-B').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-article-69-B - POST -")
    dbarticulo69.insertArticle69B(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para iniciar sesion
router.route('/login').post((request, response)=>{
    let userRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/login - POST -")
    dbarticulo69.login(userRegister, response).then(result => {
        //console.log(response.status)
       
        if(result[0].error !== undefined)
        {
            response.status(401)
        }
        response.json(result[0]);
    })
})

module.exports = router;