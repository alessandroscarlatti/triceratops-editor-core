const InstanceController = require("./InstanceController").default;

class ValueController extends InstanceController {
    get type() {
        return InstanceController.controllerTypes.VALUE_TYPE;
    }
}

exports.default = ValueController;