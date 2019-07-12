'use strict'
const request = require('request');
const Promise = require('bluebird');

/**
 * @param event - API Gateway Lambda Proxy Input
 * @returns - City names of each long, lat pair
 */
exports.handler = function (event, context, callback) {
    const id = process.env.APP_ID
    const code = process.env.APP_CODE
    const requestUrl = `https://reverse.geocoder.api.here.com/6.2/multi-reversegeocode.json?mode=retrieveAddresses&gen=9&app_id=${id}&app_code=${code}`
    const coordinatesList = event.List

    /**
     * Create a promise object that is used to batch request each coordinate set
     * 
     * @param coordinates - A formated string containing each coordinate set
     * @returns - a promise object
     */
    var reverseGelocateCall = async function(coordinates){   

        //set url and needed headers for request to HERE Maps API
        var options = {
            'url': requestUrl,
            headers: {
                'Content-Type': '*',
                'Cache-Control': 'no-cache'
            },
            body: coordinates,
            
        }
        return new Promise(function(resolve, reject){
            request.post(options, function(err, response, body){
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
     * Parses through the coordinate pairs and return a String in required format
     * 
     * @param - coordinates the coordinate set
     * @returns - a formated string containing the coordinate pairs
     */
    var requestString = function(coordinates){
        var returnString = ""
        //for each coordinate list add the index with leading zeros. 4 numbers total for id field
        coordinatesList.forEach(function(item, index){
            var i = "0000"
            var addIndex = (index + 1)
            var i = (i + addIndex).slice(-i.length);
            
            //apply index and lat and long to string. Each coordinate set must be on new line
            returnString = returnString + `id=${i}&prox=${item.lat},${item.long}\n`
        })

        return returnString
    }

    const requestBody = requestString(coordinatesList)


    /**
     * Process the promise object and parse through the response JSON.
     * Return an array of each City, State set
     */
    reverseGelocateCall(requestBody).then(
        function(values){
            const cityList = []
            let coordinatesArray = values['Response']['Item']
            coordinatesArray.forEach(function(value){
                //parse down to point where city and state can be obtained
                let parsedJSON = value['Result'][0]['Location']['Address']
                var city = parsedJSON.hasOwnProperty('City') ? parsedJSON['City'] : parsedJSON['County']
                var state = parsedJSON['State']
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