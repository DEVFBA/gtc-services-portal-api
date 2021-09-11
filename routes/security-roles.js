const router = require('express').Router();

const dbroles = require('../controllers/security-roles')

//Ruta para obtener todos los roles
router.route('/').get((request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbroles.getRoles(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;