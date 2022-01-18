const path = require('path');
const router = require('express').Router();

// index.html route
router.get('/', (req, res) =>  {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  })
  
  //animals.html route
  router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
  })
  
  // zookeepers.html route
  router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });
  
  //wildcard route *
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });


  //router needs to be exported for routes to work
  module.exports = router;
  
  