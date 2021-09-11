const router = require('express').Router();

const dbusers = require('../controllers/security-users')

//Ruta para obtener todos los roles
router.route('/').get((request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbusers.getUsers(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;