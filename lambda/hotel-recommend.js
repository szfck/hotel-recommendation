const AWS = require('aws-sdk');
const {hotels} = require('example');
AWS.config.region = 'us-east-1';
const dynamo = new AWS.DynamoDB();

// Data Mining Function

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function changeFormat(hotel) {
    var format = {};
    format.name = hotel.name.S;
    format.lat = parseFloat(hotel.lat.S);
    format.lng = parseFloat(hotel.lon.S);
    format.desc = `This is ${hotel.name.S}`;
    format.tags = JSON.parse(hotel.tag.S).tag;
    return format;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Handler

exports.handler = (event, context, callback) => {
    
    var username = event.username;
    
    console.log(username);
    
    dynamo.scan({
        TableName: 'Hotel',
        Select: 'ALL_ATTRIBUTES'
        }, function(err, data) {
            if(err !== null) { 
                callback(err);
            }
            else {
                getCandidateHotel(event, data, callback);
            }
        });
};

function getCandidateHotel(event, data, callback) {
    var candidateHotel = [];
    data.Items.forEach(function (hotel) {
        if(getRandomInt(0, 100) <= 50)
            candidateHotel.push(changeFormat(hotel));
    });

     dynamo.query({
        TableName: 'Hotel-User',
        Select: 'ALL_ATTRIBUTES',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {':username': {S: event.username}}
    }, function (err, data) {
        if(err !==null) {
            callback(err);
        } else {
            var test = true;
            if(data.Items.length == 0 && !test) {
                callback(null, candidateHotel);
            } else {
                selectAmazingHotel(event, candidateHotel, callback);
            }
        }
    });                
    
}

function selectAmazingHotel(event, candidateHotel, callback) {
    var amazingHotel = [];
    // latitude
    var lat = parseFloat(event.lat);
    // longitude
    var lng = parseFloat(event.lng);
    candidateHotel.forEach(function(hotel) {
        if(distance(hotel.lat, hotel.lng, lat, lng) > 0.05) {
            console.log(distance(hotel.lat, hotel.lng, lat, lng));
            console.log(hotel.lat, hotel.lng, lat, lng);
            return;
        } else {
            if(amazingHotel.length <= 10)
                amazingHotel.push(hotel);
        }
    });
    console.log(amazingHotel);
    callback(null, amazingHotel);
}
