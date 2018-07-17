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

    res.render('products/index', {
      result
    });
  });
});

router.get('/add', function (req, res, next) {
  res.render('products/add');
});

router.post('/add', function (req, res, next) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  let name = req.body.txtName;
  let cost = req.body.txtCost;
  let qty = req.body.txtQty;
  let price = req.body.txtPrice;
  let imageName = Date.now().toString();
  let txtImage = req.files.txtImage;
  txtImage.mv('public/uploads/' + imageName, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  });

  let query = "INSERT INTO " + TABLE.Product + "(name, cost, quantity, price, image) VALUES('" + name + "'," + cost + "," + qty + "," + price + ",'" + imageName + "')";
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

    res.render('products/edit', {
      product: result.rows[0]
    });
  })
});

router.post('/edit/:id', function (req, res, next) {
  var id = req.body.txtId;
  var name = req.body.txtName;
  var cost = req.body.txtCost;
  var qty = req.body.txtQty;
  var price = req.body.txtPrice;
  var query = "UPDATE " + TABLE.Product + " SET name = '" + name + "', cost = " + cost + ", quantity = " + qty + ", price = " + price + " WHERE Id = " + id;
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