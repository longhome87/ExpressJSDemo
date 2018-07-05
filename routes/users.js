var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  var users = [];
  for (let index = 0; index < 10; index++) {
    users.push({
      id: index,
      name: 'User ' + index
    });
  }
  var data = {
    users: users,
    title: 'User Page'
  };
  res.render('users/index', { data });
});

module.exports = router;
