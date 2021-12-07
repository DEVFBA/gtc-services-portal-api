var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
var jwt = require('jsonwebtoken');
var config2 = require('../configs/config');
var generalParameters = require('./cat-general-parameters')

var fs = require('fs');

var sha256 = require('js-sha256').sha256;

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

    var localPath=""
    var filename = ""

    //Si la imagen no viene vacia la guardamos en carpeta
    console.log(userRegister.pathImage)
    if(userRegister.pvProfilePicPath !== "")
    {
        /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
        const uploadPath = `${userRegister.pathImage}`;
        //path of folder where you want to save the image.
        localPath = `${userRegister.pathImage}`;
        //Find extension of file
        const ext = userRegister.pvProfilePicPath.substring(userRegister.pvProfilePicPath.indexOf("/")+1, userRegister.pvProfilePicPath.indexOf(";base64"));
        const fileType = userRegister.pvProfilePicPath.substring("data:".length,userRegister.pvProfilePicPath.indexOf("/"));
        //Forming regex to extract base64 data of file.
        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = userRegister.pvProfilePicPath.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);
        //Random photo name with timeStamp so it will not overide previous images.
        var date = new Date();
        var day = date.getDate()
        var month = date.getMonth() + 1
        var year = date.getFullYear()
        var hour = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var name = userRegister.pvIdUser + day  + month + year + hour + minutes + seconds
        filename =  `${name}.${ext}`;
        
        //Check that if directory is present or not.
        if(!fs.existsSync(`${uploadPath}`)) {
            fs.mkdirSync(`${uploadPath}`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        //return {filename, localPath

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
                .input('pvProfilePicPath', sql.VarChar, filename)
                .input('pbStatus', sql.Bit, userRegister.pbStatus)
                .input('pvUser', sql.VarChar, userRegister.pvUser)
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spSecurity_Users_CRUD_Records')
            console.log(JSON.stringify(insertUserRegister.recordsets[0][0])); 
            return insertUserRegister.recordsets
        }catch(error){
            console.log(error)
        }
    }
    else{
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
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spSecurity_Users_CRUD_Records')
            console.log(JSON.stringify(insertUserRegister.recordsets[0][0])); 
            return insertUserRegister.recordsets
        }catch(error){
            console.log(error)
        }
    }
    
}

//Actualizar un registro de los usuarios
async function updateUserRegister(userRegister){

    var localPath=""
    var filename = ""

    //Si la imagen no viene vacia la guardamos en carpeta
    if(userRegister.pvChangeImage !== false)
    {
        /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
        const uploadPath = `${userRegister.pathImage}`;
        //path of folder where you want to save the image.
        localPath = `${userRegister.pathImage}`;
        //Find extension of file
        const ext = userRegister.pvProfilePicPath.substring(userRegister.pvProfilePicPath.indexOf("/")+1, userRegister.pvProfilePicPath.indexOf(";base64"));
        const fileType = userRegister.pvProfilePicPath.substring("data:".length,userRegister.pvProfilePicPath.indexOf("/"));
        //Forming regex to extract base64 data of file.
        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = userRegister.pvProfilePicPath.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);
        //Random photo name with timeStamp so it will not overide previous images.
        var date = new Date();
        var day = date.getDate()
        var month = date.getMonth() + 1
        var year = date.getFullYear()
        var hour = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var name = userRegister.pvIdUser + day  + month + year + hour + minutes + seconds
        filename =  `${name}.${ext}`;
        
        //Check that if directory is present or not.
        if(!fs.existsSync(`${uploadPath}`)) {
            fs.mkdirSync(`${uploadPath}`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        //return {filename, localPath

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
                .input('pvProfilePicPath', sql.VarChar, filename)
                .input('pbStatus', sql.Bit, userRegister.pbStatus)
                .input('pvUser', sql.VarChar, userRegister.pvUser)
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spSecurity_Users_CRUD_Records')
            console.log(JSON.stringify(updateUserRegister.recordsets[0][0])); 
            return updateUserRegister.recordsets
        }catch(error){
            console.log(error)
        }
    }
    else{
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
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spSecurity_Users_CRUD_Records')
            console.log(JSON.stringify(updateUserRegister.recordsets[0][0])); 
            return updateUserRegister.recordsets
        }catch(error){
            console.log(error)
        }
    }
    
}

