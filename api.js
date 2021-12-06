var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

// Objeto global de la app
var app = express();

// Para el logger
const logger = require('./utils/logger');

// configuración de middlewares
app.use(bodyParser.urlencoded({ 
    limit: '100mb',
    extended: true
}));

app.use(bodyParser.json({
    limit: '100mb', 
    extended: true
}));

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://129.159.99.152']
}));

// Agregamos el código de nuestro router (routes/index.js)
app.use('/api', require('./routes'));

// Manejando los errores 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    logger.error(`404 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    next(err);
});

// Manejando los errores 500
app.use(function (err,req,res,next) {
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})

process.on('unhandledRejection', (reason, p) => {
    logger.error("Unhandled Rejection at: " +  p + " reason: " + reason);
    console.log('Unhandled Rejection at: ', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

var port = process.env.PORT || 9000;
app.listen(port);
logger.info("Categoría API iniciando en el puerto: " + port)
console.log("Categoría API iniciando en el puerto: " + port);