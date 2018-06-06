import InstanceController from "./InstanceController";

class ValueController extends InstanceController {
    get type() {
        return InstanceController.controllerTypes.VALUE_TYPE;
    }
}

exports.default = ValueController;