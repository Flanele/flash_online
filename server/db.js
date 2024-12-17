require('dotenv').config(); 
const {Sequelize} = require('sequelize');


module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: '192.168.224.1',
        port: process.env.DB_PORT
    }
);