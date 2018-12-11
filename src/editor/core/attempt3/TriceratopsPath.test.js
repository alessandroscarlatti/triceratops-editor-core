const assert = require("assert");
const TriceratopsPath = require("./TriceratopsPath").default;
describe("JsonPath test", function () {
    describe("create path from json path string", function () {

        let jp0 = "$['author']['firstName']";
        it(`path ${jp0} has correct accessors`, function () {
            let path = TriceratopsPath.fromStr(jp0);
            let accs = ["author", "firstName"];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });

        jp1 = "$['authors'][0]['firstName']";
        it(`path ${jp1} has correct accessors`, function () {
            let path = TriceratopsPath.fromStr(jp1);
            let accs = ["authors", "0", "firstName"];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });

        jp2 = "$";
        it(`path ${jp2} has correct accessors`, function () {
            let path = TriceratopsPath.fromStr(jp2);
            let accs = [];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });

        jp3 = "$[author][firstName]";
        it(`path ${jp3} has correct accessors`, function() {
            let path = TriceratopsPath.fromStr(jp3);
            let accs = ["author", "firstName"];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        })
    });

    describe("create path from array of accessors", function () {
        arr0 = ["authors", "0", "firstName"];
        it(`path ${arr0} has correct accessors`, function () {
            let path = TriceratopsPath.fromArr(arr0);
            let accs = ["authors", "0", "firstName"];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });

        arr1 = ["authors", "1", "firstName"];
        it(`path ${arr1} has correct accessors`, function () {
            let path = TriceratopsPath.fromArr("authors", "1", "firstName");
            let accs = ["authors", "1", "firstName"];
            console.log("accessors", path.accessors);
            assert.deepEqual(path.accessors, accs);
        });
    });

    describe("create path from path and additional accessors", function() {
        let origPathAccs = ["authors", "0"];
        let origPath = TriceratopsPath.fromArr(origPathAccs);

        it(`add to orig path ${origPath}`, function () {
            let newAcc = "firstName";
            let newPath = TriceratopsPath.fromPath(origPath).resolve(newAcc);

            let expAccs = [...origPathAccs, newAcc];
            console.log("accessors", newPath.accessors);
            assert.deepEqual(newPath.accessors, expAccs);
        });

        it(`add multiple accessors to orig path ${origPath}`, function () {
            let newPath = TriceratopsPath.fromPath(origPath).resolve("friends", 3);

            let expAccs = [...origPathAccs, "friends", 3];
            console.log("accessors", newPath.accessors);
            assert.deepEqual(newPath.accessors, expAccs);
        });
    });

    describe("create path from existing path", function() {
        let origPathAccs = ["authors", "0"];
        let origPath = TriceratopsPath.fromArr(origPathAccs);

        it(`from original path ${origPath}`, function () {
            let newPath = TriceratopsPath.fromPath(origPath);
            console.log("accessors", newPath.accessors);
            assert.deepEqual(newPath.accessors, origPathAccs);
        });
    });

    describe("get parent from existing path", function() {
        let origPath = TriceratopsPath.fromArr("authors", "0", "firstName");

        it (`get parent from ${origPath}`, function() {
            let newPath = origPath.parent;
            let expAccs = ["authors", "0"];
            assert.deepEqual(newPath.accessors, expAccs)
        });

        it (`get parent from ${origPath.parent}`, function() {
            let newPath = origPath.parent.parent;
            let expAccs = ["authors"];
            assert.deepEqual(newPath.accessors, expAccs)
        });

        it (`get parent from ${origPath.parent.parent}`, function() {
            let newPath = origPath.parent.parent.parent;
            let expAccs = [];
            assert.deepEqual(newPath.accessors, expAccs)
        });

        it (`get parent from ${origPath.parent.parent.parent}`, function() {
            let newPath = origPath.parent.parent.parent.parent;
            let expAccs = [];
            assert.deepEqual(newPath.accessors, expAccs)
        });
    });

    describe("get name from path", function() {
        let path = TriceratopsPath.fromArr("authors", 0, "firstName");
        it(`get name from ${path}`, function () {
            assert.equal("firstName", path.name);
        });

        it(`get name from ${path.parent}`, function () {
            assert.equal("0", path.parent.name);
        });

        it(`get name from ${path.parent.parent}`, function () {
            assert.equal("authors", path.parent.parent.name);
        });

        it(`get name from ${path.parent.parent.parent}`, function () {
            assert.equal("$", path.parent.parent.parent.name);
        });
    })
});
