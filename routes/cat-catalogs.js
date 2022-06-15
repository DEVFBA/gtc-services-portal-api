const router = require('express').Router();
const auth = require('./auth');
// Para el logger
const logger = require('../utils/logger');

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

//Ruta para obtener una clave producto por id
router.route('/get-key-product/:id').get(auth, (request, response)=>{
    dbcatcatalogs.getKeyProduct(request.params.id).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener una custom uom por id
router.route('/get-custom-uom/:id').get(auth, (request, response)=>{
    dbcatcatalogs.getCustomUoM(request.params.id).then(result => {
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
    logger.info(JSON.stringify({...request.body}) + "/create-portal - POST -")
    dbcatcatalogs.insertCatRegisterPortal(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del Portal Groupers
router.route('/create-portal-grouper').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-portal-grouper - POST -")
    dbcatcatalogs.insertCatRegisterPortalGrouper(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del Portal
router.route('/update-portal').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-portal - PUT -")
    dbcatcatalogs.updateCatRegisterPortal(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del Portal
router.route('/update-portal-grouper').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-portal-grouper - PUT -")
    dbcatcatalogs.updateCatRegisterPortalGrouper(catRegister).then(result => {
        response.json(result[0]);
    })
})


//Ruta para crear un registro para los catalogos del SAT
router.route('/create-sat').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat - POST -")
    dbcatcatalogs.insertCatRegisterSAT(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Assumptions, tiene un campo más
router.route('/create-sat-assumptions').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-assumptions - POST -")
    dbcatcatalogs.insertCatRegisterSATAssumptions(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Estado
router.route('/create-sat-states').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-states - POST -")
    dbcatcatalogs.insertCatRegisterSATStates(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Localidades
router.route('/create-sat-locations').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-locations - POST -")
    dbcatcatalogs.insertCatRegisterSATLocations(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Municipios
router.route('/create-sat-municipalities').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-municipalities - POST -")
    dbcatcatalogs.insertCatRegisterSATMunicipalities(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Monedas
router.route('/create-sat-currencies').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-currencies - POST -")
    dbcatcatalogs.insertCatRegisterSATCurrencies(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Regimenes Fiscales
router.route('/create-sat-tax-regimes').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-tax-regimes - POST -")
    dbcatcatalogs.insertCatRegisterSATTaxRegimes(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Impuestos
router.route('/create-sat-taxes').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-taxes - POST -")
    dbcatcatalogs.insertCatRegisterSATTaxes(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Fracciones Arancelarias
router.route('/create-sat-tariff-fractions').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-tariff-fractions - POST -")
    dbcatcatalogs.insertCatRegisterSATTariffFractions(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Tasa O Cuota
router.route('/create-sat-tax-fee').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-tax-fee - POST -")
    dbcatcatalogs.insertCatRegisterSATTaxFee(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Clave Producto Servicio
router.route('/create-sat-key-product').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-key-product - POST -")
    dbcatcatalogs.insertCatRegisterSATKeyProduct(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear un registro para los catalogos del SAT Tipos de persona
router.route('/create-sat-entity-type').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-sat-entity-type - POST -")
    dbcatcatalogs.insertCatRegisterSATEntityType(catRegister).then(result => {
        response.json(result[0]);
    })
})


//Ruta para crear un registro para los catalogos del SAT Tipos de persona
router.route('/create-tax-regimens-cfdi-uses').post(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/create-tax-regimens-cfdi-uses - POST -")
    dbcatcatalogs.insertTaxRegimensCFDIUses(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT
router.route('/update-sat').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat - PUT -")
    dbcatcatalogs.updateCatRegisterSAT(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Assumptions, tiene un campo más
router.route('/update-sat-assumptions').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-assumptions - PUT -")
    dbcatcatalogs.updateCatRegisterSATAssumptions(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Estados
router.route('/update-sat-states').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-states - PUT -")
    dbcatcatalogs.updateCatRegisterSATStates(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Localidades
router.route('/update-sat-locations').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-locations - PUT -")
    dbcatcatalogs.updateCatRegisterSATLocations(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Municipios
router.route('/update-sat-municipalities').put(auth, (request, response)=>{
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-municipalities - PUT -")
    dbcatcatalogs.updateCatRegisterSATMunicipalities(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Monedas
router.route('/update-sat-currencies').put(auth, (request, response)=> {
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-currencies - PUT -")
    dbcatcatalogs.updateCatRegisterSATCurrencies(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Regimenes Fiscales
router.route('/update-sat-tax-regimes').put(auth, (request, response)=> {
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-tax-regimes - PUT -")
    dbcatcatalogs.updateCatRegisterSATTaxRegimes(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Impuestos
router.route('/update-sat-taxes').put(auth, (request, response)=> {
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-taxes - PUT -")
    dbcatcatalogs.updateCatRegisterSATTaxes(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Fracciones Arancelarias
router.route('/update-sat-tariff-fractions').put(auth, (request, response)=> {
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-tariff-fractions - PUT -")
    dbcatcatalogs.updateCatRegisterSATTariffFractions(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Fracciones Arancelarias
router.route('/update-sat-tax-fee').put(auth, (request, response)=> {
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-tax-fee - PUT -")
    dbcatcatalogs.updateCatRegisterSATTaxFee(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Clave Producto servicio
router.route('/update-sat-key-product').put(auth, (request, response)=> {
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-key-product - PUT -")
    dbcatcatalogs.updateCatRegisterSATKeyProduct(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los catalogos del SAT Clave Producto servicio
router.route('/update-sat-entity-type').put(auth, (request, response)=> {
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-sat-entity-type - PUT -")
    dbcatcatalogs.updateCatRegisterSATEntityType(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un registro para los tax regimens cfdi uses
router.route('/update-tax-regimens-cfdi-uses').put(auth, (request, response)=> {
    let catRegister = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/update-tax-regimens-cfdi-uses - PUT -")
    dbcatcatalogs.updateTaxRegimensCFDIUses(catRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener los ubicaciones de acuerdo al Codigo Postal
router.route('/zip-codes').get(auth, (request, response)=>{
    const params = {
        pvZip_Code : request.query.pvZip_Code,
    };
    dbcatcatalogs.getUbicZipCode(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener una ubicación de acuerdo al Codigo Postal para pintar el nombre de su colonia
router.route('/zip-code-county').get((request, response)=>{
    const params = {
        pvIdState : request.query.pvIdState,
        pvIdCounty : request.query.pvIdCounty,
    };
    dbcatcatalogs.getUbicZipCodeCounty(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;