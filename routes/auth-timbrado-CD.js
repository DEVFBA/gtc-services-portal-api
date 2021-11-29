const jwt               = require('jsonwebtoken');
const express           = require('express');
const sql               = require('mssql');

const auth              = express.Router(); 

const config = require("../dbconfig");
const {
  getSecretTimbrado
}                       = require('../configs/config');

auth.use(async (req, res, next) => {

  const token = req.headers.authorization.split(' ')[1]; 
  //console.log(req.headers.authorization);
  //console.log(token);

  let secret = await getSecretTimbrado();

  if (token) {

    jwt.verify(token, secret, async (err, decoded) => {    

      if (err) {

        return res.status(401).json( { 
          error: {
            mensaje: 'Token inválida' 
          }
        } );   

      } else {

        const pool = await sql.connect(config);

        //console.log('Decoded: ', decoded);

        const validUser = await pool.request()
          .input('pvOptionCRUD', sql.VarChar, 'R')
          .input('piIdCustomer', sql.Int, decoded.idCustomer)
          .input('pIdApplication', sql.Int, decoded.idApplication)
          .input('pvIdUser', sql.VarChar, decoded.userName)
          //.input('pvIdUser', sql.VarChar, 'decoded.userName')
          .execute('spCustomer_Application_Users_CRUD_Records');
        
        //console.log('Valid User: ', validUser);

        if( validUser.recordset.length === 0 || !validUser.recordset[0].User_Status ){

          return res.status(401).json( { 
            error: {
              mensaje: 'Token inválida' 
            }
          } ); 

        } else {

          next();

        }

        //req.decoded = decoded;
            
        //next();

      }

    });

  } else {

    res.send( { 
      error: {
        mensaje: 'Token Vacía' 
      }
    } );

  }

});

module.exports = auth;