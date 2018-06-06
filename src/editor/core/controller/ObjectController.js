import InstanceController from "./InstanceController";

class ObjectController extends InstanceController {
    get type() {
        return InstanceController.controllerTypes.OBJECT_TYPE;
    }
}

exports.default = ObjectController;