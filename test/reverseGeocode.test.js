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
                result: ['Columbus, Ohio', 'Indianapolis, Indiana', 'Vancouver, British Columbia']
            })
        });
    });

    it( 'send empty directions set', function(){
        return LambdaTest(lambdaFunction.hander).event({
            list: testJson["test"][1]["list"]
        }).expectResult( (result) =>{
            expect(result).to.eql({
                result: ['Columbus, Ohio']
            })
        });
    })

    it( 'send large directions set ~15', function(){
        return LambdaTest(lambdaFunction.hander).event({
            list: testJson["test"][2]["list"]
        }).expectResult( (result) =>{
            expect(result).to.eql({
                result: ['Columbus, Ohio', 'Indianapolis, Indiana', 'Vancouver, British Columbia', 'San Francisco, California', 'Boston, Massachusetts', 'San Diego, California', 'Los Angeles, California', 'Toronto, Ontario', 'Quebec, Quebec', 'Miami, Florida', 'Dallas, Texas', 'Phoenix, Arizona', 'Fort Wayne, Indiana', 'Toledo, Ohio', 'Detroit, Michigan']
            })
        });
    })
})

