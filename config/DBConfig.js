const Sequelize = require('sequelize'); //brings in Sequelize

const db = require('./db'); //calling database that contains name, username and password

const sequelize = new Sequelize(db.database, db.username, db.password, //instantiating database parameters
    {
        host: db.host, dialect:'mysql',operatorsAliases: false,
        define: {
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    });

module.exports = sequelize;