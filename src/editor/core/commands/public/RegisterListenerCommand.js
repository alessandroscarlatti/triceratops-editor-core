const AbstractCommand = require("../AbstractInternalCommand").default;
const IllegalArgumentException = require("../../exceptions/Exceptions").IllegalArgumentException;

class RegisterListenerCommand extends AbstractCommand {

    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);

        this.postProcessCommandData = this.postProcessCommandData.bind(this);
    }

    perform() {
        console.debug("performing UnregisterListenerCommand", this.commandData);
        let component = this.editorContext.listenableComponentRegistry
            .getComponent(this.commandData.body["component"]);

        component.registerListener(
            this.commandData.body["event"],
            this.commandData.body["name"],
            this.commandData.body["callback"]);

        return true;
    }

    postProcessCommandData() {

        if (this.commandData.body.name == null) throw new IllegalArgumentException("Listener name must be provided.");
        if (this.commandData.body.callback == null) throw new IllegalArgumentException("Listener callback must be provided!");

        // TODO fix this spread operator usage with something like shallowClone()?

        // this.commandData.body = {
        //     event: "DEFAULT",
        //     ...this.commandData.body,
        // }
    }

    revert() {
        console.debug("performing revert of UnregisterListenerCommand");
        return true;
    }

    static get commandName() {
        return "REGISTER_LISTENER"
    }

    shouldRemember() {
        return false;
    }
}

exports.default = RegisterListenerCommand;