const EditorContext = require("../src/editor/core/EditorContext").default;
const PutObjectCommand = require("../src/editor/core/commands/private/PutObjectCommand").default;
const PutArrayCommand = require("../src/editor/core/commands/private/PutArrayCommand").default;
const PutValueCommand = require("../src/editor/core/commands/private/PutValueCommand").default;

describe('internal controller can perform commands', () => {
    let commands = [
        PutObjectCommand,
        PutArrayCommand,
        PutValueCommand,
    ];

    commands.forEach((CommandClass) => {
        it(`perform ${CommandClass.handles()}`, function() {
            console.log("command", CommandClass);
            const editorContext = new EditorContext();

            let result = editorContext.internalController.perform(
                new CommandClass(editorContext, {
                    path: "/wherever",
                })
            );

            console.assert(result === true);
            let controller = editorContext.controllerLookupTable.getAt("/wherever");
            console.assert(result != null);
            console.assert(controller.path === "/wherever");
        })
    });
});
