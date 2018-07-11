var config = require('config');
var connectionString = function () {
    switch (process.env.NODE_ENV) {
        case 'development':
            var development = config.get('dbConfig.connection-string');
            return development;
        case 'production':
            var production = config.get('dbConfig.connection-string');
            return production;
        default:
            return null;
    }
}

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connectionString()
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    }
}