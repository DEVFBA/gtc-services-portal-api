const router = require('express').Router();

const dbgeneralparameters = require('../controllers/cat-general-parameters')

//Ruta para obtener todos los general parameters
router.route('/').get((request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbgeneralparameters.getGeneralParameters(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;