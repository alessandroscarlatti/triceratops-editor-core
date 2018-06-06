class EditorCommand {
    constructor() {
        this._id = null;
        this._externalCommand = null;
        this._internalCommand = null;
        this._remember = null;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get externalCommand() {
        return this._externalCommand;
    }

    set externalCommand(value) {
        this._externalCommand = value;
    }

    get internalCommand() {
        return this._internalCommand;
    }

    set internalCommand(value) {
        this._internalCommand = value;
    }


    get remember() {
        return this._remember;
    }

    set remember(value) {
        this._remember = value;
    }
}

exports.default = EditorCommand;