/*Since routes have been removed from  server.js we can no longer use app since each instance of require('express') is different, we need to use router() to have the routes listen to the same server port*/
const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');  
  
  // Get routes 
  router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

  router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
      if (result) {
        res.json(result);
      }
      else  {
      res.send(404);
    }
  });

  // Post routes
  router.post('/animals', (req, res) =>  {
    // set id based on what the next index of the array will be. We need to set an id for the new data which aligns with the existing ids
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    //res.status() and .send() are used to send an error message to the client 
    res.status(400).send('The animal is not properly formatted.');
  }
  else {
    //add animal to json file and animals array
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
  });


//router needs to be exported
module.exports = router;