/**
 * A ComponentLookupTable keeps track of components that are currently representing certain nodes.
 *
 * The key to the table is a string JSON path.
 * The value is / includes the React component currently representing that node.
 */
class ControllerLookupTable {
    constructor() {
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
     * @param controller the controller to store in the table
     */
    putAt(path, controller) {
        if (this.table[path]) {
            console.warn(`path ${path} already exists in table!`)
        }

        this.table[path] = controller;
    }

    /**
     * Remove anything at the given path.
     * @param path the path to look for
     */
    removeAt(path) {
        this.table[path] = undefined;
    }
}

exports.default = ControllerLookupTable;