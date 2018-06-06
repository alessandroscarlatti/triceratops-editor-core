import AbstractCommand from "../AbstractInternalCommand";

class GetRedoStackCommand extends AbstractCommand {

    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);
    }

    perform() {
        console.debug("performing GetRedoStack", this.commandData);
        return this.editorContext.historyManager.redoStack;
    }

    shouldRemember() {
        return false;
    }

    static get commandName() {
        return "GET_REDO_STACK"
    }
}

exports.default = GetRedoStackCommand;