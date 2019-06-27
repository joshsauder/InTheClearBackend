'use strict'
const request = require('request');
const Promise = require('bluebird');

/**
 * @param event - API Gateway Lambda Proxy Input
 * @returns - Weather data for each coordinate pair
 */
exports.handler = function (event, context, callback) {
    const key = process.env.API_KEY
    const url = `https://api.darksky.net/forecast/${key}`
    const coordianteList = event.List

    /**
    * @param lat - the latittude
    * @param long - the longitude
    * @param time - the unix time in seconds
    * @returns - a promise object 
    */
    function getWeather(lat, long, time){
        //long lat must be flipped since WGS84 format not used
        let fullURL = `${url}/${long},${lat},${time}`
        return new Promise(function(resolve, reject){
            request.get(fullURL, function(err, response, body){
                if(err){
                     //on error reject and log the error to CloudWatch
                    console.log(err)
                    reject(err)
                }else{
                    //Resolve the promise and parse the JSON body
                    resolve(JSON.parse(body))
                }
            })
        })
    }

    /**
     * 
     * @param intensity - precipitation intensity
     * @param type - type of precipation
     * @returns - true if precipitation is deemed intense, otherwise false
     */
    function determineSevere(intensity, type){
        if (intensity > 0.015 && type == "snow" || type == "sleet"){
            return true
        }else if(intensity > 0.4 && type == "rain"){
            return true
        }else{
            return false
        }
    }

    /**
     * map each coordinate pair and time to the getWeather function
     * @returns - an array of calls to getWeather
     */
    var actions = coordianteList.map(item => {
        const lat = item.lat
        const long = item.long
        const time = item.time
        return getWeather(lat, long, time)
    })

    /*
    Process every promise and when finished, callback the created JSON object containing the weather data for each coordinate
    */
    Promise.all(actions).then(
        function(values){
            const weatherJSON = []
            values.forEach(function(value){
                const list = {}
                const intensity = value["currently"]["precipIntensity"]
                const type = value["currently"]["icon"]

                list["Condition"] = type
                list["Description"] = value["currently"]["summary"]
                list["Temperature"] = value["currently"]["temperature"]
                list["Severe"] = determineSevere(intensity, type)
                
                const coordinates = {}
                //flipped since different coordinates format used for Dark Sky
                coordinates["lat"] = value["longitude"]
                coordinates["long"] = value["latitude"]
                list["Coordinates"] = coordinates
                weatherJSON.push(list)
            })
            return weatherJSON
        }).then((weatherJSON) => {
            callback(null, weatherJSON)
        }).catch(error => {
            callback(error.message)
        })
}