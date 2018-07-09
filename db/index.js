var config = require('config');
var connectionString = function () {
    switch (process.env.NODE_ENV) {
        case 'development':
            return config.get('dbConfig.development');
        case 'production':
            return config.get('dbConfig.production');
        default:
            return config.get('dbConfig.development');
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