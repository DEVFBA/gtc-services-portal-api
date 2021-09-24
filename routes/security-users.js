const router = require('express').Router();
const dbusers = require('../controllers/security-users')
const auth = require('./auth');

//Ruta para obtener todos los usuarios
router.route('/').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
    };
    dbusers.getUsers(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener usuarios por Customer Role Service
router.route('/get-users-customer-role-service').get(auth, (request, response)=>{
    const params = {
        pvOptionCRUD: request.query.pvOptionCRUD,
        piIdCustomer: request.query.piIdCustomer,
    };
    dbusers.getUsersCustomer(params).then(result => {
        response.json(result[0]);
    })
})

//Ruta para obtener un usuario por ID
router.route('/:id').get(auth, (request, response)=>{
    dbusers.getUserId(request.params.id).then(result => {
        response.json(result[0]);
    })
})

//Ruta para crear usuario
router.route('/create-user').post(auth, (request, response)=>{
    let userRegister = {...request.body}
    dbusers.insertUserRegister(userRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un usuario
router.route('/update-user').put(auth, (request, response)=>{
    let userRegister = {...request.body}
    dbusers.updateUserRegister(userRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un usuario sin cambiar el password
router.route('/update-user-wp').put(auth, (request, response)=>{
    let userRegister = {...request.body}
    dbusers.updateUserRegisterWP(userRegister).then(result => {
        response.json(result[0]);
    })
})

//Ruta para actualizar un usuario solo contraseña
router.route('/update-user-pass').put(auth, (request, response)=>{
    let userRegister = {...request.body}
    dbusers.updateUserRegisterPass(userRegister).then(result => {
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