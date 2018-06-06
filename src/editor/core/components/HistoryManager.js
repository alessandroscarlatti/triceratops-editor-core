import {RuntimeException} from "../../../exceptions/Exceptions";
import applyListenableAttributes from "../aspects/ListenableComponentAttributes";

class HistoryManager {
    constructor() {
        applyListenableAttributes(this);

        this._undoStack = [];
        this._redoStack = [];
        this.componentName = "HISTORY_MANAGER";

        // bindings
        this.popUndoStackAndStopWith = this.popUndoStackAndStopWith.bind(this);
        this.popRedoStackAndStopWith = this.popRedoStackAndStopWith.bind(this);
        this.popUndoStack = this.popUndoStack.bind(this);
        this.popRedoStack = this.popRedoStack.bind(this);

        this.buildDefaultEventData = this.buildDefaultEventData.bind(this);
    }

    /**
     * For the moment the listener is considered external for all events.
     * @param eventName the event name of the event under consideration.
     * @return {boolean} whether a listener is allowed externally for this event.
     */
    isListenerExternal(eventName) {
        return true;
    }

    submit(editorCommand) {
        console.debug("Storing EditorCommand", editorCommand);
        this._undoStack.push(editorCommand);
        this.raiseEvent(this.buildDefaultEventData(editorCommand));
    }

    buildDefaultEventData(commandJustPerformed) {
        return {
            justPerformed: commandJustPerformed,
            undoStack: () => this._undoStack,
            redoStack: () => this._redoStack,
            isUndoAvailable: this._undoStack.length > 0,
            isRedoAvailable: this._redoStack.length > 0,
        }
    }

    popUndoStack(commandCallback) {
        let cmd = this._undoStack.pop();
        this._redoStack.push(cmd);
        commandCallback(cmd);
        this.raiseEvent(this.buildDefaultEventData(cmd));
    }

    popRedoStack(commandCallback) {
        let cmd = this._redoStack.pop();
        this._undoStack.push(cmd);
        commandCallback(cmd);
        this.raiseEvent(this.buildDefaultEventData(cmd));
    }

    popUndoStackAndStopWith(commandIdStopWith, commandCallback) {
        // stream the undo stack up to and including the given commandId.
        // this pops a command off the undo stack onto the redo stack

        while (true) {
            try {
                let cmd = this._undoStack.pop();
                this._redoStack.push(cmd);
                commandCallback(cmd);
                if (cmd.commandData.id === commandIdStopWith) break;
            } catch (e) {
                throw new RuntimeException(`Error undoing command ${cmd.id}: ${cmd}`, e);
            }
        }
    }

    popRedoStackAndStopWith(commandIdStopWith, commandCallback) {
        // stream the redo stack up to and including the given commandId.
        // this pops a command off the redo stack onto the undo stack

        while (true) {
            let cmd = this._redoStack.pop();
            this._undoStack.push(cmd);

            commandCallback(cmd);
            if (cmd.commandData.id === commandIdStopWith) break;
        }
    }

    get undoStack() {
        return this._undoStack;
    }

    get redoStack() {
        return this._redoStack;
    }
}

exports.default = HistoryManager;