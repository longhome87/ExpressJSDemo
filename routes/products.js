var express = require('express');
var router = express.Router();
const db = require('../db');
const TABLE = require('../common');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage: storage
});

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
  let price = req.body.txtPrice;
  let description = req.body.txtDescription;
  let imageName = Date.now().toString() + name;
  let txtFile = req.files.txtFile;
  txtFile.mv('public/uploads/' + imageName, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  });

  let query = "INSERT INTO " + TABLE.Product + "(name, price, description, image) VALUES('" + name + "'," + price + ",'" + description + "','" + imageName + "')";
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