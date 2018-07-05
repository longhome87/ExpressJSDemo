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

    res.render('products/index', { result });
  });
});

router.get('/add', function (req, res, next) {
  res.render('products/add');
});

router.post('/add', function (req, res, next) {
  var name = req.body.txtName;
  var price = req.body.txtPrice;
  var description = req.body.txtDescription;


  var query = "INSERT INTO " + TABLE.Product + "(name, price, description) VALUES('" + name + "'," + price + ",'" + description + "')";
  db.query(query, (err, result) => {
    if (err) {
      return next(err);
    }

    res.redirect('/products');
  })
});

router.get('/edit/:id', function (req, res, next) {
  var query = "SELECT * FROM " + TABLE.Product + " WHERE Id = " + req.params.id;
  db.query(query, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render('products/edit', { product: result.rows[0] });
  })
});

router.post('/edit/:id', function (req, res, next) {
  var id = req.body.txtId;
  var name = req.body.txtName;
  var price = req.body.txtPrice;
  var description = req.body.txtDescription;
  var query = "UPDATE " + TABLE.Product + " SET name = '" + name + "', price = " + price + ", description = '" + description + "' WHERE Id = " + id;
  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      return next(err);
    }

    res.redirect('/products');
  })
});

router.get('/delete/:id', function (req, res, next) {
  var query = "DELETE FROM " + TABLE.Product + " WHERE Id = " + req.params.id;
  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      return next(err);
    }

    res.redirect('/products');
  })
});

module.exports = router;