//Actualizar un registro de los usuarios sin cambiar el password
async function updateUserRegisterWP(userRegister){

    //Si la imagen no viene vacia la guardamos en carpeta
    if(userRegister.pvChangeImage !== false)
    {
        /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
        const uploadPath = `${userRegister.pathImage}`;
        //path of folder where you want to save the image.
        localPath = `${userRegister.pathImage}`;
        //Find extension of file
        const ext = userRegister.pvProfilePicPath.substring(userRegister.pvProfilePicPath.indexOf("/")+1, userRegister.pvProfilePicPath.indexOf(";base64"));
        const fileType = userRegister.pvProfilePicPath.substring("data:".length,userRegister.pvProfilePicPath.indexOf("/"));
        //Forming regex to extract base64 data of file.
        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = userRegister.pvProfilePicPath.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);
        //Random photo name with timeStamp so it will not overide previous images.
        var date = new Date();
        var day = date.getDate()
        var month = date.getMonth() + 1
        var year = date.getFullYear()
        var hour = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var name = userRegister.pvIdUser + day  + month + year + hour + minutes + seconds
        filename =  `${name}.${ext}`;
        //Check that if directory is present or not.
        if(!fs.existsSync(`${uploadPath}`)) {
            fs.mkdirSync(`${uploadPath}`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        //return {filename, localPath

        try{
            let pool = await sql.connect(config);
            let updateUserRegister = await pool.request()
                .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
                .input('piIdCustomer', sql.Int, userRegister.piIdCustomer)
                .input('pvIdUser', sql.VarChar, userRegister.pvIdUser)
                .input('pvIdRole', sql.VarChar, userRegister.pvIdRole)
                .input('pvName', sql.VarChar, userRegister.pvName)
                .input('pvProfilePicPath', sql.VarChar, filename)
                .input('pbStatus', sql.Bit, userRegister.pbStatus)
                .input('pvFinalEffectiveDate', sql.VarChar, userRegister.pvFinalEffectiveDate)
                .input('pvUser', sql.VarChar, userRegister.pvUser)
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spSecurity_Users_CRUD_Records')
            console.log(JSON.stringify(updateUserRegister.recordsets[0][0])); 
            return updateUserRegister.recordsets
        }catch(error){
            console.log(error)
        }
    }
    else{
        try{
            let pool = await sql.connect(config);
            let updateUserRegister = await pool.request()
                .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
                .input('piIdCustomer', sql.Int, userRegister.piIdCustomer)
                .input('pvIdUser', sql.VarChar, userRegister.pvIdUser)
                .input('pvIdRole', sql.VarChar, userRegister.pvIdRole)
                .input('pvName', sql.VarChar, userRegister.pvName)
                .input('pbStatus', sql.Bit, userRegister.pbStatus)
                .input('pvFinalEffectiveDate', sql.VarChar, userRegister.pvFinalEffectiveDate)
                .input('pvUser', sql.VarChar, userRegister.pvUser)
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spSecurity_Users_CRUD_Records')
            console.log(JSON.stringify(updateUserRegister.recordsets[0][0])); 
            return updateUserRegister.recordsets
        }catch(error){
            console.log(error)
        }
    }
}

//Actualizar un registro de los usuarios (solo la contraseña)
async function updateUserRegisterPass(userRegister){
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
            .input('pvIP', sql.VarChar, userRegister.pvIP)
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

        var expiration = await config2.getExpiration()
        var secret = await config2.getSecret()

        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + parseInt(expiration, 10)); // 1 día antes de expirar

        const token = jwt.sign({
            id: req.pvIdUser,
            username: req.pvPassword,
            exp: parseInt(exp.getTime() / 1000),
        }, secret);
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