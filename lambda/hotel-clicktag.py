'use strict';
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const dynamo = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    var username = event.username;
    var tag = event.tag;
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
    var tags = [event.tag];
    console.log(tags);
    var price = Number.parseFloat(event.price || 0);
    var distance = Number.parseFloat(event.distance || 0);
    console.log(typeof(price));
    console.log(typeof(distance));
    dynamo.putItem({
        TableName: 'Hotel-User',
        Item: {
            username: {S: event.username},
            tag: {SS: tags},
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
    var newtags = data.Items[0].tag.SS;
    newtags.push(event.tag);
    var price = 0.5 * data.Items[0].price.N + 0.5 * Number.parseFloat(event.price || 0);
    var distance = 0.5 * data.Items[0].distance.N + 0.5 * Number.parseFloat(event.distance || 0);

    var params = {
        TableName: 'Hotel-User',
        Key:{
            "username": event.username
        },
        UpdateExpression: "set tag = :tags, distance = :d, price = :p",
        ExpressionAttributeValues:{
            ":tags": newtags,
            ":d": distance+"",
            ":p": price+""
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
