const express = require('express');
const router = express.Router();
const ProductService = require('../services/product');
const fs = require('fs');

router.get('/', function (req, res, next) {
    ProductService
        .find(req.query.sort, req.query.order)
        .then(result => {
            res.render('products', { result });
        })
        .catch(err => {
            next(err);
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
    if (txtImage) {
        txtImage.mv('public/uploads/' + imageName, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
        });
    }

    ProductService
        .create(name, cost, qty, price, imageName)
        .then(result => {
            res.redirect('/products');
        })
        .catch(err => {
            next(err);
        });
});

router.get('/edit/:id', function (req, res, next) {
    let productId = req.params.id;
    ProductService
        .findById(productId)
        .then(result => {
            res.render('products/edit', {
                product: result.rows[0]
            });
        })
        .catch(err => {
            next(err);
        });
});

router.post('/edit/:id', function (req, res, next) {
    var id = req.body.txtId;
    var name = req.body.txtName;
    var cost = req.body.txtCost;
    var qty = req.body.txtQty;
    var price = req.body.txtPrice;

    ProductService
        .updateOne(id, name, cost, qty, price)
        .then(result => {
            res.redirect('/products');
        })
        .catch(err => {
            next(err);
        });
});

router.get('/delete/:id', function (req, res, next) {
    let productId = req.params.id;
    let imageName = req.query.image || null;
    ProductService
        .deleteOne(productId)
        .then(result => {
            if (imageName) {
                let imagePath = 'public/uploads/' + imageName;
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath);
                }
            }

            res.redirect('/products');
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;