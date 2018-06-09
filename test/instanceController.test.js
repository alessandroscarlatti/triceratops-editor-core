const assert = require("assert");
const InstanceControllerContext = require("../src/editor/core/controller/InstanceControllerContext").default;
const JsonPath = require("../src/editor/core/util/JsonPath").JsonPath;

suite("test instance controller methods", function () {

    let ctx;

    setup(function() {
        ctx = new InstanceControllerContext();
    });

    test("create and retrieve null instance", function () {
        let path = JsonPath.get("author", "middleName");
        let value = null;

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);
        assert.equal(ctrl.value, value);

        assert.equal(ctrl.numChildren, 0);
        assert.deepEqual(ctrl.childPaths, []);
        assert.equal(ctrl.parentPath.toString(), path.parent.toString());
    });

    test("error creating undefined instance", function () {
        let path = JsonPath.get("author", "middleName");
        let value = undefined;

        assert.throws(() => {ctx.putAt(path, value)}, Error)
    });

    test("create and retrieve value instance", function () {
        let path = JsonPath.get("author", "firstName");
        let value = "Theodor";

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);
        assert.equal(ctrl.value, value);

        assert.equal(ctrl.numChildren, 0);
        assert.deepEqual(ctrl.childPaths, []);
        assert.equal(ctrl.parentPath.toString(), path.parent.toString());
    });

    test("store and retrieve object instance", function() {
        let path = JsonPath.get("author");
        let value = {
            firstName: "Theodor",
            lastName: "Lesieg",
        };

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);
        assert.deepEqual(ctrl.value, value);

        assert.equal(ctrl.parentPath.toString(), "$");
        assert.equal(ctrl.numChildren, 2);
        assert.deepEqual(ctrl.childPaths.map((i)=> i.toString()), [
            JsonPath.get("author", "firstName").toString(),
            JsonPath.get("author", "lastName").toString(),
        ]);
    });

    test("store and retrieve array instance", function() {
        let path = JsonPath.get("titles");
        let value = [
            "Cat in the Hat",
            "Cat in the Hat Comes Back",
        ];

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);
        assert.deepEqual(ctrl.value, value);

        assert.equal(ctrl.parentPath.toString(), "$");
        assert.equal(ctrl.numChildren, 2);
        assert.deepEqual(ctrl.childPaths.map((i)=> i.toString()), [
            JsonPath.get("titles", "0").toString(),
            JsonPath.get("titles", "1").toString(),
        ]);
    });

    test("store and retrieve deep object instance", function() {
        let path = JsonPath.get("library");
        let value = {
            titles: [
                "Cat in the Hat",
                "Cat in the Hat Comes Back",
            ],
            authors: [
                {
                    firstName: "Theodor",
                    lastName: "Lesieg",
                },
                {
                    firstName: "Mary",
                    lastName: "Evans",
                }
            ]
        };

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);

        console.log("value?", value);
        assert.deepEqual(ctrl.value, value);
    });

    test("store and retrieve deep array instance", function() {
        let path = JsonPath.get("library");
        let value = {
            authors: [
                {
                    firstName: "Theodor",
                    lastName: "Lesieg",
                    data: {
                        monikers: ['Dr. Seuss']
                    }
                },
                {
                    firstName: "Mary",
                    lastName: "Evans",
                    data: {
                        monikers: ["George Elliot"]
                    }
                }
            ]
        };

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);

        console.log("value?", value);
        assert.deepEqual(ctrl.value, value);
    });
});