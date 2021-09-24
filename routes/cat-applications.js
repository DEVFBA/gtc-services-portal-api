const router = require('express').Router();
const auth = require('./auth');

const dbcatapplications = require('../controllers/cat-applications')

//Ruta para obtener todos los general parameters
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbcatapplications.getCatApplications(params).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;