var config = require('config');
var connectionString = config.get('dbConfig.connectionString');

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connectionString
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    }
}