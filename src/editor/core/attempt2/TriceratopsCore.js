/**
 * Instance to keep track of accessors
 */
class AccessorFuncMap {
    constructor(targetJsInstance) {
        this._accessorFuncMap = {};
        this._targetJsInstance = targetJsInstance;
        this._returnUndefinedFunc = function(){};
    }

    createAccessorFunc(parentPath, accessorNm) {
        if (parentPath == null) {
            // this is the root instance
            this._accessorFuncMap["$"] = () => {
                return this._targetJsInstance.getJsInstance();
            }
        }
        else {
            let key = parentPath + "[" + accessorNm + "]";
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
 * Instance to help build data.
 * The instance is preloaded with a parent context, so that methods
 * do not need to specify a parent path.
 */
class TriceratopsInstanceBuilderHelper {
    constructor(parentPath, trc) {
        this._parentPath = parentPath;
        this._trc = trc;
    }

    updateMeta(configFunc) {
        this._trc.updateMetaData(this._parentPath, configFunc);
    }

    putValue(accessorNm, value, metaObjParam) {
        this._trc.createValueNode(this._parentPath, accessorNm, value);
        this._trc.updateMetaData(this._parentPath + "[" + accessorNm + "]", metaObj => {
            for(let key in metaObjParam){
                if (metaObjParam.hasOwnProperty(key)) {
                    metaObj[key] = metaObjParam[key]
                }
            }
        })
    }

    putArray(accessorNm, configFunc) {
        this._trc.createEmptyArrayNode(this._parentPath, accessorNm);
        let arrayHelper = new TriceratopsInstanceBuilderHelper(this._parentPath + "[" + accessorNm + "]", this._trc);
        configFunc(arrayHelper);
    }

    putObject(accessorNm, configFunc) {
        this._trc.createEmptyObjectNode(this._parentPath, accessorNm);
        let objectHelper = new TriceratopsInstanceBuilderHelper(this._parentPath + "[" + accessorNm + "]", this._trc);
        configFunc(objectHelper);
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

    setRootValue(value) {
        this.clear();
        this._targetJsInstance.setJsInstance(value);
        this._accessorFuncMap.createAccessorFunc();
        this._metadataMap.create("$");
    }

    setRootEmptyArray() {
        this.clear();
        this._targetJsInstance.setJsInstance([]);
        this._accessorFuncMap.createAccessorFunc();
        this._metadataMap.create("$");
    }

    setRootEmptyObject() {
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
        this._metadataMap.create(parentPath + "[" + accessorNm + "]");
    }

    // for creating an object node in an array, accessorNm should be the index
    createEmptyObjectNode(parentPath, accessorNm) {
        this._accessorFuncMap.createAccessorFunc(parentPath, accessorNm);
        this._accessorFuncMap.getAccessorFunc(parentPath)()[accessorNm] = {};
        this._metadataMap.create(parentPath + "[" + accessorNm + "]");
    }

    // for creating an array node in an array, accessorNm should be the index
    createEmptyArrayNode(parentPath, accessorNm) {
        this._accessorFuncMap.createAccessorFunc(parentPath, accessorNm);
        this._accessorFuncMap.getAccessorFunc(parentPath)()[accessorNm] = [];
        this._metadataMap.create(parentPath + "[" + accessorNm + "]");
    }

    getJsInstance(path) {
        return this._accessorFuncMap.getAccessorFunc(path)();
    }

    // todo create entry point function for builder helper.
}

exports.default = TriceratopsCore;