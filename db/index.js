const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: config.connectionString
});

module.exports = {
    execute: (command) => {
        console.log('QUERY: ', command);
        return pool.query(command);
    }
}