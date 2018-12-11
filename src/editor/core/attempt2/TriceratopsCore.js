const JsonPathParser = require("../attempt3/JsonPathParser").JsonPathParser;

/**
 * Utilities
 */
const createSimplePath = function (parent, child) {
    return parent + "[" + child + "]";
};

const copyPropertiesFromTo = function (from, to) {
    for (let key in from) {
        if (from.hasOwnProperty(key)) {
            to[key] = from[key]
        }
    }
};

const instanceType = function (jsInstance) {
    if (Array.isArray(jsInstance)) {
        return "Array";
    }

    if (jsInstance.constructor.name === "Object") {
        return "Object";
    }

    else {
        return "Value";
    }
};

/**
 * Instance to keep track of accessors
 */
class AccessorFuncMap {
    constructor(targetJsInstance) {
        this._accessorFuncMap = {};
        this._targetJsInstance = targetJsInstance;
        this._returnUndefinedFunc = function () {
        };
    }

    createAccessorFunc(parentPath, accessorNm) {
        if (parentPath == null) {
            // this is the root instance
            this._accessorFuncMap["$"] = () => {
                return this._targetJsInstance.getJsInstance();
            }
        }
        else {
            let key = createSimplePath(parentPath, accessorNm);
            this._accessorFuncMap[key] = () => {
                let jsParentInstance = this.getAccessorFunc(parentPath)();
                return jsParentInstance[accessorNm]
            }
        }
    }

    getAccessorFunc(path) {
        if (path == null) {
            // get the root object
            return this.getAccessorFunc("$");
        }
        else {
            // look up the value from the accessorMap
            let accessorFunc = this._accessorFuncMap[path];
            if (accessorFunc == null) {
                return this._returnUndefinedFunc;
            } else {
                return accessorFunc;
            }
        }
    }

    removeAll() {
        this._accessorFuncMap = {};
    }

    removeAccessorFunc(path) {
        delete this._accessorFuncMap[path];
    }
}

/**
 * Instance to keep track of metadata
 */
class MetaDataMap {
    constructor() {
        this._metadataMap = {};
    }

    createMeta(path, configFunc) {
        this._metadataMap[path] = {};

        if (configFunc != null) {
            configFunc(this._metadataMap[path]);
        }
    }

    setMeta(path, metaObj) {
        this._metadataMap[path] = metaObj;
    }

    updateMeta(path, configFunc) {
        let metaObj = this._metadataMap[path];
        configFunc(metaObj);
    }

    getMeta(path) {
        return this._metadataMap[path];
    }

    clearMeta(path) {
        for (let key in this._metadataMap[path]) {
            if (this._metadataMap[path].hasOwnProperty(key)) {
                delete this._metadataMap[key];
            }
        }
    }

    removeAll() {
        this._metadataMap = {};
    }

    removeMeta(path) {
        delete this._metadataMap[path];
    }
}

/**
 * Instance to wrap the target JS instance.
 */
class TargetJsInstance {
    constructor() {
        this._jsInstance = null;
    }

    setJsInstance(jsInstance) {
        this._jsInstance = jsInstance;
    }

    getJsInstance() {
        return this._jsInstance;
    }
}

class PathTree {
    constructor() {
        this._pathTree = null;
    }

    setRootPath(path) {
        this._pathTree = {
            path: path,
            children: []
        };
    }

    getPathTree() {
        return this._pathTree;
    }
}

/**
 * Instance to help build objects.
 * The instance is preloaded with a parent context, so that methods
 * do not need to specify a parent path.
 */
class TriceratopsObjectBuilderHelper {
    constructor(parentPath, trc) {
        this._parentPath = parentPath;
        this._trc = trc;
    }

    putMeta(configFuncOrMetaObj) {
        if (configFuncOrMetaObj.constructor.name === "Function") {
            this._trc.updateMetaData(this._parentPath, configFuncOrMetaObj);
        }
        else {
            this._trc.updateMetaData(this._parentPath, (metaObj) => {
                for (let key in configFuncOrMetaObj) {
                    if (configFuncOrMetaObj.hasOwnProperty(key)) {
                        metaObj[key] = configFuncOrMetaObj[key]
                    }
                }
            })
        }
    }

    putValue(accessorNm, value, metaObjParam) {
        this._trc.createValueNodeByPath(this._parentPath, accessorNm, value);
        let childPath = createSimplePath(this._parentPath, accessorNm);
        this._trc.updateMetaData(childPath, metaObj => {
            copyPropertiesFromTo(metaObjParam, metaObj);
        })
    }

