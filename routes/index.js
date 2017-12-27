var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
//AWS.config.loadFromPath('./configAWS.json');
AWS.config.update({region:'us-west-2'});
AWS.config.apiVersions = {dynamodb: 'latest'}
const uuidv1 = require('uuid/v1');
const requestIp = require('request-ip');

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
