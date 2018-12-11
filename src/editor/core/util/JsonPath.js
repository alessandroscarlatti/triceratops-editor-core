const JsonPathParser = require("./JsonPathParser").JsonPathParser;

class JsonPath {
    constructor() {
        this._accessors = [];

        this.toString = this.toString.bind(this);
    }

    get name() {
        if (this.accessors.length === 0)
            return "$";

        return this._accessors[this._accessors.length - 1];
    }

    get accessors() {
        return this._accessors;
    }

    get parent() {
        if (this._accessors.length === 0)
            return this;

        return JsonPath.fromArr(this._accessors.slice(0, this._accessors.length - 1));
    }

    resolve(...additionalAccessors) {
        let newPath = JsonPath.fromPath(this);
        for (let accessor of additionalAccessors) {
            newPath._accessors.push(accessor)
        }
        return newPath;
    }

    static fromStr(str) {
        let parser = new JsonPathParser(str);
        return JsonPath.fromArr(parser.parseAccessorsArr());
    }

    /**
     * @return {JsonPath}
     */
    static fromArr(...accessors) {

        if (accessors.length === 1 && accessors[0].constructor.name === "Array") {
            return JsonPath._fromArr(accessors[0]);
        }

        return JsonPath._fromArr(accessors);
    }

    static _fromArr(accessorsArray) {
        let path = new JsonPath();

        for (let accessor of accessorsArray) {
            if (accessor.constructor.name !== "String" && accessor.constructor.name !== "Number") {
                throw new Error("Invalid constructor " + accessor.constructor.name + " for path accessor : " + accessor + ".  Expected 'String' or 'Number'.");
            }
            path._accessors.push(accessor);
        }

        return path;
    }

    static fromPath(otherPath) {
        return this._getFromPath(otherPath);
    }

    static _getFromPath(path) {
        let newPath = new JsonPath();
        newPath._accessors.push(...path.accessors);
        return newPath;
    }

    toString() {
        let str = "$";

        for (let i = 0; i < this._accessors.length; i++) {
            str += "['" + this._accessors[i] + "']";
        }

        return str;
    }

    /**
     * toString() for Node.
     * @param depth
     * @param opts
     */
    inspect(depth, opts) {
        return this.toString();
    }
}

exports.JsonPath = JsonPath;