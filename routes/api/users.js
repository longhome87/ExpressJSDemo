const express = require('express');
const router = express.Router();
// const csrf = require('csurf');
// const csrfProtection = csrf();
const passport = require('passport');
const authenticate = require('../../security/authenticate');
const COMMON = require('../../common');
const UserService = require('../../services/user');

// router.use(csrfProtection);

// router.get('/token', function (req, res, next) {
//     res.send({
//         csrfToken: req.csrfToken()
//     });
// });

router.get('/logout', authenticate.isLoggedInAPI, function (req, res, next) {
    req.session.currentUser = null;
    req.session.isAdmin = null;
    req.logout();
    res.send(true);
});

router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    UserService
        .findById(id)
        .then(result => {
            if (result.rows.length == 0) {
                return res.status(404).send({
                    messages: 'No user found'
                });
            }

            res.send(result.rows[0]);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.post('/signin', function (req, res, next) {
    passport.authenticate('local.signin', function (err, user, info) {
        if (err) {
            return res.status(500).send({
                messages: err
            });
        }

        if (!user) {
            let messages = req.flash('error');
            return res.send({
                messages: messages,
                hasErrors: messages.length > 0
            });
        }

        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).send({
                    messages: err
                });
            }

            return res.send(user);
        });
    })(req, res, next);
});

router.post('/signup', function (req, res, next) {
    passport.authenticate('local.signup', function (err, user, info) {
        if (err) {
            return res.status(500).send({
                messages: err
            });
        }

        if (!user) {
            let messages = req.flash('error');
            return res.send({
                messages: messages,
                hasErrors: messages.length > 0
            });
        }

        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).send({
                    messages: err
                });
            }

            return res.send(user);
        });
    })(req, res, next);
});

module.exports = router;