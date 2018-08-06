const DB = require('../db');
const COMMON = require('../common');
const PRODUCT_TABLE_NAME = COMMON.TABLE.Product;
const UTIL = require('util');
const HELPER = require('../common/helper');

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
        let command = UTIL.format("INSERT INTO %s(name, cost, quantity, price, image) VALUES('%s', %d, %d, %d, '%s') RETURNING id",
            PRODUCT_TABLE_NAME, name, cost, qty, price, imageName);
        return DB.execute(command);
    }

    updateOne(id, name, cost, qty, price) {
        let columnList = [
            { name: 'name', value: name, type: 'string' },
            { name: 'cost', value: cost, type: 'number' },
            { name: 'quantity', value: qty, type: 'number' },
            { name: 'price', value: price, type: 'number' }
        ];

        let cmdSet = HELPER.getSetCommand(columnList);
        if (cmdSet.length > 0) {
            let command = UTIL.format("UPDATE %s SET %s WHERE id = %s", PRODUCT_TABLE_NAME, cmdSet, id);
            return DB.execute(command);
        }
    }

    deleteOne(id) {
        var command = UTIL.format("DELETE FROM %s WHERE Id = %s", PRODUCT_TABLE_NAME, id);
        return DB.execute(command);
    }
}

module.exports = new ProductService();