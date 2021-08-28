const router = require('express').Router();

const dbcommercialrelease = require('../controllers/commercial-release')

//Ruta para todas las commercial releases
router.route('/').get((request, response)=>{
    dbcommercialrelease.getCommercialRelease().then(result => {
        response.json(result[0]);
    })
})

//Ruta para guardar una commercial release
router.route('/crear').post((request, response)=>{
    let commercialrelease = {...request.body}
    dbcommercialrelease.insertCommercialRelease(commercialrelease).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;