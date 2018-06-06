const InstanceController = require("./InstanceController").default;

class ArrayController extends InstanceController {
    get type() {
        return InstanceController.controllerTypes.ARRAY_TYPE;
    }
}

exports.default = ArrayController;