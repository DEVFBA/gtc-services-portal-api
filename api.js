var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var timeout = require('connect-timeout')

// Objeto global de la app
var app = express();
app.use(timeout('10800'))
// configuración de middlewares
app.use(bodyParser.urlencoded({ 
    limit: '100mb',
    extended: true
 }));

app.use(haltOnTimedout)

app.use(bodyParser.json({
    limit: '100mb', 
    extended: true
}));

app.use(haltOnTimedout)

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://129.159.99.152']
}));

app.use(haltOnTimedout)

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
}

// Agregamos el código de nuestro router (routes/index.js)
//app.use('/v1', require('./routes'));

//Creacion de ruta principal
/*app.use('/api', router)

router.get('/', (req, res)=>{
    res.send('welcome to GTC Portal Services API');
});*/



// Agregamos el código de nuestro router (routes/index.js)
app.use('/api', require('./routes'));

// Manejando los errores 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var port = process.env.PORT || 9000;
app.listen(port);
console.log("Categoría API iniciando en el puerto: " + port);