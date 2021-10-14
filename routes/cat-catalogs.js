const router = require('express').Router();
const auth = require('./auth');

const dbcatcatalogs = require('../controllers/cat-catalogs')

//Ruta para obtener los catálogos para el portal o SAT
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        piIdCatalogType : request.query.piIdCatalogType,
    };
    dbcatcatalogs.getCatalogs(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener un catálogo de catálogos en específico
router.route('/catalog').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        pSpCatalog : request.query.pSpCatalog,
    };
    dbcatcatalogs.getCatalog(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del Portal
router.route('/create-portal').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbcatcatalogs.insertCatRegisterPortal(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del Portal
router.route('/update-portal').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbcatcatalogs.updateCatRegisterPortal(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT
router.route('/create-sat').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbcatcatalogs.insertCatRegisterSAT(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Assumptions, tiene un campo más
router.route('/create-sat-assumptions').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbcatcatalogs.insertCatRegisterSATAssumptions(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT
router.route('/update-sat').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbcatcatalogs.updateCatRegisterSAT(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Assumptions, tiene un campo más
router.route('/update-sat-assumptions').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    dbcatcatalogs.updateCatRegisterSATAssumptions(catRegister).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;