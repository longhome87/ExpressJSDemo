var express = require('express');
var router = express.Router();
var createError = require('http-errors');

/* GET users listing. */
router.get('/', function (req, res, next) {
    var error = createError(400);
    res.render('error', { error });
});

module.exports = router;
