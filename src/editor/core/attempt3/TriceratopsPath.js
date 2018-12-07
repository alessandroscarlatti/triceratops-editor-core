class TriceratopsPath {
    constructor(pathArr) {

        if (pathArr.length === 0) {
            this._pathArr = ["$"];
        } else {
            this._pathArr = pathArr;
        }
    }

    /**
     *
     * @param pathArr
     * @return {TriceratopsPath}
     */
    static getFromArr(...pathArr) {
        return new TriceratopsPath(pathArr);
    }

    static getFromString(pathStr) {

    }

    get parent() {
        if (this._pathArr.length === 1) {
            return null;
        } else {
            let pathArr = this._pathArr.slice(0, this._pathArr.length - 1);
            return new TriceratopsPath(pathArr);
        }
    }

    get name() {
        return this._pathArr[this._pathArr.length - 1];
    }

    asArray() {
        return this._pathArr;
    }
}

exports.default = TriceratopsPath;