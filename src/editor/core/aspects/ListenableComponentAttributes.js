const DEFAULT_EVENT_NAME = "DEFAULT";

/**
 * Add listenable attributes to the object
 * bound to this function.
 */
const applyListenableAttributes = function(component, eventName) {

    // use a default action name if none provided.
    if (eventName == null) eventName = DEFAULT_EVENT_NAME;
    if (component.listeners == null) component.listeners = {};

    component.listeners[eventName] = {};  // each listener should have a unique name

    /**
     * All listenable components are to be available internally.
     * Only some might be available externally.
     * This could also be implemented based on the event name...
     * @return {boolean}
     */
    component.isListenerExternal = function (eventName) {
        return false;
    };

    /**
     * "RegisterListener"
     */
    if (component.registerListener == null) {
        component.registerListener = function (eventName, name, callback) {
            component.listeners[eventName][name] = callback;
        }.bind(component);
    }

    /**
     * "UnregisterListener"
     */
    if (component.unregisterListener == null) {
        component.unregisterListener = function (eventName, name) {
            delete component.listeners[eventName][name];
        }.bind(component);
    }

    /**
     * "RaiseEvent"
     */
    if (component.raiseEvent == null) {
        component.raiseEvent = function (eventData, eventName) {
            if (eventName == null) eventName = DEFAULT_EVENT_NAME;
            let listenersMap = component.listeners[eventName];

            for (let listenerName in listenersMap) {
                if (listenersMap.hasOwnProperty(listenerName)) {
                    listenersMap[listenerName](eventData);
                }
            }
        }
    }
};

exports.default = applyListenableAttributes;