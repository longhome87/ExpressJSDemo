const bcrypt = require('bcrypt-nodejs');

class User {
    constructor(email, password) {
        this.email = email || '';
        this.password = this.encryptPassword(password) || '';
    }

    encryptPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
    }

    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = User;