'use strict';

var expect = require('chai').expect;
var LambdaTest = require('lambda-tester');

var lambdaFunction = require("../index");
var testJson = require('./WeatherPerCity.json')
require('dotenv').config({ path: '../process.env'})


describe('Weather Per City', function(){

    /*
    Test a normal directions set. For this test 3 coordiantes will be inputted
    Expect an JSON with 3 cities weather conditions to be returned
    */
    it( 'send normal directions set', function() {
        //timeout needed since limit of 2000ms may not be enough for response
        this.timeout(3000)
        return LambdaTest(lambdaFunction.handler).event({
            List: testJson["test"][0]["List"]
        }).expectResult( (result) =>{

            //ensure correct number of list items are returned
            expect(result).to.have.lengthOf(3)
            for (var i = 0, len = result.length; i < len; i++){

                //need to ensure the coordinates returned by Dark Sky are the same as requested
                const coordinates = {}
                coordinates["lat"] = testJson["test"][0]["List"][i]["lat"]
                coordinates["long"] = testJson["test"][0]["List"][i]["long"]
                expect(result[i]["Coordinates"]).to.eql(coordinates)

                //ensure each propery is not undefined
                expect(result[i]["Condition"]).to.not.be.undefined
                expect(result[i]["Description"]).to.not.be.undefined
                expect(result[i]["Temperature"]).to.not.be.undefined
            };
        });
    });

    /*
    Since a empty directions set will not be sent, one set of coordiantes will be the base case.
    Expect an JSON with 1 cities weather conditions to be returned
    */
    it( 'send one direction set', function(){
        return LambdaTest(lambdaFunction.handler).event({
            List: testJson["test"][1]["List"]
        }).expectResult( (result) =>{

            const coordinates = {}
            coordinates["lat"] = testJson["test"][1]["List"][0]["lat"]
            coordinates["long"] = testJson["test"][1]["List"][0]["long"]
            expect(result[0]["Coordinates"]).to.eql(coordinates)

            expect(result).to.have.lengthOf(1)
            expect(result[0]["Condition"]).to.not.be.undefined
            expect(result[0]["Description"]).to.not.be.undefined
            expect(result[0]["Temperature"]).to.not.be.undefined
        })
    });

    /*
    In the case of a cross country trip, more coordinate sets will be sent.
    Expect an JSON with 15 cities weather conditions to be returned
    */
    it( 'send large directions set ~15', function(){
        //needed since 2000 ms isnt long enough to complete 15 requests
        this.timeout(10000)
        return LambdaTest(lambdaFunction.handler).event({
            List: testJson["test"][2]["List"]
        }).expectResult( (result) =>{

            expect(result).to.have.lengthOf(15)  
            for (var i = 0, len = result.length; i < len; i++){

                const coordinates = {}
                coordinates["lat"] = testJson["test"][2]["List"][i]["lat"]
                coordinates["long"] = testJson["test"][2]["List"][i]["long"]
                expect(result[i]["Coordinates"]).to.eql(coordinates)

                expect(result[i]["Condition"]).to.not.be.undefined
                expect(result[i]["Description"]).to.not.be.undefined
                expect(result[i]["Temperature"]).to.not.be.undefined
            }
        });
    })
})

