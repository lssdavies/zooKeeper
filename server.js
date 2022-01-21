// added all the required const for node modules express, fs and path
const { query } = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const { animals } = require('./data/animals');
//this links the server js to the api and html routes
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


// middleware instructing server make all files in public dir readily available
app.use(express.static('public'));

// parse incoming string or array data before passing to post functions
// app.use() method adds a function to the server that request pass through before getting to the endpoint
app.use(express.urlencoded({ extended: true }));// takes incoming coming post data and converts it to key/value pairs that can be access by req.body
// parse incoming JSON data to req.body 
app.use(express.json());
/*below tells the server which routes to use depending on the client requested endpoint /api will tell the app to router to use apiRoutes and / tells the router to use htmlRoutes*/
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
// the above middleware functions need to be set up a server to accept POST data


  

  
app.listen(PORT, () =>  {
    console.log(`API server now on port ${PORT}!`)
});