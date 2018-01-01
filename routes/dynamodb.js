var AWS = require("aws-sdk");
var express = require('express');
var router = express.Router();

router.get('/test', function(req, res, next) {
    res.send("this is working")
})

router.get('/create', function(req, res, next) {
    AWS.config.region = 'us-east-1';

    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : "Movies",
        KeySchema: [
            { AttributeName: "year", KeyType: "HASH"},  //Partition key
            { AttributeName: "title", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "year", AttributeType: "N" },
            { AttributeName: "title", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            res.send(JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            res.send(JSON.stringify(data, null, 2));
        }
    });
});

router.get('/insert', function(req, res, next) {
    AWS.config.region = 'us-east-1';
    console.log("Comes here");
    var docClient = new AWS.DynamoDB.DocumentClient();

    var table = "Movies";

    var year = 2015;
    var title = "The Big New Movie";

    var params = {
        TableName:table,
        Item:{
            "year": year,
            "title": title,
            "info":{
                "plot": "Nothing happens at all.",
                "rating": 0
            }
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            var error = JSON.stringify(err, null, 2);
            console.error("Unable to add item. Error JSON:", error);
            res.send(error);
        } else {
            var success = JSON.stringify(data, null, 2);
            console.log("Added item:", success);
            res.send(success);
        }
    });
});

router.get('/read', function(req, res, next) {
    console.log("reading item");
    AWS.config.region = 'us-east-1';
    var docClient = new AWS.DynamoDB.DocumentClient()

    var table = "Movies";

    var year = 2015;
    var title = "The Big New Movie";

    var params = {
        TableName: table,
        Key:{
            "year": year,
            "title": title
        }
    };

    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.send(JSON.stringify(error, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            res.send(JSON.stringify(data, null, 2))
        }
    });
});

module.exports = router;