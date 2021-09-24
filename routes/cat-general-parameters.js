const router = require('express').Router();
const auth = require('./auth');

const dbgeneralparameters = require('../controllers/cat-general-parameters')

//Ruta para obtener todos los general parameters
router.route('/').get(auth,(request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbgeneralparameters.getGeneralParameters(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;