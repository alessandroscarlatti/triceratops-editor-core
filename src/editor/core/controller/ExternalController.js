/**
 * This is the hub through which all events will be invoked.
 * That is, any actor that wants to invoke an event must invoke
 * a method in the event hub.
 */
const ExternalCommand = require("../commands/model/ExternalCommand").default;
const CommandManager = require("../components/CommandManager").default;
const applyListenableAttributes = require("../aspects/ListenableComponentAttributes").default;

class ExternalController {

    constructor(editorContext) {
        applyListenableAttributes(this);
        this.editorContext = editorContext;
        this.editorContext.commandManager = new CommandManager(editorContext);
        this.componentName = "EXTERNAL_CONTROLLER";

        // bindings
        this.invoke = this.invoke.bind(this);
        this.buildExternalCommand = this.buildExternalCommand.bind(this);
    }

    invoke(request) {
        console.log("request received", request);

        console.debug("processing command", request);
        let externalCommand = this.buildExternalCommand(request);
        console.debug("created external command", externalCommand);
        return this.editorContext.commandManager.invokeCommandAndRemember(externalCommand);
    }

    /**
     * Build an external command out of the given request
     * @param request the origin request
     */
    buildExternalCommand(request) {
        let cmd = new ExternalCommand();
        cmd.issuedTs = + new Date();
        cmd.body = request;

        return cmd;
    }
}

exports.default = ExternalController;