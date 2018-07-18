const db = require('../db');
const TABLE = require('../common');

class ProductService {
    findById(id, callback) {
        var query = "SELECT * FROM " + TABLE.Product + " WHERE Id = " + id;
        db.query(query, callback);
    }
}

module.exports = new ProductService();