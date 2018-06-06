// TODO probably get rid of this...
class InternalCommand {
    constructor() {
        this._parentCommand = null
        this._body = null;
    }

    get parentCommand() {
        return this._parentCommand;
    }

    set parentCommand(value) {
        this._parentCommand = value;
    }

    get body() {
        return this._body;
    }

    set body(value) {
        this._body = value;
    }
}

exports.default = InternalCommand;