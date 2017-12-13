var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
//AWS.config.loadFromPath('./configAWS.json');
AWS.config.update({region:'us-west-2'});
AWS.config.apiVersions = {dynamodb: 'latest'}
const uuidv1 = require('uuid/v1');
const requestIp = require('request-ip');

router.get('/ips', function(req,res,next){
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
      TableName: "connections",
      ProjectionExpression: "ip",
  };

  console.log("Scanning connections table.");
  docClient.scan(params, onScan);

  function onScan(err, data) {
      if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          // print all the movies
          console.log("Scan succeeded.");
          console.log(data.Items.map(x => x.ip));
          res.render('ip_list',{ips: data.Items.map(x => x.ip)});
      }
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  /*require('dns').reverse(req.header('x-forwarded-for'), function(err, domains) {
    if(err) {
        console.log(err.toString());
        return;
    }
    console.log(domains);
});*/
  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "connections";


  console.log(req);
  require('dns').reverse(req.connection.remoteAddress, function(err, domains) {
    res.render('index', { title: requestIp.getClientIp(req) });
      console.log(domains);
      var params = {
          TableName:table,
          Item:{
              "id": uuidv1(),
              "ip": requestIp.getClientIp(req),
              "name": domains
          }
      };
      docClient.put(params, function(err, data) {
        if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("Added item:):", JSON.stringify(data, null, 2));
        }
      });
  });

});

module.exports = router;
