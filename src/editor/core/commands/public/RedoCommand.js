import AbstractCommand from "../AbstractInternalCommand";
import {IllegalStateException} from "../../../../exceptions/Exceptions";

class RedoCommand extends AbstractCommand {

    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);
    }

    /**
     * @returns {*} the command redone
     */
    perform() {
        console.debug("performing RedoCommand", this.commandData);

        let cmd = null;

        this.editorContext.historyManager.popRedoStack((commandToRedo) => {
            cmd = commandToRedo;
        });

        this.editorContext.internalController.perform(cmd.internalCommand);

        return cmd;
    }

    shouldRemember() {
        return false;
    }

    static get commandName() {
        return "REDO"
    }
}

exports.default = RedoCommand;