const assert = require("assert");
const JsonPath = require("../src/editor/core/util/JsonPath").JsonPath;
describe("JsonPath test", function () {
    describe("create path from json path string", function () {

        let jp0 = "$['author']['firstName']";
        it(`path ${jp0} has correct accessors`, function () {
            let path = JsonPath.get(jp0);
            let accs = ["author", "firstName"];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });

        jp1 = "$['authors'][0]['firstName']";
        it(`path ${jp1} has correct accessors`, function () {
            let path = JsonPath.get(jp1);
            let accs = ["authors", "0", "firstName"];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });

        jp2 = "$";
        it(`path ${jp2} has correct accessors`, function () {
            let path = JsonPath.get(jp2);
            let accs = [];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });
    });

    describe("create path from array of accessors", function () {
        jp3 = ["authors", "0", "firstName"];
        it(`path ${jp3} has correct accessors`, function () {
            let path = JsonPath.get(jp3);
            let accs = ["authors", "0", "firstName"];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });
    });
});
