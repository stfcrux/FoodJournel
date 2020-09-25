const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const food = require('../models/Food');

const setUpDB = (drop) => {
    mySQLDB.authenticate()
    .then(() => {
        console.log('FoodJournal database connected');
    })
    .then(() => {
        user.hasMany(food);
        mySQLDB.sync({
            force: drop
        }).then(() => {
            console.log('Create tables if none exists')
        }).catch(err => console.log(err))
    })
    .catch(err => console.log('Error: ' + err));
};

module.exports = {setUpDB};