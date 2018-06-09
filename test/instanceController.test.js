const assert = require("assert");
const InstanceControllerContext = require("../src/editor/core/controller/InstanceControllerContext").default;

suite("test instance controller methods", function () {

    let ctx;

    setup(function() {
        ctx = new InstanceControllerContext();
    });

    test("create and retrieve value instance", function () {
        let path = "$['author']['firstName']";
        let value = "Theodor";

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);
        assert.equal(ctrl.value, value);

        assert.equal(ctrl.numChildren, 0);
        assert.deepEqual(ctrl.childPaths, []);
        assert.equal(ctrl.parentPath, "$['author']");
    });

    test("store and retrieve object instance", function() {
        let path = "$['author']";
        let value = {
            firstName: "Theodor",
            lastName: "Lesieg",
        };

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);
        assert.deepEqual(ctrl.value, value);

        assert.equal(ctrl.parentPath, "$");
        assert.equal(ctrl.numChildren, 2);
        assert.deepEqual(ctrl.childPaths, [
            "$['author']['firstName']",
            "$['author']['lastName']",
        ]);

    });
});