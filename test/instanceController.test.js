const assert = require("assert");
const InstanceControllerContext = require("../src/editor/core/controller/InstanceControllerContext").default;
const JsonPath = require("../src/editor/core/attempt3/JsonPath").JsonPath;

suite("test instance controller methods", function () {

    let ctx;

    const DEEP_OBJ_INST = {
        titles: [
            "Cat in the Hat",
            "Cat in the Hat Comes Back",
        ],
        authors: [
            {
                firstName: "Theodor",
                lastName: "Lesieg",
                suffix: "II",
            },
            {
                firstName: "Mary",
                lastName: "Evans",
            }
        ]
    };

    const DEEP_ARR_INST = [
        [
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
            },
        ],
        [
            {
                firstName: "Samuel",
                lastName: "Clemens",
                data: {
                    monikers: ['Mark Twain']
                }
            },
        ]
    ];

    setup(function () {
        ctx = new InstanceControllerContext();
    });

    test("create and retrieve null instance", function () {
        let path = JsonPath.fromArr("author", "middleName");
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
        let path = JsonPath.fromArr("author", "middleName");
        let value = undefined;

        assert.throws(() => {
            ctx.putAt(path, value)
        }, Error)
    });

    test("create and retrieve value instance", function () {
        let path = JsonPath.fromArr("author", "firstName");
        let value = "Theodor";

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);
        assert.equal(ctrl.value, value);

        assert.equal(ctrl.numChildren, 0);
        assert.deepEqual(ctrl.childPaths, []);
        assert.equal(ctrl.parentPath.toString(), path.parent.toString());
    });

    test("store and retrieve object instance", function () {
        let path = JsonPath.fromArr("author");
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
        assert.deepEqual(ctrl.childPaths.map((i) => i.toString()), [
            JsonPath.fromArr("author", "firstName").toString(),
            JsonPath.fromArr("author", "lastName").toString(),
        ]);
    });

    test("store and retrieve array instance", function () {
        let path = JsonPath.fromArr("titles");
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
        assert.deepEqual(ctrl.childPaths.map((i) => i.toString()), [
            JsonPath.fromArr("titles", "0").toString(),
            JsonPath.fromArr("titles", "1").toString(),
        ]);
    });

    test("store and retrieve deep object instance", function () {
        let path = JsonPath.fromArr("library");
        let value = DEEP_OBJ_INST;

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);

        console.log("value?", value);
        assert.deepEqual(ctrl.value, value);
    });

    test("store and retrieve deep array instance", function () {
        let path = JsonPath.fromArr("library");
        let value = DEEP_ARR_INST;

        ctx.putAt(path, value);
        let ctrl = ctx.getAt(path);

        assert.equal(ctrl.path, path);

        console.log("value?", value);
        assert.deepEqual(ctrl.value, value);
    });

    test("delete value instance", function () {
        let path = JsonPath.fromArr("sillyValueInstance");
        ctx.putAt(path, "sillyValue");

        // make sure that the path exists...
        let ctrls = ctx.controllers;
        let ctrlsPaths = ctrls.map((i) => i.path.toString());
        console.log("controllers before delete", ctrlsPaths);
        assert(ctrlsPaths.includes(path.toString()));

        // now delete it
        ctx.removeAt(path);

        // make sure that the path does not exist...
        let ctrlsAfterDelete = ctx.controllers;
        let ctrlsPathsAfterDelete = ctrlsAfterDelete.map((i) => i.path.toString());
        console.log("controllers after delete", ctrlsPathsAfterDelete);
        assert(!ctrlsPathsAfterDelete.includes(path.toString()));
    });

    test("delete null value instance", function () {
        let path = JsonPath.fromArr("sillyValueInstance");
        ctx.putAt(path, null);

        // make sure that the path exists...
        let ctrls = ctx.controllers;
        let ctrlsPaths = ctrls.map((i) => i.path.toString());
        console.log("controllers before delete", ctrlsPaths);
        assert(ctrlsPaths.includes(path.toString()));

        // now delete it
        ctx.removeAt(path);

        // make sure that the path does not exist...
        let ctrlsAfterDelete = ctx.controllers;
        let ctrlsPathsAfterDelete = ctrlsAfterDelete.map((i) => i.path.toString());
        console.log("controllers after delete", ctrlsPathsAfterDelete);
        assert(!ctrlsPathsAfterDelete.includes(path.toString()));
    });

    test("delete object instance", function () {
        let path = JsonPath.fromArr("sillyObjectInstance");
        let value = {
            firstName: "Theodor",
            lastName: "Lesieg",
        };
        ctx.putAt(path, value);

        // make sure that the path exists...
        let ctrls = ctx.controllers;
        let ctrlsPaths = ctrls.map((i) => i.path.toString());
        console.log("controllers before delete", ctrlsPaths);
        assert(ctrlsPaths.includes(path.toString()));

        // now delete it
        ctx.removeAt(path);

        // make sure that the path does not exist...
        let ctrlsAfterDelete = ctx.controllers;
        let ctrlsPathsAfterDelete = ctrlsAfterDelete.map((i) => i.path.toString());
        console.log("controllers after delete", ctrlsPathsAfterDelete);

        ctrlsAfterDelete.forEach((ctrl) => {
            assert.notEqual(ctrl.path.accessors[0], "sillyObjectInstance")
        });
    });

    test("delete array instance", function () {
        let path = JsonPath.fromArr("sillyArrayInstance");
        let value = [
            "Cat in the Hat",
            "Cat in the Hat Comes Back",
        ];
        ctx.putAt(path, value);

        // make sure that the path exists...
        let ctrls = ctx.controllers;
        let ctrlsPaths = ctrls.map((i) => i.path.toString());
        console.log("controllers before delete", ctrlsPaths);
        assert(ctrlsPaths.includes(path.toString()));

        // now delete it
        ctx.removeAt(path);

        // make sure that the path does not exist...
        let ctrlsAfterDelete = ctx.controllers;
        let ctrlsPathsAfterDelete = ctrlsAfterDelete.map((i) => i.path.toString());
        console.log("controllers after delete", ctrlsPathsAfterDelete);

        ctrlsAfterDelete.forEach((ctrl) => {
            assert.notEqual(ctrl.path.accessors[0], "sillyArrayInstance")
        });
    });

    test("delete deep object instance", function () {
        let path = JsonPath.fromArr("sillyArrayInstance");
        let value = DEEP_OBJ_INST;
        ctx.putAt(path, value);

        // make sure that the path exists...
        let ctrls = ctx.controllers;
        let ctrlsPaths = ctrls.map((i) => i.path.toString());
        console.log("controllers before delete", ctrlsPaths);
        assert(ctrlsPaths.includes(path.toString()));

        // now delete it
        ctx.removeAt(path);

        // make sure that the path does not exist...
        let ctrlsAfterDelete = ctx.controllers;
        let ctrlsPathsAfterDelete = ctrlsAfterDelete.map((i) => i.path.toString());
        console.log("controllers after delete", ctrlsPathsAfterDelete);

        ctrlsAfterDelete.forEach((ctrl) => {
            assert.notEqual(ctrl.path.accessors[0], "sillyArrayInstance")
        });
    });

    test("delete deep array instance", function () {
        let path = JsonPath.fromArr("sillyArrayInstance");
        let value = DEEP_ARR_INST;
        ctx.putAt(path, value);

        // make sure that the path exists...
        let ctrls = ctx.controllers;
        let ctrlsPaths = ctrls.map((i) => i.path.toString());
        console.log("controllers before delete", ctrlsPaths);
        assert(ctrlsPaths.includes(path.toString()));

        // now delete it
        ctx.removeAt(path);

        // make sure that the path does not exist...
        let ctrlsAfterDelete = ctx.controllers;
        let ctrlsPathsAfterDelete = ctrlsAfterDelete.map((i) => i.path.toString());
        console.log("controllers after delete", ctrlsPathsAfterDelete);

        ctrlsAfterDelete.forEach((ctrl) => {
            assert.notEqual(ctrl.path.accessors[0], "sillyArrayInstance")
        });
    });

    test("update value instance", function () {
        let path = JsonPath.fromArr("sillyValueInstance");
        ctx.putAt(path, "sillyValue");

        let ctrl = ctx.getAt(path);
        ctrl.value = "newValue";
        assert(ctrl.value, "newValue");
    });

    test("update object instance", function () {
        let path = JsonPath.fromArr("sillyObjectInstance");
        let value = {
            firstName: "Theodor",
            lastName: "Lesieg",
            suffix: "II",
        };

        ctx.putAt(path, value);

        console.log("context before update", ctx.controllers.map((i) => i.path.toString()));

        let ctrl = ctx.getAt(path);
        let newValue = {
            firstName: "Theodor",
            middleName: "Thomas",
            lastName: "Quater",
        };
        ctrl.value = newValue;

        console.log("context after update", ctx.controllers.map((i) => i.path.toString()));

        assert.deepEqual(ctrl.value, newValue);
    });

    test("update array instance", function () {
        let path = JsonPath.fromArr("sillyArrayInstance");
        let value = [
            "Cat in the Hat",
            "Cat in the Hat Comes Back",
        ];

        ctx.putAt(path, value);

        console.log("context before update", ctx.controllers.map((i) => i.path.toString()));

        let ctrl = ctx.getAt(path);
        let newValue = [
            "In a People House"
        ];
        ctrl.value = newValue;

        console.log("context after update", ctx.controllers.map((i) => i.path.toString()));

        assert.deepEqual(ctrl.value, newValue);
    });

    test("update deep object instance", function () {
        let path = JsonPath.fromArr("sillyObjectInstance");
        ctx.putAt(path, DEEP_OBJ_INST);
        console.log("context before update", ctx.controllers.map((i) => i.path.toString()));
        assert.ok(ctx.getAt(JsonPath.fromArr(path, "authors", 0, "suffix")));

        let ctrl = ctx.getAt(JsonPath.fromArr(path,  "authors", 0));
        let newValue = {
            firstName: "Theodor",
            middleName: "Thomas",
            lastName: "Quater",
        };
        ctrl.value = newValue;

        console.log("context after update", ctx.controllers.map((i) => i.path.toString()));

        assert.deepEqual(ctrl.value, newValue);
        assert.ok(!ctx.getAt(JsonPath.fromArr(path, "authors", 0, "suffix")));
    });

    test("update deep array instance", function () {
        let path = JsonPath.fromArr("sillyObjectInstance");
        ctx.putAt(path, DEEP_ARR_INST);
        console.log("context before update", ctx.controllers.map((i) => i.path.toString()));
        assert.ok(ctx.getAt(JsonPath.fromArr(path, 0, 0, "data")));

        let ctrl = ctx.getAt(JsonPath.fromArr(path, 0, 0));
        let newValue = {
            firstName: "Theodor",
            middleName: "Thomas",
            lastName: "Quater",
        };
        ctrl.value = newValue;

        console.log("context after update", ctx.controllers.map((i) => i.path.toString()));

        assert.deepEqual(ctrl.value, newValue);
        assert.ok(!ctx.getAt(JsonPath.fromArr(path, 0, 0, "data")));
    });
});