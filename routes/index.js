var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./configAWS.json');
AWS.config.apiVersions = {dynamodb: 'latest'}

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
  console.log(req);
  res.render('index', { title: req.connection.remoteAddress });

  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "connections";

  var params = {
      TableName:table,
      Item:{
          "id": "test",
          "ip": req.connection.remoteAddress,
      }
  };

  console.log("Adding a new item...");
  docClient.put(params, function(err, data) {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
});

module.exports = router;
