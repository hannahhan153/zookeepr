const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const router = require('express').Router();

const fs = require('fs');
const path = require('path');
const {
    animals
} = require('./data/animals.json');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({
    extended: true
}));
// parse incoming JSON data
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

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
    } else {
        res.send(404);
    }
});


app.post('/api/animals', (req, res) => {
    //requests server to accept data
    // package up data as an object and send to server
    // req.body is where incoming content will be 
    // console.log(req.body);
    // req.body is where we can access data on the server side

    req.body.id = animals.length.toString();
    // set id based on what the next index of array will be

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        // res.json sends data back to the client
        res.json(req.body);
    }



});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});