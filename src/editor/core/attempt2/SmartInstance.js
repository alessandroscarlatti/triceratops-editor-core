/**
 * Instance that caches accessors and mutators by path name.
 */
const createSimplePath = function (parent, child) {
    return parent + "[" + child + "]";
};

class SmartInstance {
    constructor() {
        this._jsInstance = undefined;
        this._pathTree = {
            path: "$",
            children: {}
        };
        this._pathTreeGetterFuncMap = {
            $: () => {
                return this._pathTree;
            }
        };
        this._getterFuncMap = {
            $: () => {
                return this._jsInstance;
            }
        };

        // really needed?
        this._setterFuncMap = {
            $: (value) => {
                this._jsInstance = value;
            }
        };

        this._deleteFuncMap = {
            // this function can have child paths underneath it
            $: () => {
                // normally, get parent and delete this value,
                // but here, just set the root value to undefined.
                this._setterFuncMap.$(undefined);
            }
        };

        this._deleteFuncMap.$.children = {};
    }

    getInstance(path) {
        if (path == null) {
            path = "$";
        }
        return this._getterFuncMap[path]();
    }

    getPathTree(path) {
        if (path == null) {
            path = "$";
        }
        return this._pathTreeGetterFuncMap[path]();
    }

    createEmptyObject(parentPath, accessorNm) {
        if (parentPath === "$" && accessorNm == null) {
            this._jsInstance = {};
        }
        else {
            this._getterFuncMap[parentPath]()[accessorNm] = {};
            let newPath = createSimplePath(parentPath, accessorNm);
            this._getterFuncMap[newPath] = () => {
                let jsParentInstance = this._getterFuncMap[parentPath]();
                return jsParentInstance[accessorNm]
            };

            this._pathTreeGetterFuncMap[parentPath]().children[accessorNm] = {
                path: newPath,
                children: {}
            };
            this._pathTreeGetterFuncMap[newPath] = () => {
                let parentPathTreeInstance = this._pathTreeGetterFuncMap[parentPath]();
                return parentPathTreeInstance.children[accessorNm];
            };

            this._deleteFuncMap[newPath] = () =>  {
                let jsParentInstance = this._getterFuncMap[parentPath]();
                delete jsParentInstance[accessorNm];
            }
        }
    }


    createEmptyArray(parentPath, accessorNm) {
        if (parentPath === "$" && accessorNm == null) {
            this._jsInstance = [];
        }
        else {
            this._getterFuncMap[parentPath]()[accessorNm] = [];
            let newPath = createSimplePath(parentPath, accessorNm);
            this._getterFuncMap[newPath] = () => {
                let jsParentInstance = this._getterFuncMap[parentPath]();
                return jsParentInstance[accessorNm]
            };

            this._pathTreeGetterFuncMap[parentPath]().children[accessorNm] = {
                path: newPath,
                children: {}
            };
            this._pathTreeGetterFuncMap[newPath] = () => {
                let parentPathTreeInstance = this._pathTreeGetterFuncMap[parentPath]();
                return parentPathTreeInstance.children[accessorNm];
            };
            this._deleteFuncMap[newPath] = () =>  {
                let jsParentInstance = this._getterFuncMap[parentPath]();
                delete jsParentInstance[accessorNm];
            }
        }
    }

    createValue(parentPath, accessorNm, value) {

        if (parentPath === "$" && accessorNm == null) {
            this._jsInstance = value;
        }
        else {
            this._getterFuncMap[parentPath]()[accessorNm] = value;
            let newPath = createSimplePath(parentPath, accessorNm);
            this._getterFuncMap[newPath] = () => {
                let jsParentInstance = this._getterFuncMap[parentPath]();
                return jsParentInstance[accessorNm]
            };

            this._pathTreeGetterFuncMap[parentPath]().children[accessorNm] = {
                path: newPath,
                children: {}
            };
            this._pathTreeGetterFuncMap[newPath] = () => {
                let parentPathTreeInstance = this._pathTreeGetterFuncMap[parentPath]();
                return parentPathTreeInstance.children[accessorNm];
            };
            this._deleteFuncMap[newPath] = () =>  {
                let jsParentInstance = this._getterFuncMap[parentPath]();
                delete jsParentInstance[accessorNm];
            }
        }
    }

    _deleteRecursive(pathTreeNode) {
        // do the delete of any properties on the func

        for (let childPath in pathTreeNode.children) {
            if (pathTreeNode.children.hasOwnProperty(childPath)) {
                let pathTreeNodeChild = pathTreeNode.children[childPath];
                this._deleteRecursive(pathTreeNodeChild);
            }
        }

        // finally run the delete function
        this._deleteFuncMap[pathTreeNode.path]();
    }

    deleteRecursive(path) {
        if (path == null) {
            path = "$";
        }
        // call the getter
        this._deleteRecursive(this.getPathTree(path))
    }
}

exports.default = SmartInstance;