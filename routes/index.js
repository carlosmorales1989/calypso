var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*require('dns').reverse(req.header('x-forwarded-for'), function(err, domains) {
    if(err) {
        console.log(err.toString());
        return;
    }
    console.log(domains);
});*/
  console.log("jajajaja");

  res.render('index', { title: req.connection.remoteAddress });
});

module.exports = router;
