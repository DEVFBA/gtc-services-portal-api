var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
const axios = require('axios');
var jwt = require('jsonwebtoken');
var config2 = require('../configs/config');

//Para obtener todos los registros del Articulo externamente
async function login(req){
    const data = {
      text: req.pvPassword
    }
    const res = await axios.post("http://129.159.99.152/GTC_DEV/api/Hash/EncryptMD5", data)
    var pass = res.data
  
    var idCustomer = Number(req.piIdCustomer)
    var idApplication = Number(req.pIdApplication)
    try{
        let pool = await sql.connect(config);
        let userLogin = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "VA")
            .input('piIdCustomer', sql.Int, idCustomer)
            .input('pIdApplication', sql.SmallInt, idApplication)
            .input('pvIdUser', sql.VarChar, req.pvIdUser)
            .input('pvPassword', sql.VarChar, pass)
            .execute('spCustomer_Application_Users_CRUD_Records')
        console.log(JSON.stringify(userLogin.recordsets[0][0]));
        if(userLogin.recordsets[0][0].Code_Type=="Error")
        {
          const regreso = {
            error: {
              code: userLogin.recordsets[0][0].Code,
              idTransacLog: userLogin.recordsets[0][0].IdTransacLog,
              mensaje: userLogin.recordsets[0][0].Code_Message_User
            } 
          }
          const response = [regreso]
          return response
        }
        else{
            //Cambiarlo por valores del secret y expiration
          var expiration = await config2.getExpirationDistances()
          var secret = await config2.getSecretDistances()
  
          const today = new Date();
          const exp = new Date(today);
          exp.setDate(today.getDate() + parseInt(expiration, 10)); // 1 día antes de expirar
          const token = jwt.sign({
            id: req.pvIdUser,
            username: req.pvPassword,
            exp: parseInt(exp.getTime() / 1000),
          }, secret);
  
          const regreso = {
            mensaje: userLogin.recordsets[0][0].Code_Message_User,
            token: token
          }
          const response = [regreso]
          return response
        }
        //console.log(token)
    }catch(error){
        console.log(error)
    }
}

async function getDistance(){
  //const res = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=AIzaSyDYlA2dPrmOWqveoQXfQ766MGfwwEzRpC0')
  const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDYlA2dPrmOWqveoQXfQ766MGfwwEzRpC0')
  //console.log(res.data)
  return res.data
}

module.exports = {
    login: login,
    getDistance: getDistance
}