const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const dynamo = new AWS.DynamoDB();


exports.handler = (event, context, callback) => {
    
    var username = event.username;
    
    // // latitude
    var lat = event.lat;
    
    // // longitude
    var lng = event.lng;
    
    var ids = [];
    
    dynamo.scan({
        TableName: 'Hotel',
        Select: 'ALL_ATTRIBUTES',
        Limit: 10
        }, function(err, data) {
            if(err !== null) { 
                console.log(err, err.stack); // an error occurred
            }
            else {
                data.Items.forEach(function (item) {
                    ids.push(item.id.S);
                });
                console.log(ids);           // successful response
            }
        });
        
    
    
    const hotels = [
    {
        name: 'Hotel 50 Bowery NYC',
        lat: 40.71599,
        lng: -73.99683,
        desc: `${username}, ${lat}, ${lng}`,
        tags: [`bed`]
    }
    ,
    {
        name: 'Kleinfeld Hotel Blocks',
        lat: 40.7411663979292,
        lng: -73.9946056902409,
        desc: 'this is Kleinfeld Hotel Blocks',
        tags: ['Double or Twin Room']
    }
    ,
    {
        name: 'Casablanca Hotel',
        lat: 40.75641,
        lng: -73.98547,
        desc: 'this is Casablanca Hotel',
        tags: ['Suite']
    }
    ,
    {
        name: '1 Hotel Brooklyn Bridge',
        lat: 40.70224,
        lng: -73.99554,
        desc: 'this is 1 Hotel Brooklyn Bridge',
        tags: ['Basic Triple Room']
    }
    ,
    {
        name: '1 Hotel Central Park',
        lat: 40.76471,
        lng: -73.97651,
        desc: 'this is 1 Hotel Central Park',
        tags: ['Single Room']
    }
    ,
    {
        name: 'The Williamsburg Hotel',
        lat: 40.72161,
        lng: -73.95884,
        desc: 'this is The Williamsburg Hotel',
        tags: ['Double or Twin Room']
    }
    ,
    {
        name: 'citizenM hotel New York Times Square',
        lat: 40.761561,
        lng: -73.984968,
        desc: 'this is citizenM hotel New York Times Square',
        tags: ['Suite']
    }
    ,
    {
        name: 'Edge Hotel',
        lat: 40.84003,
        lng: -73.93793,
        desc: 'this is Edge Hotel',
        tags: ['Basic Triple Room']
    }
    ,
    {
        name: 'NobleDEN',
        lat: 40.7194,
        lng: -73.9968,
        desc: 'this is NobleDEN',
        tags: ['Single Room']
    }
    ,
    {
        name: 'The Ludlow New York City',
        lat: 40.721839,
        lng: -73.987355,
        desc: 'this is The Ludlow New York City',
        tags: ['Double or Twin Room']
    }
    ,
    {
        name: 'Courtyard by Marriott New York Manhattan/Midtown East',
        lat: 40.7574547612934,
        lng: -73.9699241362457,
        desc: 'this is Courtyard by Marriott New York Manhattan/Midtown East',
        tags: ['Suite']
    }
    ,
    {
        name: 'Courtyard by Marriott New York Manhattan/SoHo',
        lat: 40.7275586084056,
        lng: -74.0057217632294,
        desc: 'this is Courtyard by Marriott New York Manhattan/SoHo',
        tags: ['Basic Triple Room']
    }
    ,
    {
        name: 'The Beekman, A Thompson Hotel',
        lat: 40.7111443,
        lng: -74.0066413,
        desc: 'this is The Beekman, A Thompson Hotel',
        tags: ['Single Room']
    }
    ,
    {
        name: 'Hampton Inn Brooklyn/Downtown',
        lat: 40.695679,
        lng: -73.983963,
        desc: 'this is Hampton Inn Brooklyn/Downtown',
        tags: ['Double or Twin Room']
    }
    ,
    {
        name: 'Boro Hotel',
        lat: 40.7547438,
        lng: -73.9358372,
        desc: 'this is Boro Hotel',
        tags: ['Suite']
    }
    ,
    {
        name: 'Fairfield Inn & Suites by Marriott New York',
        lat: 40.7521723402439,
        lng: -73.9951658490235,
        desc: 'this is Fairfield Inn & Suites by Marriott New York',
        tags: ['Basic Triple Room']
    }
    ,
    {
        name: 'Hyatt Place Flushing Laguardia',
        lat: 40.759295,
        lng: -73.832643,
        desc: 'this is Hyatt Place Flushing Laguardia',
        tags: ['Single Room']
    }
    ,
    {
        name: 'Residence Inn New York the Bronx At Metro Center Atrium',
        lat: 40.849546,
        lng: -73.84263,
        desc: 'this is Residence Inn New York the Bronx At Metro Center Atrium',
        tags: ['Double or Twin Room']
    }
    ,
    {
        name: 'Hotel Le Jolie',
        lat: 40.71653,
        lng: -73.9508,
        desc: 'this is Hotel Le Jolie',
        tags: ['Suite']
    }
    ,
    {
        name: 'Franklin Guesthouse',
        lat: 40.733066,
        lng: -73.957824,
        desc: 'this is Franklin Guesthouse',
        tags: ['Basic Triple Room']
    }
];
    callback(null, hotels);
};
