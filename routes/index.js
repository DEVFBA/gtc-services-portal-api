var router = require('express').Router();

// Para el logger
const logger = require('../utils/logger');

router.get('/', (req, res)=>{
  logger.info("welcome to GTC Portal Services API");
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

//Rutas para las aplicaciones settings templates
router.use('/applications-settings-templates', require('./applications-settings-templates.js'));

//Rutas para las cfdi pdf request
router.use('/cfdi-pdf-requests', require('./cfdi-pdf-requests.js'));

//Rutas para el articulo 69
router.use('/article-69', require('./article-69.js'));

//Rutas para el encriptado
router.use('/encrypt', require('./encriptado.js'));

//Rutas para los assumptions
router.use('/assumptions', require('./assumptions.js'));

//Rutas para los distancias
router.use('/distances', require('./distances.js'));

//Rutas para los application settings
router.use('/applications-settings', require('./applications-settings.js'));

/*TIMBRADO CASA DIAZ*/

//Rutas para el Timbrado de Casa Díaz

router.use('/timbrado-ws-CD', require('./timbrado-ws-CD.js'));

/**
 * * Invoice One Stamping Routes 
 */
router.use('/timbrado', require('./timbrado-Invoice-One.js'));

/**
 * * External Applications Route
 */
router.use('/external-applications', require('./external-applications.js'));

 /**
 * * Customer Stamping Routes
 */
router.use('/customers-stamping', require('./customers-stamping.js'));

/**
 * * Request Customer Stamping Routes
 */
router.use('/request-customer-stamping', require('./request-customer-stamping.js'));

/**
 * * Request Customer Service Codes
 */
router.use('/customer-service-codes', require('./customer-service-codes.js'));

/**
 * * Request Customer UoMs
 */
router.use('/customer-uoms', require('./customer-uoms.js'));

/**
 * * Request Customer Bill Tos
 */
 router.use('/customer-bill-tos', require('./customer-bill-tos.js'));

 /**
 * * Request Customer Items
 */
  router.use('/customer-items', require('./customer-items.js'));

   /**
 * * Request Customer Items Taxes
 */
    router.use('/customer-items-taxes', require('./customer-items-taxes.js'));

  /**
 * * Request Invoices (facturación)
 */
   router.use('/invoices', require('./invoices.js'));

     /**
 * * Request Customer Receipt Types Series
 */
      router.use('/customer-receipt-types-series', require('./customer-receipt-types-series.js'));

module.exports = router;