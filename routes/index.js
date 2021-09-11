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

module.exports = router;