const router = require('express').Router();

const dbusers = require('../controllers/security-users')

//Ruta para obtener todos los usuarios
router.route('/').get((request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbusers.getUsers(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener un usuario por ID
router.route('/:id').get((request, response)=>{
    dbusers.getUserId(request.params.id).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear usuario
router.route('/create-user').post((request, response)=>{
    let userRegister = {...request.body}
    dbusers.insertUserRegister(userRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un usuario
router.route('/update-user').put((request, response)=>{
    let userRegister = {...request.body}
    dbusers.updateUserRegister(userRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un usuario sin cambiar el password
router.route('/update-user-wp').put((request, response)=>{
    let userRegister = {...request.body}
    dbusers.updateUserRegisterWP(userRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para iniciar sesion
router.route('/login').post((request, response)=>{
    let userRegister = {...request.body}
    dbusers.iniciarSesion(userRegister, response).then(result => {
        response.json(result[0]);
    })
})

module.exports = router;