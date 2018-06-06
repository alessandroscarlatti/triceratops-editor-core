import ExternalController from "./controller/ExternalController";
import HistoryManager from "./components/HistoryManager";
import CommandFactory from "./components/InternalCommandFactory";
import GetUndoStackCommand from "./commands/public/GetUndoStackCommand";
import GetRedoStackCommand from "./commands/public/GetRedoStackCommand";
import UndoCommand from "./commands/public/UndoCommand";
import CreateFieldCommand from "./commands/public/CreateFieldCommand";
import IsUndoAvailableCommand from "./commands/public/IsUndoAvailableCommand";
import IsRedoAvailableCommand from "./commands/public/IsRedoAvailableCommand";
import RedoCommand from "./commands/public/RedoCommand";
import InternalController from "./controller/InternalController";
import GetStructureCommand from "./commands/public/GetStructureCommand";
import ListenableComponentRegistry from "./components/ListenableComponentRegistry";
import RegisterListenerCommand from "./commands/public/RegisterListenerCommand";
import UnregisterListenerCommand from "./commands/public/UnregisterListenerCommand";
import ControllerLookupTable from "./ControllerLookupTable";

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