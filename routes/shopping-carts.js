const express = require('express');
const router = express.Router();
const CartModel = require('../models/cart');
const ProductService = require('../services/product');

router.get('/', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shopping-carts', { products: null });
    }

    let cart = new CartModel(req.session.cart);
    res.render('shopping-carts', {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice
    });
});

router.get('/add-to-cart/:id', function (req, res, next) {
    let productId = req.params.id;
    let cart = new CartModel(req.session.cart ? req.session.cart : {});

    ProductService
        .findById(productId)
        .then((result) => {
            cart.add(result.rows[0], productId);
            req.session.cart = cart;
            res.send({ totalQty: cart.totalQty });
            // res.redirect('/');
        })
        .catch((err) => {
            return next(err);
        });
});

router.get('/reduce/:id', function (req, res, next) {
    let productId = req.params.id;
    let cart = new CartModel(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-carts');
});

router.get('/remove/:id', function (req, res, next) {
    let productId = req.params.id;
    let cart = new CartModel(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-carts');
});

module.exports = router;
