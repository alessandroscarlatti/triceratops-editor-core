const Path = require("./TriceratopsPath").default;

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

    exists(pathArr) {
        let parentInstance = this._instances.$;

        for (let accessor of pathArr.slice(1, pathArr.length)) {
            let childId = parentInstance.children[accessor];
            if (childId == null) {
                return false;
            }
            parentInstance = this._instances[childId];
        }

        return true;
    }

    getIdForPath(pathArr) {

        if (pathArr.length === 1) {
            return "$";
        }

        let parentInstance = this._instances.$;

        for (let accessor of pathArr) {
            let childId = parentInstance.children[accessor];
            parentInstance = this._instances[childId];
        }

        return parentInstance.id;
    }

    createObjectNodeByPath(pathArr) {

        let id;
        if (pathArr.length === 1) {
            id = "$";
        }
        else {
            id = this._getNextId();
        }

        let path = Path.getFromArr(pathArr);

        let parentId;
        if (pathArr.length === 1) {
            parentId = "$";
        } else {
            parentId = this.getIdForPath(path.parent.asArray());
        }

        this._instances[id] = {
            id: id,
            accessor: path.name,
            parent: parentId,
            nodeType: "OBJECT_NODE",
            meta: {},
            children: {}
        };
    }

    createArrayNodeByPath(pathArr) {
        let id = this._getNextId();
        let path = Path.getFromArr(pathArr);
        let parentId = this.getIdForPath(path.parent.asArray());

        this._instances[id] = {
            id: id,
            accessor: path.name,
            parent: parentId,
            nodeType: "ARRAY_NODE",
            meta: {},
            children: []
        };
    }

    createValueNodeByPath(pathArr, value) {
        // does path exist?
        if (this.exists(pathArr)) {
            this._updateValueNodeByPath(pathArr, value);
        } else {
            this._createValueNodeByPath(pathArr, value);
        }
    }

    _updateValueNodeByPath(pathArr, value) {
        // update the value

        let id = this.getIdForPath(pathArr);
        this._instances[id].value = value;
    }

    _createValueNodeByPath(pathArr, value) {
        // create a new value node
        // create a new id
        let id = this._getNextId();
        let path = Path.getFromArr(...pathArr);
        let parentId = this.getIdForPath(path.parent.asArray());

        this._instances[id] = {
            id: id,
            accessor: path.name,
            parent: parentId,
            nodeType: "VALUE_NODE",
            value: value,
            meta: {},
        };
    }
}

exports.default = TriceratopsInstance;