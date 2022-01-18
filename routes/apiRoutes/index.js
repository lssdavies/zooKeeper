//this mioddleware lets the app know about the routes in animalRoutes.js
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);
router.use(require('./zookeeperRoutes'));

module.exports = router;