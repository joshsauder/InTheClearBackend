'use strict';

var expect = require('chai').expect;
var LambdaTest = require('lambda-tester');

var lambdaFunction = require("../index");
var testJson = require('./WeatherPerCity.json')
describe('Weather Per City', function(){

    /*
    Test a normal directions set. For this test 3 coordiantes will be inputted
    Expect an JSON with 3 cities weather conditions to be returned
    */
    it( 'send normal directions set', function() {
        this.timeout(3000)
        return LambdaTest(lambdaFunction.handler).event({
            list: testJson["test"][0]["List"]
        }).expectResult( (result) =>{
            expect(result["List"]).to.have.lengthOf(3)
            result["List"].array.forEach(element, index => {
                expect(result[index]).to.have.property("Condition")
                expect(result[index]).to.have.property("Description")
                expect(result[index]).to.have.property("Temperature")
                expect(result[index]["Coordinates"]).to.equal(testJson["test"][0]["List"][index]["coordinates"])
            });
        });
    });

    /*
    Since a empty directions set will not be sent, one set of coordiantes will be the base case.
    Expect an JSON with 1 cities weather conditions to be returned
    */
    it( 'send one direction set', function(){
        return LambdaTest(lambdaFunction.handler).event({
            list: testJson["test"][1]["list"]
        }).expectResult( (result) =>{
            expect(result["List"]).to.have.lengthOf(1)
            expect(result["List"][0]).to.have.property("Condition")
            expect(result["List"][0]).to.have.property("Description")
            expect(result["List"][0]).to.have.property("Temperature")
            expect(result["List"][0]["Coordinates"]).to.equal(testJson["test"][1]["List"][0]["coordinates"])
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
            list: testJson["test"][2]["list"]
        }).expectResult( (result) =>{
            expect(result["List"]).to.have.lengthOf(15)
            result["List"].array.forEach(element, index => {
                expect(result[index]).to.have.property("Condition")
                expect(result[index]).to.have.property("Description")
                expect(result[index]).to.have.property("Temperature")
                expect(result[index]["Coordinates"]).to.equal(testJson["test"][2]["List"][index]["coordinates"])
            })
        });
    })
})

