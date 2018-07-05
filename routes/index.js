var express = require('express');
var router = express.Router();

const db = require('../db');
const TABLE = require('../common');

router.get('/', function (req, res, next) {
  var query = "SELECT * FROM " + TABLE.Product + " ORDER BY Id";
  db.query(query, null, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render('index', { result });
  });
});

module.exports = router;
