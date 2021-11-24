//Crear un registro de los catalogos del Portal
const axios = require('axios');

async function createEncrypt(catRegister){
    var optionAxios = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
        }
      }
    const res = await axios.post("http://129.159.99.152/GTC_DEV/api/Hash/EncryptMD5", catRegister)
    var respuesta = res.data
    return respuesta
}

module.exports = {
    createEncrypt : createEncrypt
}