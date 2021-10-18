var router = require('express').Router();

router.get('/', (req, res)=>{
  res.send('welcome to GTC Portal Services API');
});

router.use('/cat-categories', require('./cat-categories')); 
router.use('/commercial-release', require('./commercial-release'));
router.use('/cat-countries', require('./cat-countries'));

/*PORTAL GTC*/

//Rutas del menú
router.use('/routes', require('./routes'));

router.use('/app-config-client', require('./app-config-client'));

//Rutas de los catálogos
router.use('/cat-catalogs', require('./cat-catalogs.js'));

//Rutas de los roles
router.use('/security-roles', require('./security-roles.js'));

//Rutas de los usuarios
router.use('/security-users', require('./security-users.js'));

//Rutas de los customers
router.use('/customers', require('./customers.js'));

//Rutas de los general parameters
router.use('/general-parameters', require('./cat-general-parameters.js'));

//Rutas para las aplicaciones
router.use('/cat-applications', require('./cat-applications.js'));

//Rutas para las aplicaciones por cliente
router.use('/customer-applications', require('./customer-applications.js'));

//Rutas para las aplicaciones por cliente - usuarios
router.use('/customer-applications-users', require('./customer-applications-users.js'));

//Rutas para las aplicaciones settings
router.use('/applications-settings', require('./applications-settings.js'));

//Rutas para las cfdi pdf request
router.use('/cfdi-pdf-requests', require('./cfdi-pdf-requests.js'));

//Rutas para el articulo 69
router.use('/article-69', require('./article-69.js'));

//Rutas para el encriptado
router.use('/encrypt', require('./encriptado.js'));

module.exports = router;