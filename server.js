// added all the required const for node modules express, fs and path

const { query } = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const { animals } = require('./data/animals');

function filterByQuery(query, animalsArray) {
    
    // we establish an array top store multiple personality traits
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } 
      else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

  //post functions will update server information as well animal.json file as well
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    /* using fs.writeFileSync to write to file and path.join to point to the file. null and 2, are means of keeping our data formatted. null argument means we don't want to edit any of our existing data; and 2 indicates we want to create white space between our values*/ 
    fs.writeFileSync(
      path.join(__dirname, './data/animals.json'),
      JSON.stringify({ animals: animalsArray }, null, 2)
    );

    //return finished code to post route for response
    return animal;
  }

//validate data from req.body by data type and check that each key exists.
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}
 

  // Get routes 
  app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

  app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
      if (result) {
        res.json(result);
      }
      else  {
      res.send(404);
    }
  });

  // middleware instructing server make all files in public dir readily available
  app.use(express.static('public'));

  // parse incoming string or array data before passing to post functions
  // app.use() method adds a function to the server that request pass through before getting to the endpoint
  app.use(express.urlencoded({ extended: true }));// takes incoming coming post data and converts it to key/value pairs that can be access by req.body
  // parse incoming JSON data to req.body 
  app.use(express.json());
  // the above middleware functions need to be set up a server to accept POST data

  // Post routes
  app.post('/api/animals', (req, res) =>  {
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

// index.html route
app.get('/', (req, res) =>  {
  res.sendFile(path.join(__dirname, './public/index.html'));
})

  

  
app.listen(3001, () =>  {
    console.log(`API server now on port ${PORT}!`)
});