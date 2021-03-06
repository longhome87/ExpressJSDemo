const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const passport = require('passport');
const authenticate = require('../security/authenticate');

router.use(csrfProtection);

router.get('/profile', authenticate.isLoggedIn, function (req, res, next) {
    res.render('users/profile');
});

router.get('/logout', authenticate.isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', authenticate.notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    let messages = req.flash('error');
    res.render('users/signup', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/signup',
    failureFlash: true
}), function (req, res) {

});

router.get('/signin', function (req, res, next) {
    let messages = req.flash('error');
    res.render('users/signin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/signin',
    failureFlash: true
}), function (req, res) {

});

module.exports = router;