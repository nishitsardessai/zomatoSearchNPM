var Client = require('node-rest-client').Client;
var jsonToCSV = require('json-to-csv');
var fs = require("fs");
var options = {
    mimetypes: {
        json: ["application/json", "application/my-custom-content-type-for-json;charset=utf-8"]

    }
};
var client = new Client(options);
var args = {

    // parameters: { arg1: "hello", arg2: "world" }, // this is serialized as URL parameters
    headers: {
        "user-key": "d2427bde94041fd5bbc52248e2995580",
        "Content-Type": "application/json"
    } // request headers
};
var tempString = [];
var query = "shivajinagar";
var sortType = ['rating', 'cost', 'real_distance'];
var orderBy = ['desc', 'acs']
var writeStream = fs.createWriteStream(query + ".csv");
writeStream.write("Sr No, Restaurant Name, Address, average_cost_for_two, Ratings\n");
// writeStream.write("NO SORTING\n");
for (var c = 0, start = 0; c < 5; c++ , start += 20) {

    client.get("https://developers.zomato.com/api/v2.1/search?entity_id=5&entity_type=city&q=" + query + "&start=" + start, args, function (data, response) {

        console.log(JSON.stringify(data));
        // var jsonData = JSON.stringify(data.restaurants, null, 2)
        var jsonData = data.restaurants;
        console.log('jsonData' + jsonData.length);
        for (var i = 0; i < jsonData.length; i++) {
            tempString.push(jsonData[i].restaurant.name);
            writeStream.write(JSON.stringify(jsonData[i].restaurant.name) + ',' + JSON.stringify(jsonData[i].restaurant.location.address) + ',' + JSON.stringify(jsonData[i].restaurant.average_cost_for_two) + ',' + JSON.stringify(jsonData[i].restaurant.user_rating.aggregate_rating) + '\n');
        }
        for (var temp = 0; temp < 999; temp = temp + 1)
            console.log('Loading' + temp)
    });
}


for (var sort in sortType) {
    for (var order in orderBy) {
        // var writeStream = fs.createWriteStream(query +sortType[sort]+ orderBy[order]+".csv");
        // writeStream.write("Sr No, Restaurant Name, Address, average_cost_for_two, Ratings\n");
        // writeStream.write("NO SORTING\n");
        for (var c = 0, start = 0; c < 5; c++ , start += 20) {
            // callout here
            // }
            client.get("https://developers.zomato.com/api/v2.1/search?entity_id=5&entity_type=city&q=" + query + "&start=" + start + "&sort=" + sortType[sort] + "&order=" + orderBy[order], args, function (data, response) {

                console.log(JSON.stringify(data));
                // var jsonData = JSON.stringify(data.restaurants, null, 2)
                var jsonData = data.restaurants;
                console.log('jsonData' + jsonData.length);
                for (var i = 0; i < jsonData.length; i++) {
                    if (!tempString.includes(jsonData[i].restaurant.name))
                        writeStream.write( JSON.stringify(jsonData[i].restaurant.name) + ',' + JSON.stringify(jsonData[i].restaurant.location.address) + ',' + JSON.stringify(jsonData[i].restaurant.average_cost_for_two) + ',' + JSON.stringify(jsonData[i].restaurant.user_rating.aggregate_rating) + '\n');
                }
                for (var temp = 0; temp < 999; temp = temp + 1)
                    console.log('Loading' + temp)
            });
        }
        // writeStream.end();
    }

}



