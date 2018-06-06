const InstanceController = require("./InstanceController").default;

class ObjectController extends InstanceController {
    get type() {
        return InstanceController.controllerTypes.OBJECT_TYPE;
    }
}

exports.default = ObjectController;