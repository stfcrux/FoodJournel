const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


// creating a Video table in MYSQL data base with the below entries
const Food = db.define('food', {
    entry: {
        type: Sequelize.STRING
    },

    dateOfEntry: {
        type: Sequelize.DATE
    },

    cuisine: {
        type: Sequelize.STRING
    },
    diningPlace: {
        type: Sequelize.STRING
    },

    mealType: {
        type: Sequelize.STRING
    },
    calories: {
        type: Sequelize.STRING
    },
    mood: {
        type: Sequelize.STRING
    }

});

module.exports = Food;
