class ValueInstance {
}

class ValueInArrayInstance extends ValueInstance {
    constructor(instanceIndex, instanceVal, metaObj) {
        super();
        this.instanceIndex = instanceIndex;
        this.instanceVal = instanceVal;
        this.metaObj = metaObj;
    }

    _addSelfAsJsInstance(workingObj) {
        workingObj[this.instanceIndex] = this.instanceVal;
    }
}

class ValueInObjectInstance extends ValueInstance {
    constructor(instanceNm, instanceVal, metaObj) {
        super();
        this.instanceNm = instanceNm;
        this.instanceVal = instanceVal;
        if (metaObj == null) {
            this.metaObj = {};
        }
        else {
            this.metaObj = metaObj;
        }
    }


    _addSelfAsJsInstance(workingObj) {
        workingObj[this.instanceNm] = this.instanceVal;
    }

    _toJsInstance() {
        return this.instanceVal;
    }
}

class ArrayInstance {
}

class ArrayInArrayInstance extends ArrayInstance {
    constructor(instanceIndex, configFunc) {
        super();
        this.instanceIndex = instanceIndex;
        this.instancesList = [];
        configFunc(this);
    }

    putMeta(metaObj) {
        this.metaObj = metaObj;
    }

    putValue(fieldVal, metaObj) {
        // add a ValueInstance to the internal list
        this.instancesList.push(new ValueInArrayInstance(
            this.instancesList.length,
            fieldVal,
            metaObj
        ))
    }

    putArray(configFunc) {
        this.instancesList.push(new ArrayInArrayInstance(
            this.instancesList.length,
            configFunc
        ));
    }

    _addSelfAsJsInstance(workingJsArray) {

        let selfJsArray = [];
        for (let instance of this.instancesList) {
            instance._addSelfAsJsInstance(selfJsArray)
        }

        workingJsArray[this.instanceIndex] = selfJsArray;
    }
}

class ArrayInObjectInstance extends ArrayInstance{
    constructor(instanceNm, configFunc) {
        super();
        this.instanceNm = instanceNm;
        this.instancesList = [];
        this.metaObj = {};
        configFunc(this);
    }

    putMeta(metaObj) {
        this.metaObj = metaObj;
    }

    putValue(fieldVal, metaObj) {
        // add a ValueInstance to the internal list
        this.instancesList.push(new ValueInArrayInstance(
            this.instancesList.length,
            fieldVal,
            metaObj
        ))
    }

    putArray(configFunc) {
        this.instancesList.push(new ArrayInArrayInstance(
            this.instancesList.length,
            configFunc
        ))
    }

    putObject(configFunc) {
        this.instancesList.push(new ObjectInArrayInstance(
            this.instancesList.length,
            configFunc
        ))
    }

    _addSelfAsJsInstance(workingJsObj) {

        let selfJsArray = [];
        for (let instance of this.instancesList) {
            instance._addSelfAsJsInstance(selfJsArray)
        }

        workingJsObj[this.instanceNm] = selfJsArray;
    }

    _toJsInstance() {
        let self = {};
        this._addSelfAsJsInstance(self);
        return self[this.instanceNm];
    }
}

class ObjectInstance {
}

class ObjectInArrayInstance extends ObjectInstance {

    constructor(instanceIndex, configFunc) {
        super();
        this.instanceIndex = instanceIndex;
        this.childFieldsInstancesMap = {};
        this.metaObj = {};
        configFunc(this);
    }

    putMeta(metaObj) {
        this.metaObj = metaObj;
    }

    putValue(fieldNm, fieldVal, metaObj) {
        this.childFieldsInstancesMap[fieldNm] = new ValueInObjectInstance(
            fieldNm,
            fieldVal,
            metaObj
        )
    }

    putArray(fieldNm, configFunc) {
        this.childFieldsInstancesMap[fieldNm] = new ArrayInObjectInstance(
            fieldNm,
            configFunc
        )
    }

    putObject(fieldNm, configFunc) {
        this.childFieldsInstancesMap[fieldNm] = new ObjectInObjectInstance(
            fieldNm,
            configFunc
        )
    }

    _addSelfAsJsInstance(workingJsObj) {
        let selfJsObject = {};
        for (let childFieldNm in this.childFieldsInstancesMap) {
            if (this.childFieldsInstancesMap.hasOwnProperty(childFieldNm)){
                this.childFieldsInstancesMap[childFieldNm]._addSelfAsJsInstance(selfJsObject)
            }
        }

        workingJsObj[this.instanceIndex] = selfJsObject;
    }
}

class ObjectInObjectInstance extends ObjectInstance {

    constructor(instanceNm, configFunc) {
        super();
        this.instanceNm = instanceNm;
        this.childFieldsInstancesMap = {};
        this.metaObj = {};
        configFunc(this);
    }

    putMeta(metaObj) {
        this.metaObj = metaObj;
    }

    putValue(fieldNm, fieldVal, metaObj) {
        this.childFieldsInstancesMap[fieldNm] = new ValueInObjectInstance(
            fieldNm,
            fieldVal,
            metaObj
        )
    }

    putArray(fieldNm, configFunc) {
        this.childFieldsInstancesMap[fieldNm] = new ArrayInObjectInstance(
            fieldNm,
            configFunc
        )
    }

    putObject(fieldNm, configFunc) {
        this.childFieldsInstancesMap[fieldNm] = new ObjectInObjectInstance(
            fieldNm,
            configFunc
        )
    }

    _addSelfAsJsInstance(workingJsObj) {
        let selfJsObject = {};
        for (let childFieldNm in this.childFieldsInstancesMap) {
            if (this.childFieldsInstancesMap.hasOwnProperty(childFieldNm)){
                this.childFieldsInstancesMap[childFieldNm]._addSelfAsJsInstance(selfJsObject)
            }
        }

        workingJsObj[this.instanceNm] = selfJsObject;
    }

    _toJsInstance() {
        let self = {};
        this._addSelfAsJsInstance(self);
        return self[this.instanceNm];
    }
}

// could be a class that contains a value, array, or object instance.
class JsInstance {
}

class JsValueInstance extends JsInstance {

    constructor(value, metaObj) {
        super();
        this.valueInstance = new ValueInObjectInstance("$", value, metaObj)
    }

    toJsInstance() {
        return this.valueInstance._toJsInstance()
    }
}

class JsObjectInstance extends JsInstance {
    constructor(configFunc) {
        super();
        this.objectInstance = new ObjectInObjectInstance("$", configFunc);
    }

    toJsInstance() {
        return this.objectInstance._toJsInstance()
    }
}

class JsArrayInstance extends JsInstance {
    constructor(configFunc) {
        super();
        this.arrayInstance = new ArrayInObjectInstance("$", configFunc);
    }

    toJsInstance() {
        return this.arrayInstance._toJsInstance()
    }
}

module.exports = {
    JsValueInstance,
    JsArrayInstance,
    JsObjectInstance
};