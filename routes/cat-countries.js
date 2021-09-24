const router = require('express').Router();

const dbcatcountries = require('../controllers/cat-countries')

//Ruta para obtener todos los paises
router.route('/').get((request, response)=>{
    dbcatcountries.getCatCountries().then(result => {
        response.json(result[0]);
    })
})

module.exports = router;