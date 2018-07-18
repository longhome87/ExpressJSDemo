var express = require('express');
var router = express.Router();

const db = require('../db');
const TABLE = require('../common');

router.get('/', function (req, res, next) {
  let sortField = req.query.sort || 'Id';
  let direction = req.query.order || 'ASC';
  var query = "SELECT * FROM " + TABLE.Product + " ORDER BY " + sortField + " " + direction;
  db.query(query, null, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render('index', { result });
  });
});

module.exports = router;
