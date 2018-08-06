const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const passport = require('passport');
const authenticate = require('../security/authenticate');
const COMMON = require('../common');

router.use(csrfProtection);

router.get('/profile', authenticate.isLoggedIn, function (req, res, next) {
    res.render('users/profile');
});

router.get('/logout', authenticate.isLoggedIn, function (req, res, next) {
    req.session.currentUser = null;
    req.session.isAdmin = null;
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
    failureRedirect: '/users/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/users/profile');
    }
});

router.get('/signin', function (req, res, next) {
    let messages = req.flash('error');
    // res.json({ messages: messages });
    res.render('users/signin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signin', function (req, res, next) {

    // passport.authenticate('local.signin', { session: false }, function (err, user, info) {
    //     console.log(err);
    //     console.log(user);
    //     console.log(info);
    // });

    passport.authenticate('local.signin', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            // return res.redirect('/login');
            return res.json({ status: false });
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            // return res.redirect('/users/' + user.username);
            return res.json({ status: true });
        });
    })(req, res, next);

    // req.session.currentUser = req.body.txtEmail;
    // req.session.isAdmin = req.body.txtEmail == COMMON.CONFIG.Admin_Email;
    // if (req.session.oldUrl) {
    //     let oldUrl = req.session.oldUrl;
    //     req.session.oldUrl = null;
    //     res.redirect(oldUrl);
    // } else {
    //     res.redirect('/users/profile');
    // }
});

module.exports = router;