class JsonPath {
    constructor() {
        for (let i = 0; i < arguments.length; i++) {
            let arg = arguments[i];

            // but how do we know if the given string is an already-formatted
            // path, or if it is a actually a raw path piece?

            // we could assume it is a raw piece...

            // only accept string or int
            if (arg.constructor.name === "String") {

            } else if (arg.constructor.name === "Number") {

            } else {
                throw new Error(`Unrecognized type ${arg.constructor.name}`);
            }
        }
    }
}

exports.JsonPath = JsonPath;