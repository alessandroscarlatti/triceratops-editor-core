const AbstractInternalCommand = require("../AbstractInternalCommand").default;
const ArrayController = require("../../controller/ArrayController").default;

/**
 * A PUT_ARRAY command is a one-way operation.
 * It is to be performed no-questions-asked.
 */
class PutArrayCommand extends AbstractInternalCommand {

    /**
     * Create a new PUT_ARRAY command.
     * @param editorContext
     * @param cmdData may have the following properties:
     * - path: the JSON path to this instance.
     */
    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);
    }

    perform() {
        // talk to the controllerLookupTable
        // add a new controller (or replace the existing controller)
        // at the specified path
        this.editorContext.controllerLookupTable.putAt(this._cmdData.path, new ArrayController(this._cmdData.path));
        return true;
    }
}

exports.default = PutArrayCommand;