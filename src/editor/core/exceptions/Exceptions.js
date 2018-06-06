function RuntimeException(message, cause) {
    this.message = message;
    this.cause = cause;
}

function IllegalArgumentException(message, cause) {
    this.message = message;
    this.cause = cause;
}

function IllegalStateException(message, cause) {
    this.message = message;
    this.cause = cause;
}

module.exports = {
    RuntimeException,
    IllegalArgumentException,
    IllegalStateException
};