const AbstractCommand = require("../AbstractInternalCommand").default;
const IllegalStateException = require("../../exceptions/Exceptions").IllegalStateException;

class UndoCommand extends AbstractCommand {

    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);
    }

    perform() {
        console.debug("performing UndoCommand", this.commandData);

        let cmd = null;

        this.editorContext.historyManager.popUndoStack((commandToUndo) => {
            cmd = commandToUndo;
        });

        this.editorContext.internalController.revert(cmd.internalCommand);

        return cmd;
    }

    shouldRemember() {
        return false;
    }

    static get commandName() {
        return "UNDO"
    }
}

exports.default = UndoCommand;