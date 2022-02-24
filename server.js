const fs = require('fs');
const path = require('path');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const {
    animals
} = require('./data/animals.json');

// first describes the route the client will have to fetch from; second is callback function that will execute every time the route is accessed with a GET request
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // save animalsArray as filteredResults
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personality traits as a dedicated array
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animals.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        // dirname represents directory of the file we execute code in
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // console.log(body);
    // function main code will go here

    // return finish code to post route for response
    return animal;
}

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

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json()); 


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

