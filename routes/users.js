const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const UserService = require('../services/user');
const { check, validationResult } = require('express-validator/check');

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

router.post('/signup', [
    check('txtEmail').isEmail().withMessage('Invalid email format'),
    check('txtPassword').isLength({ min: 4 }).withMessage('Must be at least 4 chars long'),
], function (req, res, next) {
    let data = {
        hasErrors: false,
        messages: [],
        csrfToken: req.csrfToken()
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(function (error) {
            data.messages.push(error.msg);
        });
        data.hasErrors = data.messages.length > 0;
        return res.render('users/signup', data);
    }

    let email = req.body.txtEmail;
    let password = req.body.txtPassword;
    UserService
        .findByEmail(email)
        .then(result => {
            if (result.rowCount > 0) {
                data.messages = ['Email is already in use.'];
                data.hasErrors = data.messages.length > 0;
                res.render('users/signup', data);
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

router.get('/signin', function (req, res, next) {
    res.render('users/signin', { csrfToken: req.csrfToken() });
});

router.post('/signin', [
    check('txtEmail').isEmail().withMessage('Invalid email format'),
    check('txtPassword').isLength({ min: 4 }).withMessage('Must be at least 4 chars long'),
], function (req, res, next) {
    let data = {
        hasErrors: false,
        messages: [],
        csrfToken: req.csrfToken()
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(function (error) {
            data.messages.push(error.msg);
        });
        data.hasErrors = data.messages.length > 0;
        return res.render('users/signin', data);
    }

    let email = req.body.txtEmail;
    let password = req.body.txtPassword;
    UserService
        .findByEmail(email)
        .then(result => {
            if (result.rowCount == 0) {
                data.messages = ['No user found.'];
                data.hasErrors = data.messages.length > 0;
                return res.render('users/signin', data);
            }

            console.log(password);
            if (!UserService.validPassword(password, result.rows[0].password)) {
                data.messages = ['Wrong password.'];
                data.hasErrors = data.messages.length > 0;
                return res.render('users/signin', data);
            }

            res.render('users/profile');
        })
        .catch(err => {
            next(err);
        });
});

router.get('/profile', function (req, res, next) {
    res.render('users/profile');
});

module.exports = router;
