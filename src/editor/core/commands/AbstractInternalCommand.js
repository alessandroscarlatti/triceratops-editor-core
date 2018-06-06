import {IllegalStateException} from "../../../exceptions/Exceptions";

class AbstractInternalCommand {

    /**
     * In its constructor, every subclass should build out exactly
     * what function it would like to provide for perform() and revert().
     * Using a Function factory for this would probably not be out of the question!
     * @param editorContext
     * @param cmdData
     */
    constructor(editorContext, cmdData) {
        this.editorContext = editorContext;
        this._cmdData = cmdData;

        // bindings
        this.perform = this.perform.bind(this);
        this.revert = this.revert.bind(this);
        this.shouldRemember = this.shouldRemember.bind(this);
    }

    perform() {
    }

    revert() {
        throw new IllegalStateException(`Command ${this.commandName} should never be reverted.`)
    }

    /**
     * @return boolean the default shouldRemember choice for this command.
     */
    shouldRemember() {
        return true;
    }

    /**
     * Have the opportunity to post-process the command data
     * for the purpose, perhaps of adding a default value, for example...
     */
    postProcessCommandData() {
        // do nothing by default
    }

    static get commandName() {
    }

    /**
     * Could this command handle the command name?
     * @param commandName
     */
    static handles(commandName) {
        if (commandName == null) {
            return AbstractInternalCommand.commandName;
        }

        return commandName === this.commandName;
    }


    get commandData() {
        return this._cmdData;
    }

    toString() {
        return this._cmdData;
    }
}

exports.default = AbstractInternalCommand;