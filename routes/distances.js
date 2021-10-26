const router = require('express').Router();
const auth = require('./auth');
const authDistances = require('./authDistances');

const dbdistances = require('../controllers/distances')

//Ruta para iniciar sesion
router.route('/login').post((request, response)=>{
    let userRegister = {...request.body}
    dbdistances.login(userRegister, response).then(result => {
       
        if(result[0].error !== undefined)
        {
            response.status(401)
        }
        response.json(result[0]);
    })
})

module.exports = router;