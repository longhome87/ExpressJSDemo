const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: config.connectionString
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },

    query2: (text) => {
        console.log('QUERY: ', text);
        return pool.query(text);
    }
}