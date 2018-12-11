const TriceratopsPath = require("./TriceratopsPath").default;

class TriceratopsInstance {
    constructor() {
        this._jsInstance = null;
        this._instances = {};
        this._instanceIdCounter = -1;
    }

    _getNextId() {
        this._instanceIdCounter++;
        return "id" + this._instanceIdCounter;
    }

    getInstanceByPath(trcPath) {

        let parentInstance = this._instances.$;

        for (let accessor of trcPath.accessors) {
            let childId = parentInstance.children[accessor];
            parentInstance = this._instances[childId];
        }

        return parentInstance;
    }

    getInstanceById(id) {
        return this._instances[id];
    }

    exists(trcPath) {
        let parentInstance = this._instances.$;

        for (let accessor of trcPath.accessors) {
            let childId = parentInstance.children[accessor];
            if (childId == null) {
                return false;
            }
            parentInstance = this._instances[childId];
        }

        return true;
    }

    getIdForPath(trcPath) {

        if (trcPath.accessors.length === 0) {
            return "$";
        }

        let parentInstance = this._instances.$;

        for (let accessor of trcPath.accessors) {
            let childId = parentInstance.children[accessor];

            if (childId == null) {
                throw new Error("Path does not exist: " + trcPath)
            }

            parentInstance = this._instances[childId];
        }

        return parentInstance.id;
    }

    createObjectNodeByPath(trcPath) {

        let id;
        if (trcPath.accessors.length === 0) {
            id = "$";
        }
        else {
            id = this._getNextId();
        }

        let parentId;
        if (trcPath.accessors.length === 0) {
            parentId = "$";
        } else {
            parentId = this.getIdForPath(trcPath.parent);
        }

        this._instances[id] = {
            id: id,
            accessor: trcPath.name,
            parent: parentId,
            nodeType: "OBJECT_NODE",
            meta: {},
            children: {}
        };

        // update the children map of the parent
        this._instances[parentId].children[trcPath.name] = id;
    }

    createArrayNodeByPath(trcPath) {
        let id;
        if (trcPath.accessors.length === 0) {
            id = "$";
        }
        else {
            id = this._getNextId();
        }

        let parentId;
        if (trcPath.accessors.length === 0) {
            parentId = "$";
        } else {
            parentId = this.getIdForPath(trcPath.parent);
        }

        this._instances[id] = {
            id: id,
            accessor: trcPath.name,
            parent: parentId,
            nodeType: "ARRAY_NODE",
            meta: {},
            children: []
        };

        // update the children map of the parent
        this._instances[parentId].children[trcPath.name] = id;
    }

    createValueNodeByPath(trcPath, value) {
        // does path exist?
        if (this.exists(trcPath)) {
            this._updateValueNodeByPath(trcPath, value);
        } else {
            this._createValueNodeByPath(trcPath, value);
        }
    }

    _updateValueNodeByPath(trcPath, value) {
        // update the value

        let id = this.getIdForPath(trcPath);
        this._instances[id].value = value;
    }

    _createValueNodeByPath(trcPath, value) {
        // create a new value node
        // create a new id
        let id = this._getNextId();
        let parentId = this.getIdForPath(trcPath.parent);

        this._instances[id] = {
            id: id,
            accessor: trcPath.name,
            parent: parentId,
            nodeType: "VALUE_NODE",
            value: value,
            meta: {},
        };

        // update the children map of the parent
        this._instances[parentId].children[trcPath.name] = id;
    }
}

exports.default = TriceratopsInstance;