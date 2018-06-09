class JsonPathParser {

    constructor(path) {
        this._stripParentCrumb = this._stripParentCrumb.bind(this);
        this._stripNextObjectOrArrayAccessor = this._stripNextObjectOrArrayAccessor.bind(this);
        this._stripNextObjectAccessor = this._stripNextObjectAccessor.bind(this);
        this._stripNextArrayAccessor = this._stripNextArrayAccessor.bind(this);
        this._stripNextObjectOrArrayAccessor = this._stripNextObjectOrArrayAccessor.bind(this);
        this.getParentPath = this.getParentPath.bind(this);
        this._buildParentPathString = this._buildParentPathString.bind(this);
        this._parse = this._parse.bind(this);

        this._path = path;
        this._bc = [];

        this._parse();
    }

    _parse() {
        let workingPath = this._path;
        workingPath = this._stripParentCrumb(workingPath);

        if (workingPath.length === 0)
            return;

        if (workingPath.length < 2)
            throw new Error(`Invalid path at ${workingPath} for path ${this._path}`);

        for (; ;) {
            workingPath = this._stripNextObjectOrArrayAccessor(workingPath);

            if (workingPath.length === 0)
                break;

            if (workingPath.length < 2)
                throw new Error(`Invalid path at ${workingPath} for path ${this._path}`);
        }
    }

    getParentPath() {
        return this._buildParentPathString();
    }

    getName() {
        // remove brackets
        if (this._bc.length === 1)
            return "$";

        let rawName = this._bc[this._bc.length - 1];
        let piece = rawName.substring(0, 2);
        if (piece === "['") {
            return rawName.substring(2, rawName.length - 2);
        } else if (piece.startsWith("[")) {
            return rawName.substring(1, rawName.length - 1);
        } else {
            throw new Error(`Invalid path name at ${rawName} for path ${this._path}`);
        }
    }

    _buildParentPathString() {
        if (this._bc.length === 1)
            return null;

        let parent = "";

        for (let i = 0; i < this._bc.length - 1; i++) {
            parent += String(this._bc[i]);
        }

        return parent;
    }

    /**
     * Strip the parent crumb off the path
     */
    _stripParentCrumb(workingPath) {
        if (!this._path.startsWith("$"))
            throw new Error(`bad path ${workingPath}`);

        this._bc[0] = "$";

        if (workingPath.length > 1)
            return workingPath.substring(1, workingPath.length);

        return "";
    }

    _stripNextObjectAccessor(workingPath) {
        let i = workingPath.indexOf("']");

        if (i === -1)
            throw new Error(`Invalid path at ${workingPath} for path ${this._path}`);

        this._bc.push(workingPath.substring(0, i + 2));
        return workingPath.substring(i + 2, workingPath.length);
    }

    _stripNextArrayAccessor(workingPath) {
        let i = workingPath.indexOf("]");

        if (i === -1)
            throw new Error(`Invalid path at ${workingPath} for path ${this._path}`);

        this._bc.push(workingPath.substring(0, i + 1));
        return workingPath.substring(i + 1, workingPath.length);
    }

    _stripNextObjectOrArrayAccessor(workingPath) {

        let crumblet = workingPath.substring(0, 2);

        if (crumblet === "['") {
            // this is an object accessor
            return this._stripNextObjectAccessor(workingPath);
        } else if (crumblet.startsWith("[")) {
            return this._stripNextArrayAccessor(workingPath);
        } else {
            throw new Error(`Invalid accessor beginning with ${crumblet} at ${workingPath} in path ${this._path}`)
        }
    }


    // somehow, we have to split the path into pieces...

    // I guess we're looking for ']['
    // or... ][  or d][d or '][d or d][' or just ] or '] or $

    // we must begin with "$"
    // so that's easy.  That's piece number one.
    // because we're building an array of breadcrumbs.

    // then, we look for the next piece.  That will be the next opening bracket.
    // if the opening bracket is [d then we look for the next closing d].
    // if the opening bracket is [' then we look for the next closing ']

    // if the data is bad, that's the editor's fault!!
}

exports.JsonPathParser = JsonPathParser;