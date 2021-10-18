const router = require('express').Router();
const auth = require('./auth');

const dbarticulo69 = require('../controllers/article-69')

//Ruta para obtener los catálogos para el portal o SAT
router.route('/69').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        piIdCatalogType : request.query.piIdCatalogType,
    };
    dbarticulo69.getArticle69(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener los datos del artículo 69 externamente
router.route('/external-69').get((request, response)=>{
    const params = {
        piIdCustomer: request.query.piIdCustomer,
        pIdApplication : request.query.pIdApplication,
        pvIdUser : request.query.pvIdUser,
        pvPassword : request.query.pvPassword,
    };
    dbarticulo69.getArticle69External(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener los datos del artículo 69 externamente
router.route('/external-69B').get((request, response)=>{
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

//Ruta para obtener un catálogo de catálogos en específico
router.route('/69-B').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        pSpCatalog : request.query.pSpCatalog,
    };
    dbarticulo69.getArticle69B(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del Portal
router.route('/create-article-69').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbarticulo69.insertArticle69(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del Portal
router.route('/create-article-69-B').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbarticulo69.insertArticle69B(catRegister).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;