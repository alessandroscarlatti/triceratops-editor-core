const applyListenableAttributes = require("../aspects/ListenableComponentAttributes").default;

/**
 * This is the controller that will receive requests and commands
 * and perform the actions, no questions asked.
 *
 * These requests and commands are ALL of the type EditorCommand.
 * This ensures that the external models is decoupled from the
 * internal model.
 */
class InternalController {
    constructor(editorContext) {
        applyListenableAttributes(this);
        this.editorContext = editorContext;
        this.componentName = "INTERNAL_CONTROLLER";

        // bindings
        this.perform = this.perform.bind(this);
        this.revert = this.revert.bind(this);
    }

    perform(internalCommand) {
        console.debug("perform() internal command received", internalCommand.toString());
        return internalCommand.perform();
    }

    revert(internalCommand) {
        console.debug("revert() internal command received", internalCommand);
        return internalCommand.revert();
    }
}

exports.default = InternalController;