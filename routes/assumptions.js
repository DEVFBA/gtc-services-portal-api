const router = require('express').Router();
const auth = require('./auth');

const dbcatassumptions = require('../controllers/assumptions')

//Ruta para obtener todas los assumptions
router.route('/').get(auth, (request, response)=>{
    dbcatassumptions.getAssumptions().then(result => {
        response.json(result[0]);
    })
})

module.exports = router;