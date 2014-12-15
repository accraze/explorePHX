var request = require('supertest')
  , express = require('express');
 
var app = require('../server');
 
describe('Index Page', function() {
  it("renders successfully", function(done) {
    request(app).get('/').expect(200, done);    
  })
})

describe('Geoms Page', function () {
	it('should return an array of location points', function(done) {  
	  request(app)
	  .get('/geoms')
	  .expect('Content-Type', /json/)
	  .expect(200, done);
	});	
})
