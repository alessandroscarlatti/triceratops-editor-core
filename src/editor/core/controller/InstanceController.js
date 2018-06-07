/**
 * A field controller controls the flow of data into and out of a single field,
 * including mutations to that field.
 */

// TODO working on getting the instance controller filled with methods...

class InstanceController {
    constructor(path, value, context) {
        this.getProperty = this.getProperty.bind(this);
        this.setProperty = this.setProperty.bind(this);

        this._path = path;
        this._context = context;
        this._type = null;
        this._parentPath = null; // TODO work on this...
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
        if (this.type === "VALUE_TYPE") {
            return this._atomicValue;
        }

        throw "have not implemented non-value types yet."
    }

    /**
     * Set the value in this controller.
     * May recursively call related (child) controllers.
     * May change the "type" of this controller.
     * @param value the new value for the field this controlle represents.
     */
    set value(value) {
        if (this.isInstanceAtomic(value)) {
            this._atomicValue = value;
            this._type = "VALUE_TYPE";
        }
    }

    isInstanceAtomic(inst) {
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

    /**
     * @return {string} path to parent controller.
     */
    get parentPath() {

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