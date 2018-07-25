const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/user');

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    UserService
        .findById(id)
        .then(result => {
            cb(null, result.rows[0]);
        })
        .catch(err => {
            return cb(err)
        });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'txtEmail',
    passwordField: 'txtPassword',
    passReqToCallback: true
}, function (req, email, password, cb) {
    req.checkBody('txtEmail', 'Invalid email format.').notEmpty().isEmail();
    req.checkBody('txtPassword', 'Must be at least 3 chars long.').isLength({ min: 3 });
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        })

        return cb(null, false, req.flash('error', messages));
    }

    UserService
        .findByEmail(email)
        .then(result => {
            if (result.rowCount > 0) {
                return cb(null, false, req.flash('error', ['Email is already in use.']));
            }

            UserService
                .create(email, password)
                .then(result => {
                    return cb(null, result.rows[0]);
                })
                .catch(err => {
                    return cb(err);
                });
        })
        .catch(err => {
            return cb(err);
        });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'txtEmail',
    passwordField: 'txtPassword',
    passReqToCallback: true
}, function (req, email, password, cb) {
    req.checkBody('txtEmail', 'Invalid email format.').notEmpty().isEmail();
    req.checkBody('txtPassword', 'Must be at least 3 chars long.').isLength({ min: 3 });
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        })

        return cb(null, false, req.flash('error', messages));
    }

    UserService
        .findByEmail(email)
        .then(result => {
            if (result.rowCount == 0) {
                return cb(null, false, req.flash('error', ['No user found.']));
            }

            if (!UserService.validPassword(password, result.rows[0].password)) {
                return cb(null, false, req.flash('error', ['Wrong password.']));
            }

            return cb(null, result.rows[0]);
        })
        .catch(err => {
            return cb(err);
        });
}));
