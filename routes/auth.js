var jwt = require('jsonwebtoken');
var express = require('express');
var config = require('../configs/config');
const configDataBase = require("../dbconfig");
const sql = require('mssql');

const auth = express.Router(); 
auth.use(async (req, res, next) => {
    const token = req.headers['access-token']; 
    var secret = await config.getSecret()
    if (token) {
      jwt.verify(token, secret, async (err, decoded) => {      
        if (err) {
          return res.status(401).json( { 
            error: {
              mensaje: 'Token inválida.' 
            }
          } ); 
        } 
        else {
          const pool = await sql.connect(configDataBase);
          const validUser = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, 'R')
            .input('pvIdUser', sql.VarChar, decoded.id)
            .execute('spSecurity_Users_CRUD_Records');
          
          if( validUser.recordset.length === 0 || !validUser.recordset[0].Status ){
            return res.status(401).json( { 
              error: {
                mensaje: 'Token inválida' 
              }
            } ); 
          } else {
            next();
          }
        }
      });
    } else {
      return res.status(401).json( { 
        error: {
          mensaje: 'Token no proveída.' 
        }
      }); 
    }
});

module.exports = auth;