const config = require("../dbconfig");
const sql = require('mssql');
const axios = require('axios');
const jwt = require('jsonwebtoken');

var {
    getSecretTimbrado,
    getExpirationTimbrado
} = require('../configs/config');

async function login(req, res) {

    //console.log('Entró');

    const body = {
        user: req.body.user,
        password: req.body.password,
        idCustomer: req.body.idCustomer,
        idApplication: req.body.idApplication
    }

    //console.log('REQ: ', req.body)

    //console.log('Body: ', body);

    let encRes = await axios.post('http://129.159.99.152/GTC_DEV/api/Hash/EncryptMD5', {text: body.password});

    let encryptedPassword = encRes.data;

    //console.log('Encrypted Password', encryptedPassword);

    try {

        const pool = await sql.connect(config);

        const userLogin = await pool.request()
          .input('pvOptionCRUD', sql.VarChar, "VA")
          .input('piIdCustomer', sql.Int, body.idCustomer)
          .input('pIdApplication', sql.SmallInt, body.idApplication)
          .input('pvIdUser', sql.VarChar, body.user)
          .input('pvPassword', sql.VarChar, encryptedPassword)
          .execute('spCustomer_Application_Users_CRUD_Records')

          //console.log('En Login: ', userLogin.recordset[0]);

          if(userLogin.recordset[0].Code_Type === 'Error')
          {
            const response = {
                data: {
                    error: {
                      code: userLogin.recordsets[0][0].Code,
                      idTransacLog: userLogin.recordsets[0][0].IdTransacLog,
                      mensaje: userLogin.recordsets[0][0].Code_Message_User
                }
              } 
            }
            //const response = [regreso]

            res.status(401).json(response);

          } else {

            let expiration = await getExpirationTimbrado();

            let secret = await getSecretTimbrado();

            const today = new Date();
            const exp = new Date(today);
            exp.setDate(today.getDate() + parseInt(expiration, 10)); // 1 día antes de expirar
            const token = jwt.sign({
              id: req.body.user,
              username: req.body.password,
              exp: parseInt(exp.getTime() / 1000),
            }, secret);

            const response = {
                data: {
                    mensaje: userLogin.recordsets[0][0].Code_Message_User,
                    token: token
                }
              }

            //console.log(expiration);

            res.json(response);

          }

        //console.log(JSON.stringify('Respuesta', userLogin.recordsets[0][0]));
        
    } catch (error) {

        console.log(error);
        
    }
    
}   

module.exports = {
    login
}