const AbstractCommand = require("../AbstractInternalCommand").default;
const IllegalStateException = require("../../exceptions/Exceptions").IllegalStateException;

class IsUndoAvailableCommand extends AbstractCommand {

    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);
    }

    perform() {
        console.debug("performing IsUndoAvailableCommand", this.commandData);
        return this.editorContext.historyManager.undoStack.length > 0;
    }

    revert() {
        throw new IllegalStateException("UndoCommand should never be reverted.")
    }

    shouldRemember() {
        return false;
    }

    static get commandName() {
        return "IS_UNDO_AVAILABLE"
    }
}

exports.default = IsUndoAvailableCommand;
