var jwt = require('jsonwebtoken');
var express = require('express');
var config = require('../configs/config');

const authDistances = express.Router(); 

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
  
    return null;
}

authDistances.use(async (req, res, next) => {
    const token = getTokenFromHeader(req);
    var secret = await config.getSecretDistances()
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {      
        if (err) {
          res.status(403)
          return res.json({ error: {
            message: "Unauthorized / Invalid Token"
        }
     });    
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

module.exports = authDistances;