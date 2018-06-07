const InstanceController = require("./InstanceController").default;

class InstanceControllerContext {
    constructor() {
        this.newController = this.newController.bind(this);
        this.table = {};
    }

    /**
     * Get the component at the specified JSON path
     * @param path the JSON path to use against the table
     */
    getAt(path) {
        return this.table[path];
    }

    /**
     * Add the controller to the table at the specified path
     * @param path where to put the controller
     * @param value the initial value for the instance
     */
    putAt(path, value) {
        if (this.table[path]) {
            console.warn(`path ${path} already exists in table!`)
        }

        this.table[path] = this.newController(path, value);
    }

    /**
     * Create a new controller at this path with this value.
     * The new controller will be linked to this context.
     * @param path path for the new controller.
     * @param value value for the new controller.
     */
    newController(path, value) {
        let ctrl = new InstanceController(path, value, this);
        console.log("new instance controller", ctrl);
        return ctrl;
    }

    /**
     * Remove recursively at the given path.
     * @param path the path to look for
     */
    removeAt(path) {
        // TODO implement this...
    }
}

exports.default = InstanceControllerContext;