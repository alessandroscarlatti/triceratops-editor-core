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

    clear() {
        this._accessorFuncMap = {};
    }
}

/**
 * Instance to keep track of metadata
 */
class MetaDataMap {
    constructor() {
        this._metadataMap = {};
    }

    create(path, configFunc) {
        this._metadataMap[path] = {};

        if (configFunc != null) {
            configFunc(this._metadataMap[path]);
        }
    }

    update(path, configFunc) {
        let metaObj = this._metadataMap[path];
        configFunc(metaObj);
    }

    get(path) {
        return this._metadataMap[path];
    }

    clear() {
        this._metadataMap = {};
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
        this._trc.createValueNode(this._parentPath, accessorNm, value);
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
        this._accessorFuncMap = new AccessorFuncMap(this._targetJsInstance);
    }

    clear() {
        this._accessorFuncMap.clear();
        this._metadataMap.clear();
    }

    _setRootValue(value) {
        this.clear();
        this._targetJsInstance.setJsInstance(value);
        this._accessorFuncMap.createAccessorFunc();
        this._metadataMap.create("$");
    }

    _setRootEmptyArray() {
        this.clear();
        this._targetJsInstance.setJsInstance([]);
        this._accessorFuncMap.createAccessorFunc();
        this._metadataMap.create("$");
    }

    _setRootEmptyObject() {
        this.clear();
        this._targetJsInstance.setJsInstance({});
        this._accessorFuncMap.createAccessorFunc();
        this._metadataMap.create("$");
    }

    updateMetaData(path, configFunc) {
        this._metadataMap.update(path, configFunc);
    }

    // for creating a value node in an array, accessorNm should be the index
    createValueNode(parentPath, accessorNm, value) {
        this._accessorFuncMap.createAccessorFunc(parentPath, accessorNm);
        this._accessorFuncMap.getAccessorFunc(parentPath)()[accessorNm] = value;
        this._metadataMap.create(createSimplePath(parentPath, accessorNm));
    }

    // for creating an object node in an array, accessorNm should be the index
    createEmptyObjectNode(parentPath, accessorNm) {
        this._accessorFuncMap.createAccessorFunc(parentPath, accessorNm);
        this._accessorFuncMap.getAccessorFunc(parentPath)()[accessorNm] = {};
        this._metadataMap.create(createSimplePath(parentPath, accessorNm));
    }

    // for creating an array node in an array, accessorNm should be the index
    createEmptyArrayNode(parentPath, accessorNm) {
        this._accessorFuncMap.createAccessorFunc(parentPath, accessorNm);
        this._accessorFuncMap.getAccessorFunc(parentPath)()[accessorNm] = [];
        this._metadataMap.create(createSimplePath(parentPath, accessorNm));
    }

    getJsInstance(path) {
        return this._accessorFuncMap.getAccessorFunc(path)();
    }

    getMeta(path) {
        return this._metadataMap.get(path);
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
        if (jsInstance.constructor.name === "Array") {
            builderHelper = new TriceratopsArrayBuilderHelper(path, this);
        }
        else {
            builderHelper = new TriceratopsObjectBuilderHelper(path, this);
        }

        configFunc(builderHelper);
    }
}

exports.default = TriceratopsCore;