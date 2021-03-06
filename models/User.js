const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
//const sequelize = require('../config/DBconfig');


// creating a user(s) table in MYSQL data base
const User = db.define('user', {
    name: {
        type: Sequelize.STRING  //defining the fields that we want to capture in the DB
    },

    email:{
        type: Sequelize.STRING
    },
    age:{
        type: Sequelize.INTEGER
    },

    password: {
        type: Sequelize.STRING
    },

});

module.exports = User;