var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

// Objeto global de la app
var app = express();

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

const _json = bodyParser.json()

app.use((req, res, next) => {
  const id  = `${Date.now() + Math.random()}`
  console.log('Start #%s', id)
  _json(req, res, (err) => {
    console.log('End $%s', id)
    next(err)
  })
})


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