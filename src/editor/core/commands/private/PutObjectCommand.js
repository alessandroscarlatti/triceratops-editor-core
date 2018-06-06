import AbstractInternalCommand from "../AbstractInternalCommand";
import ObjectController from "../../controller/ObjectController";

/**
 * A PUT_OBJECT command is a one-way operation.
 * It is to be performed no-questions-asked.
 *
 * cmdData may have the following properties:
 * - path: the path to
 */
class PutObjectCommand extends AbstractInternalCommand {

    /**
     * Create a new PUT_OBJECT command.
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
        this.editorContext.controllerLookupTable.putAt(this._cmdData.path, new ObjectController(this._cmdData.path));

        return true;
    }
}

exports.default = PutObjectCommand;