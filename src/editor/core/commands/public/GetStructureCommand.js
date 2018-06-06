const AbstractCommand = require("../AbstractInternalCommand").default;

class GetStructureCommand extends AbstractCommand {

    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);
    }

    /**
     *
     * @return {*} the structure at the current path, evaluated now.
     */
    perform() {
        console.debug("performing GetStructureCommand", this.commandData);
        return {};
    }

    shouldRemember() {
        return false;
    }

    static get commandName() {
        return "GET_STRUCTURE";
    }
}

exports.default = GetStructureCommand;