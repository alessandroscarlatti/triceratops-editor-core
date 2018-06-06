/**
 * The CommandManager receives an ExternalCommand and
 * translates it into an EditorCommand.
 */

const EditorCommand = require("../commands/model/EditorCommand").default;

class CommandManager {
    constructor(editorContext) {
        this.editorContext = editorContext;
        this.currentCommandId = -1;
        this.componentName = "COMMAND_MANAGER";

        // bindings
        this.invokeCommandAndRemember = this.invokeCommandAndRemember.bind(this);
        this.buildEditorCommand = this.buildEditorCommand.bind(this);
        this.nextCommandId = this.nextCommandId.bind(this);
        this.shouldRememberCommand = this.shouldRememberCommand.bind(this);
    }

    /**
     * Translate the externalCommand into an EditorCommand.
     * IMPORTANT: this method has a side effect, in that
     * it adds this command to the history!
     *
     * @param externalCommand
     */
    invokeCommandAndRemember(externalCommand) {
        let cmd = this.buildEditorCommand(externalCommand);

        // post-process command
        // could add in default values here
        // could validate this command here against internal command rules we could write
        cmd.internalCommand.postProcessCommandData();

        if (cmd.remember) {
            this.editorContext.historyManager.submit(cmd);
        }

        return this.editorContext.internalController.perform(cmd.internalCommand);
    }

    buildEditorCommand(externalCommand) {
        let cmd = new EditorCommand();
        cmd.id = this.nextCommandId();
        cmd.externalCommand = externalCommand;

        // would build internal commands...
        // this is where we look up abstract internal commands...

        cmd.internalCommand = this.editorContext.commandFactory.newCommand({
            commandName: cmd.externalCommand.body.command, // TODO can simplify qualification here...
            editorContext: this.editorContext,
            commandData: externalCommand,
        });

        cmd.remember = this.shouldRememberCommand(cmd.externalCommand, cmd.internalCommand);
        return cmd;
    }

    shouldRememberCommand(externalCommand, internalCommand) {
        if (externalCommand.body.remember != null) {
            return externalCommand.body.remember;
        } else {
            return internalCommand.shouldRemember();
        }
    }

    nextCommandId() {
        this.currentCommandId++;
        return this.currentCommandId;
    }
}

exports.default = CommandManager;