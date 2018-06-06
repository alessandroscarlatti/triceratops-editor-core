const RuntimeException = require("../exceptions/Exceptions").RuntimeException;

class InternalCommandFactory {
    constructor(commandsList) {
        // add all command classes needed here
        this.commands = commandsList;

        // bindings
        this.newCommand = this.newCommand.bind(this);
        this.findCommandClass = this.findCommandClass.bind(this);
    }

    newCommand({commandName, editorContext, commandData}) {
        let Clazz = this.findCommandClass(commandData);
        return new Clazz(editorContext, commandData);
    }

    findCommandClass(commandData) {
        for (let i = 0; i < this.commands.length; i++) {
            let clazz = this.commands[i];
            if (clazz.handles(commandData.body.command)) {
                return clazz;
            }
        }

        throw new RuntimeException(`No Command Class found for ${commandData.body.command}`);
    }
}

exports.default = InternalCommandFactory;