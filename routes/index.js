var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var json2csv = require('json2csv');
//AWS.config.loadFromPath('./configAWS.json');
AWS.config.update({region:'us-west-2'});
AWS.config.apiVersions = {dynamodb: 'latest'}
const uuidv1 = require('uuid/v1');
const requestIp = require('request-ip');

function compare(a,b){
  if (a.date < b.date)
    return -1;
  if (a.date > b.date)
    return 1;
  return 0;
}

function listVictims(req,res,next,callback){
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: "connections"
  };
  console.log("Scanning connections table.");
  docClient.scan(params, onScan);
  ip_list = [];
  function onScan(err, data) {
      if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Scan succeeded.");

          data.Items.forEach(function(conn_info) {
             ip_list.push({"date":conn_info.date,
                            "login":conn_info.login});
          });

          // continue scanning if we have more movies, because
          // scan can retrieve a maximum of 1MB of data
          if (typeof data.LastEvaluatedKey != "undefined") {
              console.log("Scanning for more...");
              params.ExclusiveStartKey = data.LastEvaluatedKey;
              docClient.scan(params, onScan);
          }else{
              ip_list.sort(compare);
              callback(ip_list);
          }
      }
  };
}

router.get('/downloadVictims/', function(req,res,next){
  listVictims(req,res,next,function(my_list){
    var fields = ['date','login'];
    try{
      result = json2csv({data:my_list, fields: fields});
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=victims.csv');
      res.status(200).send(result);
    }catch(err){
      console.error(err);
    }

  });
});

router.get('/listVictims/', function(req,res,next){
  listVictims(req,res,next,function(list){
    res.render('ip_list', { ips: list });
  });
});

router.get('/get/:id', function(req,res,next){
  var id = req.params.id;
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
      TableName: "clients",
      Key: {"uuid": id}
  };

  docClient.get(params,function(err,data){
      if(err){
          res.render('index', { title: err });
      }else if(data){
        console.log(data);
        var dateFormat = require('dateformat');
        var putParams = {
            TableName:"connections",
            Item:{
                "id": uuidv1(),
                "login": data.Item.login,
                "date": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            }
        };
        docClient.put(putParams, function(err, data) {
          if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
            console.log("Added item:):", JSON.stringify(data, null, 2));
          }
        });
        res.render('index', { title: "Ok!"});
      }else{
        res.render('index', { title: "No results" });
      }
  });


});


module.exports = router;
