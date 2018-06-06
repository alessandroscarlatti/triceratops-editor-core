/**
 * Some events issued may consist of multiple atomic events.
 * The job of the interpreter is to translate certain complex events
 * into an equivalent set of atomic events.
 */
class EventInterpreter {

    invoke(event) {
        // perform logic on event type here...
    }
}

exports.default = EventInterpreter;