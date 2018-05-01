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
    format.price = parseFloat(hotel.price.N);
    return format;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function jacardDistance(userlist, hotellist) {
    var inNumber = 0.0;
    userlist.forEach(function(tag){
        if(hotellist.indexOf(tag) != -1)
            inNumber += 1;
    });
    return inNumber / (hotellist.length + inNumber);
}

// Handler

exports.handler = (event, context, callback) => {
    
    var username = event.username;
    
    console.log(username);
    
    dynamo.scan({
        TableName: 'Hotel',
        Select: 'ALL_ATTRIBUTES',
        Limit: 1000
        }, function(err, data) {
            if(err !== null) { 
                callback(err);
            }
            else {
                console.log(data.Items.length);
                getCandidateHotel(event, data, callback);
            }
        });
};

function getCandidateHotel(event, data, callback) {
    var candidateHotel = [];
    data.Items.forEach(function (hotel) {
        
        candidateHotel.push(changeFormat(hotel));
    });

     dynamo.query({
        TableName: 'Hotel-User',
        Select: 'ALL_ATTRIBUTES',
        Limit: 1,
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {':username': {S: event.username}}
    }, function (err, data) {
        if(err !==null) {
            callback(err);
        } else {
            if(data.Items.length == 0) {
                selectColdStartHotel(event, candidateHotel, callback);
            } else {
                selectAmazingHotel(event, data, candidateHotel, callback);
            }
        }
    });                
    
}

function selectColdStartHotel(event, candidateHotel, callback) {
    var coldStartHotel = [];
    var lat = parseFloat(event.lat);
    var lng = parseFloat(event.lng);
    var flag = 2;
    candidateHotel.forEach(function(hotel) {
        if(distance(hotel.lat, hotel.lng, lat, lng) > 0.05) {
            return;
        }
        if(hotel.price >= 4){
            if(flag == 0)   
                return;
            else
                flag -= 1;
        }
        if(getRandomInt(0, 100) <= 50) {
            return;
        }
        if(coldStartHotel.length <= 15)
            coldStartHotel.push(hotel);
        
    });
    callback(null, coldStartHotel);
}

function selectAmazingHotel(event, data, candidateHotel, callback) {
    var userTagsList = JSON.parse(data.Items[0].tags.S).tags;
    var distAge = parseFloat(data.Items[0].distance.N);
    var priceAge = parseFloat(data.Items[0].price.N);
    var amazingHotel = [];
    var noiseHotel = [];
    var result = [];
    var lat = parseFloat(event.lat);
    var lng = parseFloat(event.lng);
    candidateHotel.forEach(function(hotel) {
        var jacard = jacardDistance(userTagsList, hotel.tags);
        //console.log(hotel.tags, jacard);
        var maxDist = distAge * (1.0 + jacard);
        var maxPrice = priceAge * (1.0 + jacard);
        hotel.score = jacard;
        if(jacard < 0.1) {
            if(getRandomInt(0, 100) < 15)
                noiseHotel.push(hotel);
            return; 
        }
        if(maxDist > 0.0 && distance(hotel.lat, hotel.lng, lat, lng) > maxDist) {
            if(getRandomInt(0, 100) < 15)
                noiseHotel.push(hotel);
            return;
        }
        if(maxPrice > 0.0 && hotel.price > priceAge) {
            if(getRandomInt(0, 100) < 15)
                noiseHotel.push(hotel);
            return;
        }
        if(amazingHotel.length <= 100) {
            amazingHotel.push(hotel);
        }
    });
    amazingHotel.sort(function(a, b) {
        return b.score - a.score;
    });
    for(var i = 0; i < Math.min(amazingHotel.length, 10); i++) {
        console.log(amazingHotel[i].score);
        result.push(amazingHotel[i]);
    }
    noiseHotel.forEach(function(hotel) {
        if(result.length <= 15) {
            result.push(hotel);
        }
    })
    console.log(result);
    callback(null, result);
}
