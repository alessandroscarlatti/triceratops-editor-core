/**
 * A field controller controls the flow of data into and out of a single field,
 * including mutations to that field.
 */

const JsonPathParser = require("../util/JsonPathParser").JsonPathParser;
const JsonPath = require("../util/JsonPath").JsonPath;


// TODO working on getting the instance controller filled with methods...

class InstanceController {
    /**
     *
     * @param path {JsonPath}
     * @param value
     * @param context
     */
    constructor(path, value, context) {
        this.getProperty = this.getProperty.bind(this);
        this.setProperty = this.setProperty.bind(this);
        this._buildObject = this._buildObject.bind(this);
        this._buildArray = this._buildArray.bind(this);
        this._setObjectValue = this._setObjectValue.bind(this);
        this._setArrayValue = this._setArrayValue.bind(this);
        this._getChildPath = this._getChildPath.bind(this);
        this._setAtomicValue = this._setAtomicValue.bind(this);
        this._setValue = this._setValue.bind(this);
        this._updateValue = this._updateValue.bind(this);
        this._updateAtomicValue = this._updateAtomicValue.bind(this);
        this._updateObjectValue = this._updateObjectValue.bind(this);
        this._updateArrayValue = this._updateArrayValue.bind(this);
        this.toString = this.toString.bind(this);

        this._path = path;
        this._name = path.name;
        this._context = context;
        this._type = null;
        this._parentPath = path.parent;
        this._childPaths = [];
        this._atomicValue = undefined;
        this._properties = {};

        this._setValue(value);
    }

    /**
     * Path may not be set because it should be immutable.
     * @return {*}
     */
    get path() {
        return this._path;
    }

    /**
     *
     * @return {string} one of #controllerTypes,
     * determined by the type of value provided in setValue().
     * Defaults to VALUE_TYPE.
     */
    get type() {
        return this._type;
    }

    /**
     * @return {*} get the value in this controller
     * May recursively call related (child) controllers.
     */
    get value() {
        if (this._type === "VALUE_TYPE") {
            return this._atomicValue;
        } else if (this._type === "OBJECT_TYPE") {
            return this._buildObject();
        } else if (this._type === "ARRAY_TYPE") {
            return this._buildArray();
        }

        throw new Error(`Error constructing type for ${this._type}`);
    }

    /**
     * Set the value in this controller.
     * May recursively call related (child) controllers.
     * May change the "type" of this controller.
     *
     * Assumes that an update is intended.
     * @param val the new value for the field this controller represents.
     */
    set value(val) {
        this._updateValue(val);
    }

    _setValue(val) {
        if (val === undefined)
            throw new Error(`InstanceController may not have illegal value '${val}'`);

        if (InstanceController._isInstanceAtomic(val)) {
            this._setAtomicValue(val);
        } else {
            if (val.constructor.name === Object.name) {
                this._setObjectValue(val);
            } else if (val.constructor.name === Array.name) {
                this._setArrayValue(val);
            } else {
                throw new Error(`Unrecognized instance type '${val.constructor.name}' for instance ${val}`)
            }
        }
    }

    _updateValue(val) {
        if (val === undefined)
            throw new Error(`InstanceController may not have illegal value '${val}'`);

        if (InstanceController._isInstanceAtomic(val)) {
            this._updateAtomicValue(val);
        } else {
            if (val.constructor.name === Object.name) {
                this._updateObjectValue(val);
            } else if (val.constructor.name === Array.name) {
                this._updateArrayValue(val);
            } else {
                throw new Error(`Unrecognized instance type '${val.constructor.name}' for instance ${val}`)
            }
        }
    }

    _setAtomicValue(val) {
        this._atomicValue = val;
        this._type = "VALUE_TYPE";
    }

    _setObjectValue(obj) {
        this._type = "OBJECT_TYPE";
        for (let p in obj) {
            if (obj.hasOwnProperty(p)) {
                let childPath = JsonPath.get(this._path, p);
                this._context.putAt(childPath, obj[p]);
                this._childPaths.push(childPath);
            }
        }
    }

    _updateAtomicValue(val) {
        this._atomicValue = val;
    }

    _updateObjectValue(obj) {
        let oldChildPaths = {};
        for (let childPath of this._childPaths) {
            oldChildPaths[childPath.toString()] = childPath;
        }

        this._childPaths = [];

        for (let p in obj) {
            if (obj.hasOwnProperty(p)) {
                let childPath = JsonPath.get(this._path, p);
                let childCtrl = this._context.getAt(childPath);
                let childVal = obj[p];
                if (childCtrl == null) {
                    // add new
                    this._context.putAt(childPath, childVal);
                } else {
                    // update existing
                    childCtrl.value = childVal;
                }
                this._childPaths.push(childPath);
                delete oldChildPaths[childPath.toString()];
            }
        }

        for (let p in oldChildPaths) {
            if (oldChildPaths.hasOwnProperty(p)) {
                this._context.removeAt(oldChildPaths[p]);
            }
        }
    }

    _updateArrayValue(val) {

    }

    _getChildPath(childName) {
        if (childName.constructor.name === "String") {
            return `${this._path}['${childName}']`
        } else if (childName.constructor.name === "Number") {
            return `${this._path}[${childName}]`
        } else {
            throw new Error(`Unrecognized type ${childName.constructor.name}`);
        }
    }

    _setArrayValue(arr) {
        this._type = "ARRAY_TYPE";
        for (let i = 0; i < arr.length; i++) {
            let childPath = JsonPath.get(this._path, i);
            this._context.putAt(childPath, arr[i]);
            this._childPaths.push(childPath);
        }
    }

    _buildObject() {
        let obj = {};
        for (let i = 0; i < this._childPaths.length; i++) {
            let path = this._childPaths[i];
            let ctrl = this._context.getAt(path);
            let value = ctrl.value;
            let name = ctrl.name;
            obj[name] = value;
        }

        return obj;
    }

    _buildArray() {
        let arr = [];
        for (let i = 0; i < this._childPaths.length; i++) {
            let path = this._childPaths[i];
            let ctrl = this._context.getAt(path);
            let value = ctrl.value;
            let name = ctrl.name;
            arr[name] = value;
        }

        return arr;
    }

    static _isInstanceAtomic(inst) {
        if (inst == null)
            return true;

        if (inst.constructor.name !== "Object" && inst.constructor.name !== "Array") {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Just the immediate child paths for this controller.
     */
    get childPaths() {
        return this._childPaths;
    }

    /**
     * How many children does this controller have?
     */
    get numChildren() {
        return this._childPaths.length;
    }

    get name() {
        return this._name;
    }

    /**
     * @return {string} path to parent controller.
     */
    get parentPath() {
        return this._parentPath;
    }

    getProperty(key) {
        return this._properties[key];
    }

    setProperty(key, value) {
        this._properties[key] = value;
    }

    static get controllerTypes() {
        return {
            OBJECT_TYPE: "OBJECT_TYPE",
            ARRAY_TYPE: "ARRAY_TYPE",
            VALUE_TYPE: "VALUE_TYPE",
        }
    }

    toString() {
        let str = "InstanceController(";

        str += this._path + ")";
        str += "[" + this._childPaths + "]";

        return str;
    }
}

exports.default = InstanceController;