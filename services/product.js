const db = require('../db');
const Common = require('../common');
const ProductName = Common.TABLE.Product;
const Util = require('util');

class ProductService {
    find(sort, direction) {
        let sortField = sort || 'Id';
        let directionField = direction || 'ASC';
        let command = Util.format("SELECT * FROM %s ORDER BY %s %s",
            ProductName, sortField, directionField);
        return db.execute(command);
    }

    findById(id) {
        let command = Util.format("SELECT * FROM %s WHERE Id = %s", ProductName, id);
        return db.execute(command);
    }

    create(name, cost, qty, price, imageName) {
        let command = Util.format("INSERT INTO %s(name, cost, quantity, price, image) VALUES('%s', %d, %d, %d, '%s')",
            ProductName, name, cost, qty, price, imageName);
        return db.execute(command);
    }

    updateOne(id, name, cost, qty, price) {
        let command = Util.format("UPDATE %s SET name = '%s', cost = %d, quantity = %d, price = %d WHERE Id = %s",
            ProductName, name, cost, qty, price, id);
        return db.execute(command);
    }

    deleteOne(id) {
        var command = Util.format("DELETE FROM %s WHERE Id = %s", ProductName, id);
        return db.execute(command);
    }
}

module.exports = new ProductService();