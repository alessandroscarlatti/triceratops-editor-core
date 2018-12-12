const TriceratopsPath = require("./TriceratopsPath").default;

/**
 * this probably best accompanies a transition
 * in nomenclature from "instance" describing the triceratops instance.
 * this could be the triceratops instance.
 * the javascript instance would be attached referenced in it.
 * if the object is ever changed, this reference would of course be
 * considered out of date, so it would have to be updated anyway.
 * This means it is not a problem to "store the object piecemeal!"

 * because of references we can actually use the instance
 * on the triceratops instance to update values quickly.

 * though, really, what's the point of keeping a backing instance?
 * how often would I really request the current state of the object?
 * but if I did, I would want it to be readily available, not
 * reconstructed each time.
 * and if it doesn't really come with a terrible performance
 * penalty for updating VALUES, then that might be OK.
 * but the values could have cached functions that utilize the
 * parent instance, which would be necessary, though
 * a dynamic lookup without another stack frame might be
 * just as cheap, if not cheaper.
 */
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

    _getNewInstanceIdForPath(trcPath) {
        if (trcPath.accessors.length === 0) {
            return "$";
        }
        else {
            return this._getNextId();
        }
    }

    getJsInstanceByPath(trcPath) {
        return this.getInstanceByPath(trcPath).instance;
    }

    get jsInstance() {
        return this._jsInstance;
    }

    getJsInstanceById(id) {
        return this._instances[id].instance
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
        return (this.getIdForPath(trcPath) != null);
    }

    getIdForPath(trcPath) {

        if (trcPath.accessors.length === 0) {
            return "$";
        }

        let parentInstance = this._instances.$;

        for (let accessor of trcPath.accessors) {
            let childId = parentInstance.children[accessor];

            if (childId == null) {
                return null;  // path does not exist
            }

            parentInstance = this._instances[childId];
        }

        return parentInstance.id;
    }

    createObjectNodeByPath(trcPath) {

        let id = this._getNewInstanceIdForPath(trcPath);
        let parentId = this._getParentIdOrNull(trcPath);
        let newJsInstance = {};
        this._createChildInstance(parentId, trcPath.name, newJsInstance);

        this._instances[id] = {
            id: id,
            accessor: trcPath.name,
            parent: parentId,
            nodeType: "OBJECT_NODE",
            meta: {},
            children: {},
            instance: newJsInstance
        };

        // update the children map of the parent
        if (parentId != null) {
            this._instances[parentId].children[trcPath.name] = id;
        }

        return this._instances[id];
    }

    createArrayNodeByPath(trcPath) {
        let id = this._getNewInstanceIdForPath(trcPath);
        let parentId = this._getParentIdOrNull(trcPath);
        let newJsInstance = [];
        this._createChildInstance(parentId, trcPath.name, newJsInstance);

        this._instances[id] = {
            id: id,
            accessor: trcPath.name,
            parent: parentId,
            nodeType: "ARRAY_NODE",
            meta: {},
            children: [],
            instance: newJsInstance
        };

        // update the children map of the parent
        if (parentId != null) {
            this._instances[parentId].children[trcPath.name] = id;
        }
        return this._instances[id];
    }

    createValueNodeByPath(trcPath, value) {
        // does path exist?
        if (this.exists(trcPath)) {
            throw new Error("Value node already exists at path " + trcPath);
        } else {
            return this._createValueNodeByPath(trcPath, value);
        }
    }

    updateValueNodeByPath(trcPath, newValue) {
        let id = this.getIdForPath(trcPath);
        return this.updateValueNodeById(id, newValue);
    }

    updateValueNodeById(id, newValue) {
        let valueNode = this._instances[id];
        valueNode.instance = newValue;
        // also update the actual js instance
        let parentId = valueNode.parent;
        let parentJsInstance = this._instances[parentId].instance;
        parentJsInstance[valueNode.accessor] = newValue;

        return this._instances[id];
    }

    _createValueNodeByPath(trcPath, value) {
        // create a new value node
        // create a new id
        let id = this._getNextId();
        let parentId = this._getParentIdOrNull(trcPath);
        let newJsInstance = value;
        this._createChildInstance(parentId, trcPath.name, value);

        this._instances[id] = {
            id: id,
            accessor: trcPath.name,
            parent: parentId,
            nodeType: "VALUE_NODE",
            meta: {},
            instance: newJsInstance
        };

        // update the children map of the parent
        this._instances[parentId].children[trcPath.name] = id;
        return this._instances[id];
    }

    _getParentIdOrNull(trcPath) {
        if (trcPath.accessors.length === 0) {
            return null;
        } else {
            return this.getIdForPath(trcPath.parent);
        }
    }

    _createChildInstance(parentId, childAccessor, childInstance) {
        // create the actual JS instance
        // must first get the parent, then add the field.
        if (parentId == null) {
            // this is the root
            this._jsInstance = childInstance;
        } else {
            // this is not the root
            let parentJsInstance = this._instances[parentId].instance;
            parentJsInstance[childAccessor] = childInstance;
        }
    }
}

exports.default = TriceratopsInstance;