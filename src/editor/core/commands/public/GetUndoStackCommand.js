import AbstractCommand from "../AbstractInternalCommand";

class GetUndoStackCommand extends AbstractCommand {

    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);
    }

    perform() {
        console.debug("performing GetUndoStack", this.commandData);
        return this.editorContext.historyManager.undoStack;
    }

    shouldRemember() {
        return false;
    }

    static get commandName() {
        return "GET_UNDO_STACK"
    }
}

exports.default = GetUndoStackCommand;