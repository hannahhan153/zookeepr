const fs = require("fs");
const path = require("path");

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
        path.join(__dirname, '../data/animals.json'),
        // dirname represents directory of the file we execute code in
        JSON.stringify({
            animals: animalsArray
        }, null, 2)
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
  };