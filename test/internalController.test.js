const EditorContext = require("../src/editor/core/EditorContext").default;
const PutObjectCommand = require("../src/editor/core/commands/private/PutObjectCommand").default;
const PutArrayCommand = require("../src/editor/core/commands/private/PutArrayCommand").default;
const PutValueCommand = require("../src/editor/core/commands/private/PutValueCommand").default;
const assert = require('assert');

suite.skip('Internal Controller', function () {
    let editorContext;

    setup(function () {
        editorContext = new EditorContext();
    });

    test("PUT_OBJECT command creates a JSON instance controller", function () {
        let command = new PutObjectCommand(editorContext, {
            path: "$['newObject']",
        });

        // perform the command
        let result = editorContext.internalController.perform(command);
        assert(result);

        // now a controller should exist at that path
        let controller = editorContext.controllerLookupTable.getAt("$['newObject']");
        assert.ok(controller);
        assert.equal(controller.path, "$['newObject']");
    });

    test("PUT_ARRAY command creates a JSON instance controller", function () {
        let command = new PutArrayCommand(editorContext, {
            path: "$['newArray']",
        });

        // perform the command
        let result = editorContext.internalController.perform(command);
        assert(result);

        // now a controller should exist at that path
        let controller = editorContext.controllerLookupTable.getAt("$['newArray']");
        assert.ok(controller);
        assert.equal(controller.path, "$['newArray']");
    });

    test("PUT_VALUE command creates a JSON instance controller", function () {
        let command = new PutValueCommand(editorContext, {
            path: "$['newValue']",
        });

        // perform the command
        let result = editorContext.internalController.perform(command);
        assert(result);

        // now a controller should exist at that path
        let controller = editorContext.controllerLookupTable.getAt("$['newValue']");
        assert.ok(controller);
        assert.equal(controller.path, "$['newValue']");
    });
});

