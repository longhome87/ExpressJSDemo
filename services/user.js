const db = require('../db');
const Common = require('../common');

class ProductService {
    findById(id, callback) {
        var query = "SELECT * FROM " + Common.TABLE.Product + " WHERE Id = " + id;
        db.query(query, callback);
    }
}

module.exports = new ProductService();