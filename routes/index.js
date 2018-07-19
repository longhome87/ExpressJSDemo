const express = require('express');
const router = express.Router();
const db = require('../db');
const TABLE = require('../common');
var CartModel = require('../models/cart');
const ProductService = require('../services/product');

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

router.get('/add-to-cart/:id', function (req, res, next) {
  let productId = req.params.id;
  let cart = new CartModel(req.session.cart ? req.session.cart : {});

  ProductService.findById(productId, (err, result) => {
    if (err) {
      return next(err);
    }

    cart.add(result.rows[0], productId);
    req.session.cart = cart;
    res.redirect('/');
  });
});

router.get('/reduce/:id', function (req, res, next) {
  let productId = req.params.id;
  let cart = new CartModel(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
  let productId = req.params.id;
  let cart = new CartModel(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shopping-cart', { products: null });
  }

  let cart = new CartModel(req.session.cart);
  res.render('shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

module.exports = router;
