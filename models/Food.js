const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Food = db.define('food', {
    entry: {
        type: Sequelize.STRING(2000)
    },
    dateEntry: {
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
    },
});

module.exports = Food;