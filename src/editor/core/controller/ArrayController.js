import InstanceController from "./InstanceController";

class ArrayController extends InstanceController {
    get type() {
        return InstanceController.controllerTypes.ARRAY_TYPE;
    }
}

exports.default = ArrayController;