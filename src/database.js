const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('./keys');

// Connection to the DB.
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED!');
        }

        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIOS!');
        }

        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED!');
        }

        if (err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
            console.error('USER AUTHENTICATION FAIL!');
        }
    }

    if (connection) connection.release();
    console.log('DATABASE IS CONNECTED');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;
