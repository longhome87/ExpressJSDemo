const db = require('../db');
const Common = require('../common');
const ProductName = Common.TABLE.Product;
const Util = require('util');

class ProductService {
    find(sort, direction) {
        let sortField = sort || 'Id';
        let directionField = direction || 'ASC';
        let query = Util.format("SELECT * FROM %s ORDER BY %s %s", ProductName, sortField, directionField);
        return db.query2(query);
    }

    findById(id) {
        let query = Util.format("SELECT * FROM %s WHERE Id = %s", ProductName, id);
        return db.query2(query);
    }

    create(name, cost, qty, price, imageName) {
        let query = Util.format("INSERT INTO %s(name, cost, quantity, price, image) VALUES('%s', %d, %d, %d, '%s')", ProductName, name, cost, qty, price, imageName);
        return db.query2(query);
    }

    updateOne(id, name, cost, qty, price) {
        let query = Util.format("UPDATE %s SET name = '%s', cost = %d, quantity = %d, price = %d WHERE Id = %s", ProductName, name, cost, qty, price, id);
        return db.query2(query);
    }

    deleteOne(id) {
        var query = Util.format("DELETE FROM %s WHERE Id = %s", ProductName, id);
        return db.query2(query);
    }
}

module.exports = new ProductService();