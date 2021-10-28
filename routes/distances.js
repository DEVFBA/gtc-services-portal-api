const router = require('express').Router();
const auth = require('./auth');
const authDistances = require('./authDistances');
var config2 = require('../configs/config');

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

//Ruta para obtener todas los assumptions
router.route('/').post(authDistances, (request, response)=>{
    let distances = {...request.body}
    dbdistances.getDistance(distances, response).then(result => {
        response.json(result);
    })
})

module.exports = router;