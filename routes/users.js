const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();

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
    res.redirect('/');
});

module.exports = router;
