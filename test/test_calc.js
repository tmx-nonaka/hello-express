var assert = require('assert');
var myfuncs = require('../src/calc.js');

describe('myfuncs', function() {
	describe('add', function() {
		it ('1 plus 2', function() {
			assert.equal(myfuncs.add(1,2), 3)
		})
		it ('100 plus zero', function() {
			assert.equal(myfuncs.add(100,0),100)
		})
	})
})