    putArray(accessorNm, configFunc) {
        this._trc.createEmptyArrayNode(this._parentPath, accessorNm);
        let childPath = createSimplePath(this._parentPath, accessorNm);
        let arrayHelper = new TriceratopsArrayBuilderHelper(childPath, this._trc);

        if (configFunc != null) {
            configFunc(arrayHelper);
        }
    }

    putObject(accessorNm, configFunc) {
        this._trc.createEmptyObjectNode(this._parentPath, accessorNm);
        let childPath = createSimplePath(this._parentPath, accessorNm);
        let objectHelper = new TriceratopsObjectBuilderHelper(childPath, this._trc);
        if (configFunc != null) {
            configFunc(objectHelper);
        }
    }
}

/**
 * Instance to help build objects.
 * The instance is preloaded with a parent context, so that methods
 * do not need to specify a parent path.
 */
class TriceratopsArrayBuilderHelper extends TriceratopsObjectBuilderHelper {
    constructor(parentPath, trc) {
        super(parentPath, trc);
    }

    putNextValue(value, metaObj) {
        let i = this._trc.getJsInstance(this._parentPath).length;
        super.putValue(i, value, metaObj);
    }

    putNextArray(configFunc) {
        let i = this._trc.getJsInstance(this._parentPath).length;
        super.putArray(i, value, configFunc);
    }

    putNextObject(configFunc) {
        let i = this._trc.getJsInstance(this._parentPath).length;
        super.putObject(i, value, configFunc);
    }
}

/**
 * This represents Triceratops support for a single JS instance.
 */
class TriceratopsCore {
    constructor() {
        this._metadataMap = new MetaDataMap();
        this._targetJsInstance = new TargetJsInstance();
        this._pathTree = new PathTree();
        this._accessorFuncMap = new AccessorFuncMap(this._targetJsInstance);
    }

    clear() {
        this._accessorFuncMap.removeAll();
        this._metadataMap.removeAll();
        this._targetJsInstance.setJsInstance(null)
    }

    _setRootValue(value) {
        this.clear();
        this._targetJsInstance.setJsInstance(value);
        this._pathTree.
        this._accessorFuncMap.createAccessorFunc();
        this._metadataMap.createMeta("$");
    }

    _setRootEmptyArray() {
        this.clear();
        this._targetJsInstance.setJsInstance([]);
        this._accessorFuncMap.createAccessorFunc();
        this._metadataMap.createMeta("$");
    }

    _setRootEmptyObject() {
        this.clear();
        this._targetJsInstance.setJsInstance({});
        this._accessorFuncMap.createAccessorFunc();
        this._metadataMap.createMeta("$");
    }

    updateMetaData(path, configFunc) {
        this._metadataMap.updateMeta(path, configFunc);
    }

    // for creating a value node in an array, accessorNm should be the index
    createValueNode(parentPath, accessorNm, value) {
        this._accessorFuncMap.createAccessorFunc(parentPath, accessorNm);
        this._accessorFuncMap.getAccessorFunc(parentPath)()[accessorNm] = value;
        this._metadataMap.createMeta(createSimplePath(parentPath, accessorNm));
    }

    // for creating an object node in an array, accessorNm should be the index
    createEmptyObjectNode(parentPath, accessorNm) {
        this._accessorFuncMap.createAccessorFunc(parentPath, accessorNm);
        this._accessorFuncMap.getAccessorFunc(parentPath)()[accessorNm] = {};
        this._metadataMap.createMeta(createSimplePath(parentPath, accessorNm));
    }

    // for creating an array node in an array, accessorNm should be the index
    createEmptyArrayNode(parentPath, accessorNm) {
        this._accessorFuncMap.createAccessorFunc(parentPath, accessorNm);
        this._accessorFuncMap.getAccessorFunc(parentPath)()[accessorNm] = [];
        this._metadataMap.createMeta(createSimplePath(parentPath, accessorNm));
    }

    getJsInstance(path) {
        return this._accessorFuncMap.getAccessorFunc(path)();
    }

    getMeta(path) {
        return this._metadataMap.getMeta(path);
    }

    putValue(value, configFuncOrMetaObj) {
        this._setRootValue(value);

        if (configFuncOrMetaObj == null) {
            return;
        }

        if (configFuncOrMetaObj.constructor.name === "Function") {
            this.updateMetaData("$", configFuncOrMetaObj);
        }
        else {
            this.updateMetaData("$", (metaObj) => {
                copyPropertiesFromTo(configFuncOrMetaObj, metaObj);
            })
        }
    }

    putArray(configFunc) {
        this._setRootEmptyArray();
        let builderHelper = new TriceratopsArrayBuilderHelper("$", this);

        if (configFunc != null) {
            configFunc(builderHelper);
        }
    }

