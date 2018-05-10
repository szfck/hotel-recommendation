'use strict';
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const dynamo = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    var username = event.username;
    var tag = event.tags;
    console.log(event);
    dynamo.query({
        TableName: 'Hotel-User',
        Select: 'ALL_ATTRIBUTES',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {':username': {S: event.username}},
        Limit: 1
    }, function (err, data) {
        if(err !==null) {
            callback(err);
        } else {
            if(data.Items.length == 0 ) {
                insertTag(event, data, callback);
            } else {
                updateTag(event, data, callback);
            }
        }
    }); 
};

function insertTag(event, data, callback) {
    var tags = {tags : event.tags};
    var price = Number.parseFloat(event.price || 0);
    var distance = Number.parseFloat(event.distance || 0);
    dynamo.putItem({
        TableName: 'Hotel-User',
        Item: {
            username: {S: event.username},
            tags: {S: JSON.stringify(tags)},
            distance: {N: distance+""},
            price: {N: price+""}
        }
    }, function(err, data) {
        if (err !== null) {
            callback(err);
        } else {
            callback(null, null);
        }
    });
    
}

function updateTag(event, data, callback) {
    var newtags = JSON.parse(data.Items[0].tags.S).tags;
    var tags = event.tags;
    for(var i = 0; i < tags.length; i++) {
        newtags.push(tags[i]);
        if(newtags.length > 10)
            newtags.shift();
    }
    
    var price = Math.min(0.5 * parseFloat(data.Items[0].price.N) + 0.5 * Number.parseFloat(event.price || 0), 5.0);
    var distance = 0.5 * parseFloat(data.Items[0].distance.N) + 0.5 * Number.parseFloat(event.distance || 0);
    console.log(price);
    console.log(distance);
    console.log(JSON.stringify({tags : newtags}));
    var params = {
        TableName: 'Hotel-User',
        Key:{
            "username": event.username
        },
        UpdateExpression: "set tags = :tags, distance = :d, price = :p",
        ExpressionAttributeValues:{
            ":tags": JSON.stringify({tags : newtags}),
            ":d": distance,
            ":p": price
        },
        ReturnValues:"UPDATED_NEW"
    };
    docClient.update(params, function(err, data) {
        if (err !== null) {
            callback(err);
        } else {
            callback(null, null);
        }
    });
}
