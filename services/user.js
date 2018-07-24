const DB = require('../DB');
const COMMON = require('../COMMON');
const USER_TABLE_NAME = COMMON.TABLE.User;
const UTIL = require('util');
const BCRYPT = require('bcrypt-nodejs');

class UserService {
    findById(id) {
        let command = UTIL.format("SELECT * FROM %s WHERE Id = %s", USER_TABLE_NAME, id);
        return DB.execute(command);
    }

    findByEmail(email) {
        let command = UTIL.format("SELECT * FROM %s WHERE Email = '%s'", USER_TABLE_NAME, email);
        return DB.execute(command);
    }

    create(email, password) {
        let encryptedPassword = this.encryptPassword(password);
        let command = UTIL.format("INSERT INTO %s(email, password) VALUES('%s', '%s')",
            USER_TABLE_NAME, email, encryptedPassword);
        return DB.execute(command);
    }

    encryptPassword(password) {
        return BCRYPT.hashSync(password, BCRYPT.genSaltSync(5));
    }

    validPassword(password, encryptedPassword) {
        return BCRYPT.compareSync(password, encryptedPassword);
    }
}

module.exports = new UserService();