    putObject(configFunc) {
        this._setRootEmptyObject();
        let builderHelper = new TriceratopsObjectBuilderHelper("$", this);

        if (configFunc != null) {
            configFunc(builderHelper);
        }
    }

    with(path, configFunc) {
        let jsInstance = this.getJsInstance(path);
        let builderHelper;
        if (Array.isArray(jsInstance)) {
            builderHelper = new TriceratopsArrayBuilderHelper(path, this);
        }
        else {
            builderHelper = new TriceratopsObjectBuilderHelper(path, this);
        }

        configFunc(builderHelper);
    }

    _removeInstanceFromParentObject(path) {
        this._accessorFuncMap.removeAccessorFunc(path);
        this._metadataMap.removeMeta(path);

        let parser = new JsonPathParser(path);

        let parentPath = parser._getParentPath();
        let parentNode = this.getJsInstance(parentPath);
        delete parentNode[parser._getName()]
    }

    _removeInstanceFromParentArray(path) {
        // clean up any orphan accessors from the accessorFuncs map.
        // this will always be the last accessor.
        let parser = new JsonPathParser(path);
        let parentPath = parser._getParentPath();
        let parentJsInstance = this.getJsInstance(parentPath);
        let arrSize = parentJsInstance.length;
        let lastElementPath = createSimplePath(parentPath, arrSize - 1);
        this._accessorFuncMap.removeAccessorFunc(lastElementPath);

        // now reorg the metadata map
        // find the range of indexes that need to be shifted left.
        let elementToDeleteIndex = Number(parser._getName());
        for (let i = elementToDeleteIndex + 1; i < arrSize; i++) {
            let leftMetaPath = createSimplePath(parentPath, i);
            let rightMetaPath = createSimplePath(parentPath, i + 1);
            this._metadataMap.clearMeta(leftMetaPath);
            let rightMeta = this._metadataMap.getMeta(rightMetaPath);
            this._metadataMap.setMeta(leftMetaPath, rightMeta);
        }
        this._metadataMap.removeMeta(lastElementPath);

        // fix the actual array
        let newArr = this.getJsInstance(parentPath).filter((element, index) => {
            return index === elementToDeleteIndex;
        });

        // replace the array parent of array (this will not work with a root list)
        let parentParser = new JsonPathParser(parentPath);
        let parentOfArray = this.getJsInstance(parentParser._getParentPath());
        parentOfArray[parentParser._getName()] = newArr;
    }

    removeNodeRecursive(path) {
        let jsParentInstance = this.getJsInstance(new JsonPathParser(path)._getParentPath());

        switch (instanceType(jsParentInstance)) {
            case "Array":
                this._removeNodeRecursiveInArray(path);
                break;
            case "Object":
                this._removeNodeRecursiveInObject(path);
                break;
            default:
                throw new Error("not supporting root case yet.");
        }
    }

    _removeNodeRecursiveInArray(path) {
        let jsInstance = this.getJsInstance(path);
        switch (instanceType(jsInstance)) {
            case "Value":
                this._removeInstanceFromParentArray(path);
                break;
            case "Array":
                // delete each child first
                for (let i in jsInstance) {
                    if (jsInstance.hasOwnProperty(i)) {
                        this.removeNodeRecursive(createSimplePath(path, i));
                    }
                }
                this._removeInstanceFromParentArray(path);
                break;
            case "Object":
                for (let i in jsInstance) {
                    if (jsInstance.hasOwnProperty(i)) {
                        this.removeNodeRecursive(createSimplePath(path, i));
                    }
                }
                this._removeInstanceFromParentArray(path);
                break;
        }
    }

    _removeNodeRecursiveInObject(path) {
        let jsInstance = this.getJsInstance(path);
        switch (instanceType(jsInstance)) {
            case "Value":
                this._removeInstanceFromParentObject(path);
                break;
            case "Array":
                // delete each child first
                for (let i = 0; i < jsInstance.length; i++) {
                    this.removeNodeRecursive(createSimplePath(path, i));
                }

                this._removeInstanceFromParentObject(path);
                break;
            case "Object":
                for (let i in jsInstance) {
                    if (jsInstance.hasOwnProperty(i)) {
                        this.removeNodeRecursive(createSimplePath(path, i));
                    }
                }

                this._removeInstanceFromParentObject(path);
                break;
        }
    }

    /**
     * {path, meta, children}
     */
    getTree(path) {
        if (path == null) {
            path = "$";
        }

        // use visitors
        let jsInstance = this.getJsInstance(path);


    }
}

exports.default = TriceratopsCore;