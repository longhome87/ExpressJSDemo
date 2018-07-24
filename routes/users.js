const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const passport = require('passport');
const UserService = require('../services/user');

router.use(csrfProtection);

/* GET users listing. */
router.get('/', function (req, res, next) {
    var users = [];
    for (let index = 0; index < 10; index++) {
        users.push({
            id: index,
            name: 'User ' + index
        });
    }
    var data = {
        users: users,
        title: 'User Page'
    };
    res.render('users/index', { data });
});

router.get('/signup', function (req, res, next) {
    res.render('users/signup', { csrfToken: req.csrfToken() });
});

router.post('/signup', function (req, res, next) {
    let email = req.body.txtEmail;
    let password = req.body.txtPassword;

    UserService
        .findByEmail(email)
        .then(result => {
            if (result.rowCount > 0) {
                res.render('users/signup', {
                    hasErrors: true, messages: 'Email is already in use.'
                });
            } else {
                UserService
                    .create(email, password)
                    .then(result => {
                        console.log(result);
                        res.render('users/profile');
                    })
                    .catch(err => {
                        next(err);
                    });
            }
        })
        .catch(err => {
            next(err);
        });
});

// router.post('/signup', passport.authenticate('local.signup', {
//     successRedirect: '/users/profile',
//     failureRedirect: '/users/signup',
//     failureFlash: true
// }));

router.get('/signin', function (req, res, next) {
    res.render('users/signin');
});

router.get('/profile', function (req, res, next) {
    res.render('users/profile');
});

module.exports = router;
