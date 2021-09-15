var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
var jwt = require('jsonwebtoken');

var sha256 = require('js-sha256').sha256;
const publicIp = require('public-ip');

async function getUsers(params){
    try{
        let pool = await sql.connect(config);
        let users = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spSecurity_Users_CRUD_Records')
        return users.recordsets
    }catch(error){
        console.log(error)
    }
}

//Funcion para obtener un usuario mediante su id
async function getUserId(params){
    try{
        let pool = await sql.connect(config);
        let user = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('pvIdUser', sql.VarChar, params)
            .execute('spSecurity_Users_CRUD_Records')
        return user.recordsets
    }catch(error){
        console.log(error)
    }
}

//Crear un usuario
async function insertUserRegister(userRegister){
    console.log(userRegister.pvFinalEffectiveDate)
    const ip = await publicIp.v4();
    try{
        let pool = await sql.connect(config);
        let insertUserRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, userRegister.piIdCustomer)
            .input('pvIdUser', sql.VarChar, userRegister.pvIdUser)
            .input('pvIdRole', sql.VarChar, userRegister.pvIdRole)
            .input('pvPassword', sql.VarChar, sha256(userRegister.pvPassword))
            .input('pvName', sql.VarChar, userRegister.pvName)
            .input('pbTempPassword', sql.Bit, userRegister.pbTempPassword)
            .input('pvFinalEffectiveDate', sql.VarChar, userRegister.pvFinalEffectiveDate)
            .input('pbStatus', sql.Bit, userRegister.pbStatus)
            .input('pvUser', sql.VarChar, userRegister.pvUser)
            .input('pvIP', sql.VarChar, ip)
            .execute('spSecurity_Users_CRUD_Records')
        console.log(JSON.stringify(insertUserRegister.recordsets[0][0])); 
        return insertUserRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los usuarios
async function updateUserRegister(userRegister){
    const ip = await publicIp.v4();
    try{
        let pool = await sql.connect(config);
        let updateUserRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, userRegister.piIdCustomer)
            .input('pvIdUser', sql.VarChar, userRegister.pvIdUser)
            .input('pvIdRole', sql.VarChar, userRegister.pvIdRole)
            .input('pvPassword', sql.VarChar, sha256(userRegister.pvPassword))
            .input('pvName', sql.VarChar, userRegister.pvName)
            .input('pbTempPassword', sql.Bit, userRegister.pbTempPassword)
            .input('pvFinalEffectiveDate', sql.VarChar, userRegister.pvFinalEffectiveDate)
            .input('pbStatus', sql.Bit, userRegister.pbStatus)
            .input('pvUser', sql.VarChar, userRegister.pvUser)
            .input('pvIP', sql.VarChar, ip)
            .execute('spSecurity_Users_CRUD_Records')
        console.log(JSON.stringify(updateUserRegister.recordsets[0][0])); 
        return updateUserRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los usuarios sin cambiar el password
async function updateUserRegisterWP(userRegister){
    const ip = await publicIp.v4();
    try{
        let pool = await sql.connect(config);
        let updateUserRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, userRegister.piIdCustomer)
            .input('pvIdUser', sql.VarChar, userRegister.pvIdUser)
            .input('pvIdRole', sql.VarChar, userRegister.pvIdRole)
            .input('pvName', sql.VarChar, userRegister.pvName)
            .input('pbStatus', sql.Bit, userRegister.pbStatus)
            .input('pvUser', sql.VarChar, userRegister.pvUser)
            .input('pvIP', sql.VarChar, ip)
            .execute('spSecurity_Users_CRUD_Records')
        console.log(JSON.stringify(updateUserRegister.recordsets[0][0])); 
        return updateUserRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Iniciar sesión
async function iniciarSesion(req) {
    
    var pass = sha256(req.pvPassword)
    try{
        let pool = await sql.connect(config);
        let userLogin = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "VA")
            .input('pvIdUser', sql.VarChar, req.pvIdUser)
            .input('pvPassword', sql.VarChar, pass)
            .execute('spSecurity_Users_CRUD_Records')
        console.log(JSON.stringify(userLogin.recordsets[0][0]));

        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 24); // 24 días antes de expirar

        const token = jwt.sign({
            id: req.pvIdUser,
            username: req.pvPassword,
            exp: parseInt(exp.getTime() / 1000),
        }, "secret");
        //console.log(token)
        userLogin.recordsets[0][1] = {token: token}
        return userLogin.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getUsers : getUsers,
    insertUserRegister: insertUserRegister,
    updateUserRegister: updateUserRegister,
    updateUserRegisterWP: updateUserRegisterWP,
    iniciarSesion: iniciarSesion,
    getUserId: getUserId,
}