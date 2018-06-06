const AbstractCommand = require("../AbstractInternalCommand").default;
const IllegalArgumentException = require("../../exceptions/Exceptions").IllegalArgumentException;

class UnregisterListenerCommand extends AbstractCommand {

    constructor(editorContext, cmdData) {
        super(editorContext, cmdData);

        this.postProcessCommandData = this.postProcessCommandData.bind(this);
    }

    perform() {
        console.debug("performing UnregisterListenerCommand", this.commandData);
        let component = this.editorContext.listenableComponentRegistry
            .getComponent(this.commandData.body["component"]);

        component.unregisterListener(
            this.commandData.body["event"],
            this.commandData.body["name"]
        );

        return true;
    }

    postProcessCommandData() {

        if (this.commandData.body.name == null) throw new IllegalArgumentException("Listener name must be provided.");


        // TODO use something like shallowClone()?
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
        return "UNREGISTER_LISTENER"
    }

    shouldRemember() {
        return false;
    }
}

exports.default = UnregisterListenerCommand;