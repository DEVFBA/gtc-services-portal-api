const router = require('express').Router();
// Para el logger
const logger = require('../utils/logger');

const dbcategoria = require('../controllers/cat-categories')

//Ruta para todas las categorías
router.route('/').get((request, response)=>{
    dbcategoria.getCategoria().then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener una categoría por ID
router.route('/:id').get((request, response)=>{
    dbcategoria.getCategoriaId(request.params.id).then(result => {
        response.json(result[0]);
    })
})

//Ruta para guardar una categoría
router.route('/crear').post((request, response)=>{
    let categoria = {...request.body}
    logger.info(JSON.stringify({...request.body}) + "/crear - POST -")
    dbcategoria.insertCategoria(categoria).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;