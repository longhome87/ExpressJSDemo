const express = require('express');
const router = express.Router();
const ProductService = require('../../services/product');

router.get('/', function (req, res, next) {
    ProductService
        .find(req.query.sort, req.query.order)
        .then(result => {
            res.send(result.rows);
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;