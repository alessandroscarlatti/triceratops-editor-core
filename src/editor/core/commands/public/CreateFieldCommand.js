const AbstractCommand = require("../AbstractInternalCommand").default;

class CreateFieldCommand extends AbstractCommand {

    /**
     * Take apart the command data and turn it into a list of
     * internalController calls.
     *
     * @param editorContext
     * @param cmdData
     */
    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);
    }

    /**
     * Run through the list of internalController calls.
     * @return {boolean} true on successful implementation.
     */
    perform() {
        console.debug("performing CreateFieldCommand", this.commandData);
        return true;
    }

    /**
     * Run through the list of revert internalController calls.
     */
    revert() {
        console.debug("performing revert of CreateFieldCommand");
    }

    static get commandName() {
        return "CREATE_FIELD"
    }
}

exports.default = CreateFieldCommand;