const assert = require('assert');
const stuff = require('./something').default;

describe('Mocha', function() {
    it("mocha is working", function() {
        assert(1 === 1);
        console.log("stuff", stuff)
    })
});