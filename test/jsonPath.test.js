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
        arr0 = ["authors", "0", "firstName"];
        it(`path ${arr0} has correct accessors`, function () {
            let path = JsonPath.get(arr0);
            let accs = ["authors", "0", "firstName"];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });
    });

    describe("create path from path and additional accessors", function() {
        let origPathAccs = ["authors", "0"];
        let origPath = JsonPath.get(origPathAccs);

        it(`add to orig path ${origPath}`, function () {
            let newAcc = "firstName";
            let newPath = JsonPath.get(origPath, newAcc);

            let expAccs = [...origPathAccs, newAcc];
            console.log("accessors", newPath.accessors);
            assert.deepEqual(newPath.accessors, expAccs);
        });
    });

    describe("create path from existing path", function() {
        let origPathAccs = ["authors", "0"];
        let origPath = JsonPath.get(origPathAccs);

        it(`from original path ${origPath}`, function () {
            let newPath = JsonPath.get(origPath);
            console.log("accessors", newPath.accessors);
            assert.deepEqual(newPath.accessors, origPathAccs);
        });
    });
});
