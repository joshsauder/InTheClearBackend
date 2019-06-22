'use strict';

var expect = require('chai').expect;
var LambdaTest = require('lambda-tester');

var lambdaFunction = require("../index");
var testJson = require('./reverseGeocodeTest.json')
describe('Reverse GeoCode', function(){

    /*
    Test a normal directions set. For this test 3 coordiantes will be inputted
    Expect an array of 3 cities to be returned
    */
    it( 'send normal directions set', function() {
        this.timeout(3000)
        const expectedResult = ['Columbus, Ohio', 'Indianapolis, Indiana', 'Vancouver, British Columbia']
        return LambdaTest(lambdaFunction.handler).event({
            list: testJson["test"][0]["list"]
        }).expectResult( (result) =>{
            expect(result).to.have.lengthOf(3)
            //chai uses deep equality, so the below can be used
            expect(expectedResult).to.eql(result)
        });
    });

    /*
    Since a empty directions set will not be sent, one set of coordiantes will be the base case.
    Expect an array with one city to be returned
    */
    it( 'send one direction set', function(){
        const expectedResult = ['Columbus, Ohio']
        return LambdaTest(lambdaFunction.handler).event({
            list: testJson["test"][1]["list"]
        }).expectResult( (result) =>{
            expect(result).to.have.lengthOf(1)
            expect(expectedResult).to.eql(result)
        });
    })

    /*
    In the case of a cross country trip, more coordinate sets will be sent.
    Expect an array of 15 cities to be returned
    */
    it( 'send large directions set ~15', function(){
        //needed since 2000 ms isnt long enough to complete 15 requests
        this.timeout(10000)
        const expectedResult = ['Columbus, Ohio', 'Indianapolis, Indiana', 'Vancouver, British Columbia', 'San Francisco, California', 'Boston, Massachusetts', 'San Diego, California', 'Los Angeles, California', 'Toronto, Ontario', 'Las Vegas, Nevada', 'Miami, Florida', 'Dallas, Texas', 'Phoenix, Arizona', 'Fort Wayne, Indiana', 'Toledo, Ohio', 'Detroit, Michigan']
        return LambdaTest(lambdaFunction.handler).event({
            list: testJson["test"][2]["list"]
        }).expectResult( (result) =>{
            expect(result).to.have.lengthOf(15)
            expect(expectedResult).to.eql(result)
        });
    })
})

