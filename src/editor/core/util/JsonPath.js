const JsonPathParser = require("./JsonPathParser").JsonPathParser;

class JsonPath {
    constructor() {
        this._accessors = [];

        this.toString = this.toString.bind(this);
    }

    get accessors() {
        return this._accessors;
    }

    static get() {
        // evaluate arguments dynamically...
        let args = Array.from(arguments);
        if (args.length === 1) {
            let arg = args[0];
            if (arg.constructor.name === JsonPath.name) {
                return JsonPath._getFromJsonPath(arg);
            } else if (arg.constructor.name === Array.name) {
                return JsonPath._getFromRawVals(arg);
            } else {
                return JsonPath._getFromRawVal(arg);
            }
        } else {
            let arg0 = args[0];
            if (arg0.constructor.name === JsonPath.name) {
                let adtlArgs = args.slice(1, args.length);
                return JsonPath._getFromJsonPathAndAdditionalVals(arg0, adtlArgs);
            } else {
                return JsonPath._getFromRawVals(args);
            }
        }
    }

    static _getFromRawVal(str) {
        let path = new JsonPath();
        let parser = new JsonPathParser(str);
        path._accessors = parser.getAccessors();
        return path;
    }

    static _getFromRawVals(keys) {
        let path = new JsonPath();
        path._accessors = [...keys];
        return path;
    }

    static _getFromJsonPath(path) {
        let newPath = new JsonPath();
        newPath._accessors.push(...path.accessors);
        return newPath;
    }

    static _getFromJsonPathAndAdditionalVals(path, keys) {
        let newPath = new JsonPath();
        newPath._accessors.push(...path.accessors, ...keys);
        return newPath;
    }

    toString() {
        let str = "$";

        for (let i = 0; i < this._accessors.length; i++) {
            str += "['" + this._accessors[i] + "']";
        }

        return str;
    }
}

exports.JsonPath = JsonPath;