class ExternalCommand {
    constructor() {
        this._issuedTs = null;
        this._body = null;
    }

    get issuedTs() {
        return this._issuedTs;
    }

    set issuedTs(value) {
        this._issuedTs = value;
    }

    get body() {
        return this._body;
    }

    set body(value) {
        this._body = value;
    }
}

exports.default = ExternalCommand;