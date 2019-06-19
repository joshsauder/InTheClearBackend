'use strict';

var expect = require('chai').expect;
var LambdaTest = require('lambda-tester');

var lambdaFunction = require("../functions/reverseGeocode");
var testJson = require('../test/reverseGeocodeTest.json')

describe('Reverse GeoCode', function(){
    it( 'send normal directions set', function() {
        return LambdaTest(lambdaFunction.hander).event({
            list: testJson["test"][0]["list"]
        }).expectResult( (result) =>{
            expect(result).to.eql({
                result: ['Columbus', 'Indianapolis']
            })
        });
    });

    it( 'send empty directions set', function(){
        return LambdaTest(lambdaFunction.hander).event({
            list: testJson["test"][1]["list"]
        }).expectResult( (result) =>{
            expect(result).to.eql({
                result: []
            })
        });
    })

    it( 'send large directions set ~15', function(){
        return LambdaTest(lambdaFunction.hander).event({
            list: testJson["test"][2]["list"]
        }).expectResult( (result) =>{
            expect(result).to.eql({
                result: ['Columbus', 'Indianapolis', 'Vancouver', 'San Francisco', 'Boston', 'San Diego', 'Los Angeles', 'Toronto', 'Quebec', 'Miami', 'Dallas', 'Phoenix', 'Fort Wayne', 'Toledo', 'Detroit']
            })
        });
    })
})

