'use strict'
const request = require('request');
const Promise = require('bluebird');
require('dotenv').config();

/**
 * @param event - API Gateway Lambda Proxy Input
 * @param context - 
 * @returns - City names of each long, lat pair
 */
exports.handler = function (event, context, callback) {
    const key = process.env.API_KEY
    const url = `https://api.darksky.net/forecast/${key}`
    const coordianteList = event.List

    function getWeather(lat, long, time){
        //long lat must be flipped since WGS84 format not used
        responseJSON = `url/${long},${lat},${time}`

        return new Promise(function(resolve, reject){
            request.get(url, function(err, response, body){
                if(err){
                    console.log(err)
                    reject(err)
                }else{
                    resolve(JSON.parse(body))
                }
            })
        })
    }

    function determineSevere(intensity, type){
        if (intensity > 0.015 && type == "snow" || type == "sleet"){
            return true
        }else if(intensity > 0.4 && type == "rain"){
            return true
        }else{
            return false
        }
    }

    var actions = coordianteList.map(item => {
        const lat = item.lat
        const long = item.long
        const time = item.time
        getWeather(lat, long, time)
    })

    Promise.all(actions).then(
        function(values){
            weatherJSON = []
            values.forEach(function(value){
                const list = {}
                const instensity = value["currently"]["precipIntensity"]
                const type = value["currently"]["icon"]

                list["Condition"] = type
                list["Description"] = value["currently"]["summary"]
                list["Temperature"] = value["currently"]["temperature"]
                list["Severe"] = determineSevere(intensity, type)
                
                const coordinates = {}
                //flipped since different coordinates format used for Dark Sky
                coordinates["lat"] = value["long"]
                coordinates["long"] = value["lat"]
                list["Coordinates"] = coordinates
            })
            return weatherJSON
        }).then((weatherJSON) => {
            callback(weatherJSON)
        }).catch(error => {
            callback(error)
        })
}