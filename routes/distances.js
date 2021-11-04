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

//Ruta para obtener distancias
router.route('/').post(authDistances, (request, response)=>{
    let distances = {...request.body}
    dbdistances.getDistance(distances, response).then(result => {
        if(result.error!== undefined)
        {
            response.status(400)
        }
        response.json(result);
    })
})

//Ruta para obtener distancias sin token
router.route('/WT/').post((request, response)=>{
    let distances = {...request.body}
    dbdistances.getDistanceWT(distances, response).then(result => {
        if(result.error!== undefined)
        {
            response.status(400)
        }
        response.json(result);
    })
})

module.exports = router;