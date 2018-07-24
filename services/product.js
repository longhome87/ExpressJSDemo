const DB = require('../db');
const COMMON = require('../COMMON');
const PRODUCT_TABLE_NAME = COMMON.TABLE.Product;
const UTIL = require('util');

class ProductService {
    find(sort, direction) {
        let sortField = sort || 'Id';
        let directionField = direction || 'ASC';
        let command = UTIL.format("SELECT * FROM %s ORDER BY %s %s",
            PRODUCT_TABLE_NAME, sortField, directionField);
        return DB.execute(command);
    }

    findById(id) {
        let command = UTIL.format("SELECT * FROM %s WHERE Id = %s", PRODUCT_TABLE_NAME, id);
        return DB.execute(command);
    }

    create(name, cost, qty, price, imageName) {
        let command = UTIL.format("INSERT INTO %s(name, cost, quantity, price, image) VALUES('%s', %d, %d, %d, '%s')",
            PRODUCT_TABLE_NAME, name, cost, qty, price, imageName);
        return DB.execute(command);
    }

    updateOne(id, name, cost, qty, price) {
        let command = UTIL.format("UPDATE %s SET name = '%s', cost = %d, quantity = %d, price = %d WHERE Id = %s",
            PRODUCT_TABLE_NAME, name, cost, qty, price, id);
        return DB.execute(command);
    }

    deleteOne(id) {
        var command = UTIL.format("DELETE FROM %s WHERE Id = %s", PRODUCT_TABLE_NAME, id);
        return DB.execute(command);
    }
}

module.exports = new ProductService();