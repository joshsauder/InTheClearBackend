'use strict';

var expect = require('chai').expect;
var LambdaTest = require('lambda-tester');
var lambdaFunction = require("../index");
var testJson = require('./reverseGeocodeTest.json')
var resultsVars = require('./reverseGeocode.results')
require('dotenv').config({ path: '../process.env'})

describe('Reverse GeoCode', function(){

    /*
    Test a normal directions set. For this test 8 coordiantes will be inputted
    Expect an array of 8 cities to be returned
    */
    it( 'send normal directions set', function() {
        this.timeout(3000)
        const expectedResult = resultsVars.expectedNormalResult
        return LambdaTest(lambdaFunction.handler).event({
            List: testJson["test"][0]["List"]
        }).expectResult( (result) =>{
            expect(result).to.have.lengthOf(8)
            //chai uses deep equality, so the below can be used
            expect(expectedResult).to.eql(result)
        });
    });

    /*
    Since a empty directions set will not be sent, one set of coordiantes will be the base case.
    Expect an array with one city to be returned
    */
    it( 'send one direction set', function(){
        const expectedResult = resultsVars.expectedOneResult
        return LambdaTest(lambdaFunction.handler).event({
            List: testJson["test"][1]["List"]
        }).expectResult( (result) =>{
            expect(result).to.have.lengthOf(1)
            expect(expectedResult).to.eql(result)
        });
    })

    /*
    In the case of a cross country trip, more coordinate sets will be sent.
    Expect an array of 20 cities to be returned
    */
    it( 'send large directions set =20', function(){
        //needed since 2000 ms isnt long enough to complete 15 requests
        this.timeout(10000)
        const expectedResult = resultsVars.expectedLargeResult
        return LambdaTest(lambdaFunction.handler).event({
            List: testJson["test"][2]["List"]
        }).expectResult( (result) =>{
            expect(result).to.have.lengthOf(20)
            expect(expectedResult).to.eql(result)
        });
    })
})

