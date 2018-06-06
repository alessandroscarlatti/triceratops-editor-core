import AbstractCommand from "../AbstractInternalCommand";

class IsRedoAvailableCommand extends AbstractCommand {

    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);
    }

    perform() {
        console.debug("performing IsRedoAvailableCommand", this.commandData);
        return this.editorContext.historyManager.redoStack.length > 0;
    }

    shouldRemember() {
        return false;
    }

    static get commandName() {
        return "IS_REDO_AVAILABLE"
    }
}

exports.default = IsRedoAvailableCommand;