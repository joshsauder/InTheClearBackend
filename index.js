'use strict'
const request = require('request');

/**
 * @param event - API Gateway Lambda Proxy Input
 * @param context - 
 * @returns - City names of each long, lat pair
 */
exports.handler = function (event, context, callback) {
    const url = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&location="
    const coordinatesList = event.list

    var reverseGelocateCall = function(coordinates){

        var options = {
            url: url + coordinates.lat + ',' + coordinates.long,       
        };

        console.log(options.url)
        return new Promise(function(resolve, reject){
            request.get(options, function(err, response, body){
                if (err){
                    console.log(err)
                    reject(err);
                } else {
                    resolve (JSON.parse(body))
                }
            })
        })
    }

    var actions = coordinatesList.map(reverseGelocateCall);
    Promise.all(actions).then(
        function(values){
            const cityList = []
            values.forEach(function(value){
                var city = value['address']['City']
                var state = value['address']['Region']
                cityList.push(`${city}, ${state}`)
            })
            return cityList
        }
    ).then((cityList) =>
        callback(null, cityList)
    ).catch(error => {
        callback(error.message)
    })

    
}