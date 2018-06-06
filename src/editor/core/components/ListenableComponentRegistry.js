class ListenableComponentRegistry {
    constructor(...components) {
        this.components = {};

        if (components != null) {
            for (let i = 0; i < components.length; i++) {
                let component = components[i];
                this.components[component["componentName"]] = component;
            }
        }

        // bindings
        this.addComponent = this.addComponent.bind(this);
        this.getComponent = this.getComponent.bind(this);
    }

    addComponent(component, name) {
        this.components[name] = component;
    }

    getComponent(name) {
        return this.components[name];
    }
}

exports.default = ListenableComponentRegistry;