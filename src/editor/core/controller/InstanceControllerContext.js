const InstanceController = require("./InstanceController").default;
const JsonPath = require("../util/JsonPath").JsonPath;

class InstanceControllerContext {
    constructor() {
        this._newController = this._newController.bind(this);
        this.toString = this.toString.bind(this);
        this._table = {};
    }

    /**
     * Get the component at the specified JSON path
     * @param path the JSON path to use against the table
     */
    getAt(path) {
        return this._table[path.toString()];
    }

    /**
     * Add the controller to the table at the specified path
     * @param path where to put the controller
     * @param value the initial value for the instance
     */
    putAt(path, value) {
        let key = path.toString();
        if (this._table[key]) {
            console.warn(`path ${key} already exists in table!`)
        }

        this._table[key] = this._newController(path, value);
    }

    /**
     * Create a new controller at this path with this value.
     * The new controller will be linked to this context.
     * @param path path for the new controller.
     * @param value value for the new controller.
     */
    _newController(path, value) {
        let ctrl = new InstanceController(path, value, this);
        console.log("new instance controller" + ctrl);
        return ctrl;
    }

    get controllers() {
        let ctrls = [];
        let table = this._table;
        for (let ctrl in table) {
            if (table.hasOwnProperty(ctrl)) {
                ctrls.push(table[ctrl]);
            }
        }
        return ctrls;
    }

    /**
     * Remove recursively at the given path.
     * @param path the path to look for
     */
    removeAt(path) {
        let ctrl = this.getAt(path);
        let childPaths = ctrl.childPaths;

        // ask each child to be removed before finally removing this one...
        for (let i = 0; i < childPaths.length; i++) {
            this.removeAt(childPaths[i]);
        }

        delete this._table[path.toString()];
    }

    toString() {
        let str = "InstanceControllerContext";
        str += "[" + this._table + "]";
        return str;
    }
}

exports.default = InstanceControllerContext;