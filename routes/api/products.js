const express = require('express');
const router = express.Router();
const ProductService = require('../../services/product');
const HELPER = require('../../common/helper');
const fs = require('fs');

router.get('/', function (req, res, next) {
    ProductService
        .find(req.query.sort, req.query.order)
        .then(result => {
            result.rows.forEach(row => {
                row.image = HELPER.getFullImagePath(req, row.image);
            });
            res.send(result.rows);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/:id', function (req, res, next) {
    let productId = req.params.id;
    ProductService
        .findById(productId)
        .then(result => {
            let row = result.rows[0];
            row.image = HELPER.getFullImagePath(req, row.image);
            res.send(row);
        })
        .catch(err => {
            next(err);
        });
});

router.post('/', function (req, res, next) {
    if (!req.files) {
        return res.status(400).json({ 'message': 'No files were uploaded.' });
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
            ProductService
                .findById(result.rows[0].id)
                .then(data => {
                    let row = data.rows[0];
                    row.image = HELPER.getFullImagePath(req, row.image);
                    res.send(row)
                })
                .catch(e => {
                    next(e)
                });
        })
        .catch(err => {
            next(err);
        });
});

router.put('/:id', function (req, res, next) {
    let id = req.params.id;
    var name = req.body.txtName;
    var cost = req.body.txtCost;
    var qty = req.body.txtQty;
    var price = req.body.txtPrice;

    ProductService
        .updateOne(id, name, cost, qty, price)
        .then(result => {
            ProductService
                .findById(id)
                .then(data => {
                    let row = data.rows[0];
                    row.image = HELPER.getFullImagePath(req, row.image);
                    res.send(row)
                })
                .catch(e => {
                    next(e)
                });
        })
        .catch(err => {
            next(err);
        });
});

router.delete('/:id', function (req, res, next) {
    let productId = req.params.id;
    ProductService
        .findById(productId)
        .then(data => {
            ProductService
                .deleteOne(productId)
                .then(result => {
                    let imageName = data.rows[0].image || null;
                    if (imageName) {
                        let imagePath = 'public/uploads/' + imageName;
                        if (fs.existsSync(imagePath)) {
                            fs.unlink(imagePath);
                        }
                    }

                    res.send(true);
                })
                .catch(err => {
                    next(err);
                });
        })
        .catch(e => {
            next(e)
        });
});

module.exports = router;