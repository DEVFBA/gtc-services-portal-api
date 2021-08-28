var router = require('express').Router();

router.get('/', (req, res)=>{
  res.send('welcome to GTC Portal Services API');
});

router.use('/cat-categories', require('./cat-categories')); 
router.use('/commercial-release', require('./commercial-release'));
router.use('/cat-countries', require('./cat-countries'));

//PORTAL GTC
router.use('/routes', require('./routes'));

module.exports = router;