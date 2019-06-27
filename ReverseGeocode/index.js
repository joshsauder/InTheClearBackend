'use strict'
const request = require('request');
const Promise = require('bluebird');

/**
 * @param event - API Gateway Lambda Proxy Input
 * @returns - City names of each long, lat pair
 */
exports.handler = function (event, context, callback) {
    const url = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&location="
    const coordinatesList = event.list

    /**
     * 
     * @param coordinates - the coordinate pair
     * @returns - a promise object
     */
    var reverseGelocateCall = async function(coordinates){
        let fullUrl =  url + coordinates.lat + ',' + coordinates.long       
        return new Promise(function(resolve, reject){
            request.get(fullUrl, function(err, response, body){
                if (err){
                    //on error reject and log the error to CloudWatch
                    console.log(err)
                    reject(err);
                } else {
                    //Resolve the promise and parse the JSON body
                    resolve (JSON.parse(body))
                }
            })
        })
    }

    /**
     * map each coordinate pair and time to the reverseGeolocateCall function
     * @returns - an array of calls to getWeather
     */
    var actions = coordinatesList.map(item => reverseGelocateCall(item));

    /**
     * Process every promise and when finished, callback the created array containing each city name in the order they were sent in
     */
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