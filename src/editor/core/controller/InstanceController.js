/**
 * A field controller controls the flow of data into and out of a single field,
 * including mutations to that field.
 */
import {IllegalStateException} from "../../../exceptions/Exceptions";

class InstanceController {
    constructor(path) {
        this._path = path;
    }

    get path() {
        return this._path;
    }

    get type() {
        throw new IllegalStateException("InstanceController should not be instantiated directly.");
    }

    static get controllerTypes() {
        return {
            OBJECT_TYPE: "OBJECT_TYPE",
            ARRAY_TYPE: "ARRAY_TYPE",
            VALUE_TYPE: "VALUE_TYPE",
        }
    }
}

exports.default = InstanceController;