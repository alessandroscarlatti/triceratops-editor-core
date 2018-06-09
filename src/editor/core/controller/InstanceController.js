/**
 * A field controller controls the flow of data into and out of a single field,
 * including mutations to that field.
 */

const JsonPathParser = require("../util/JsonPathParser").JsonPathParser;

    // TODO working on getting the instance controller filled with methods...

class InstanceController {
    constructor(path, value, context) {
        this.getProperty = this.getProperty.bind(this);
        this.setProperty = this.setProperty.bind(this);
        this._buildObject = this._buildObject.bind(this);
        this._buildArray = this._buildArray.bind(this);
        this._setObjectValue = this._setObjectValue.bind(this);
        this._setArrayValue = this._setArrayValue.bind(this);
        this._getChildPath = this._getChildPath.bind(this);

        let pathParser = new JsonPathParser(path);

        this._path = path;
        this._name = pathParser.getName();
        this._context = context;
        this._type = null;
        this._parentPath = pathParser.getParentPath();
        this._childPaths = [];
        this._atomicValue = undefined;
        this._properties = {};

        this.value = value;
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
     * @param value the new value for the field this controlle represents.
     */
    set value(value) {
        if (this._isInstanceAtomic(value)) {
            this._atomicValue = value;
            this._type = "VALUE_TYPE";
        } else {
            if (value.constructor.name === "Object") {
                this._type = "OBJECT_TYPE";
                this._setObjectValue(value);
            } else if (value.constructor.name === "Array") {
                this._type = "ARRAY_TYPE";
                this._setArrayValue(value);
            } else {
                throw new Error(`Unrecognized instance type '${value.constructor.name}' for instance ${value}`)
            }
        }
    }

    _setObjectValue(obj) {
        for (let p in obj) {
            if (obj.hasOwnProperty(p)) {
                let childPath = this._getChildPath(p);
                this._context.putAt(childPath, obj[p]);
                this._childPaths.push(childPath);
            }
        }
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

    _setArrayValue() {

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

    }

    _isInstanceAtomic(inst) {
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
}

exports.default = InstanceController;