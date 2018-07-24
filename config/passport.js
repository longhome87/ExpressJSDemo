const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/user');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserService
        .findById(id)
        .then(result => {
            done(null, result[0]);
        })
        .catch(err => {
            done(err);
        });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    UserService
        .findByEmail(email)
        .then(result => {
            console.log('######', '1');
            if (result.length > 0) {
                return done(null, false, { message: 'Email is already in use.' });
            }

            UserService
                .create(email, password)
                .then(result => {
                    console.log('######', '2');
                    return done(null, { email: email, password: password });
                })
                .catch(err => {
                    return done(err);
                });
        })
        .catch(err => {
            return done(err);
        });
}));