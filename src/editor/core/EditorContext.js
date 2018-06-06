const ExternalController = require("./controller/ExternalController").default;
const HistoryManager = require("./components/HistoryManager").default;
const CommandFactory = require("./components/InternalCommandFactory").default;
const GetUndoStackCommand = require("./commands/public/GetUndoStackCommand").default;
const GetRedoStackCommand = require("./commands/public/GetRedoStackCommand").default;
const UndoCommand = require("./commands/public/UndoCommand").default;
const CreateFieldCommand = require("./commands/public/CreateFieldCommand").default;
const IsUndoAvailableCommand = require("./commands/public/IsUndoAvailableCommand").default;
const IsRedoAvailableCommand = require("./commands/public/IsRedoAvailableCommand").default;
const RedoCommand = require("./commands/public/RedoCommand").default;
const InternalController = require("./controller/InternalController").default;
const GetStructureCommand = require("./commands/public/GetStructureCommand").default;
const ListenableComponentRegistry = require("./components/ListenableComponentRegistry").default;
const RegisterListenerCommand = require("./commands/public/RegisterListenerCommand").default;
const UnregisterListenerCommand = require("./commands/public/UnregisterListenerCommand").default;
const ControllerLookupTable = require("./ControllerLookupTable").default;

class EditorContext {
    constructor() {

        // bindings
        this.buildCommandsList = this.buildCommandsList.bind(this);

        this._editorController = new ExternalController(this);
        this._internalController = new InternalController(this);
        this._historyManager = new HistoryManager(this);
        this._commandFactory = new CommandFactory(this.buildCommandsList());
        this._controllerLookupTable = new ControllerLookupTable();

        this._listenableComponentRegistry = new ListenableComponentRegistry(
            this._editorController,
            this._internalController,
            this._historyManager,
        );
    }

    buildCommandsList() {
        return [
            GetUndoStackCommand,
            GetRedoStackCommand,
            UndoCommand,
            RedoCommand,
            CreateFieldCommand,
            IsUndoAvailableCommand,
            IsRedoAvailableCommand,
            GetStructureCommand,
            RegisterListenerCommand,
            UnregisterListenerCommand,
        ]
    }

    get editorController() {
        return this._editorController;
    }

    get internalController() {
        return this._internalController;
    }

    get historyManager() {
        return this._historyManager;
    }

    get commandFactory() {
        return this._commandFactory;
    }

    get listenableComponentRegistry() {
        return this._listenableComponentRegistry;
    }

    get controllerLookupTable() {
        return this._controllerLookupTable;
    }
}

exports.default = EditorContext;