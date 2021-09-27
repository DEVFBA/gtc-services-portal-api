var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
var jwt = require('jsonwebtoken');
var config2 = require('../configs/config');

var fs = require('fs');

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

//Para obtener usuarios de acuerdo a un Customer Role Service
async function getUsersCustomer(params){
    try{
        let pool = await sql.connect(config);
        let users = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, params.piIdCustomer)
            .input('pvIdRole', sql.VarChar, "SERVICE")
            .execute('spSecurity_Users_CRUD_Records')
        return users.recordsets
    }catch(error){
        console.log(error)
    }
}

//Crear un usuario
async function insertUserRegister(userRegister){

    const ip = await publicIp.v4();

    var localPath=""
    var filename = ""

    //Si la imagen no viene vacia la guardamos en carpeta
    if(userRegister.pvProfilePicPath !== "")
    {
        /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
        const uploadPath = `${userRegister.pathImage}`;
        //path of folder where you want to save the image.
        localPath = `${userRegister.pathImage}`;
        //Find extension of file
        const ext = userRegister.pvLogo.substring(userRegister.pvLogo.indexOf("/")+1, userRegister.pvLogo.indexOf(";base64"));
        const fileType = userRegister.pvLogo.substring("data:".length,userRegister.pvLogo.indexOf("/"));
        //Forming regex to extract base64 data of file.
        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = userRegister.pvLogo.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);
        //Random photo name with timeStamp so it will not overide previous images.
        filename = `${userRegister.pvIdCountry}${userRegister.pvTaxId}.${ext}`;
        
        //Check that if directory is present or not.
        if(!fs.existsSync(`${uploadPath}`)) {
            fs.mkdirSync(`${uploadPath}`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        //return {filename, localPath
    }
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
            .input('pvProfilePicPath', sql.VarChar, localPath+filename)
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

    var localPath=""
    var filename = ""

    //Si la imagen no viene vacia la guardamos en carpeta
    if(userRegister.pvProfilePicPath !== "")
    {
        /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
        const uploadPath = `${userRegister.pathImage}`;
        //path of folder where you want to save the image.
        localPath = `${userRegister.pathImage}`;
        //Find extension of file
        const ext = userRegister.pvLogo.substring(userRegister.pvLogo.indexOf("/")+1, userRegister.pvLogo.indexOf(";base64"));
        const fileType = userRegister.pvLogo.substring("data:".length,userRegister.pvLogo.indexOf("/"));
        //Forming regex to extract base64 data of file.
        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = userRegister.pvLogo.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);
        //Random photo name with timeStamp so it will not overide previous images.
        filename = `${userRegister.pvIdCountry}${userRegister.pvTaxId}.${ext}`;
        
        //Check that if directory is present or not.
        if(!fs.existsSync(`${uploadPath}`)) {
            fs.mkdirSync(`${uploadPath}`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        //return {filename, localPath
    }
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
            .input('pvProfilePicPath', sql.VarChar, localPath+filename)
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

//Actualizar un registro de los usuarios (solo la contraseña)
async function updateUserRegisterPass(userRegister){
    const ip = await publicIp.v4();
    try{
        let pool = await sql.connect(config);
        let updateUserRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.VarChar, userRegister.piIdCustomer)
            .input('pvIdUser', sql.VarChar, userRegister.pvIdUser)
            .input('pvIdRole', sql.VarChar, userRegister.pvIdRole)
            .input('pvName', sql.VarChar, userRegister.pvName)
            .input('pvPassword', sql.VarChar, sha256(userRegister.pvPassword))
            .input('pbTempPassword', sql.Bit, userRegister.pbTempPassword)
            .input('pvFinalEffectiveDate', sql.VarChar, userRegister.pvFinalEffectiveDate)
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
        exp.setDate(today.getDate() + 1); // 1 día antes de expirar

        const token = jwt.sign({
            id: req.pvIdUser,
            username: req.pvPassword,
            exp: parseInt(exp.getTime() / 1000),
        }, config2.llave);
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
    updateUserRegisterPass: updateUserRegisterPass,
    getUsersCustomer: getUsersCustomer
}