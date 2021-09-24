var jwt = require('jsonwebtoken');
var express = require('express');
var config = require('../configs/config');

const auth = express.Router(); 
auth.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, config.llave, (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }
});

module.exports = auth;