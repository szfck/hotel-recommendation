function getElasticSearchResult(tag, callback) {
    const url =
        `https://search-hotel-neaebgea2cpuizow2b657cpmxm.us-east-1.es.amazonaws.com/index/_search?q=${tag}&pretty`;

    const https = require("https");

    https.get(url, res => {
        res.setEncoding("utf8");

        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            body = JSON.parse(body);
            var items = body.hits.hits;

            var hotels = [];

            for (var i = 0; i < items.length; i++) {

                var item = items[i]._source;

                var hotel = {
                    lat: item.lat,
                    lng: item.lon,
                    rate: item.rate,
                    name: item.name,
                    price: item.price,
                    tags: (JSON.parse(item.tag)).tag
                };

                hotels.push(hotel);
            }

            callback(null, hotels);

        });
    });
}

exports.handler = (event, context, callback) => {
    // TODO implement
    
    var tag = event.tag;
    
    getElasticSearchResult(tag, callback);
    
};