class InstanceWalker {

    visitValueNode(valueNode, parentNode, accessorNm) {
        // nothing to do here.
    }

    visitArrayNode(arrayNode, parentNode, accessorNm) {
        // visit each child
        for (let i = 0; i < arrayNode.length; i++) {
            let instance = arrayNode[i];
            switch (instance.constructor.name) {
                case "Array":
                    this.visitArrayNode(instance, arrayNode, i);
                    break;
                case "Object":
                    this.visitObjectNode(instance, arrayNode, i);
                    break;
                default:
                    this.visitValueNode(instance, arrayNode, i);
                    break;
            }
        }
    }

    visitObjectNode(objectNode, parentNode, accessorNm) {
        // visit each child
        for (let key in objectNode) {
            if (objectNode.hasOwnProperty(key)) {
                let childNode = objectNode[key];
                // choose between value, array, or object
                switch (childNode.constructor.name) {
                    case "Array":
                        this.visitArrayNode(childNode, objectNode, key);
                        break;
                    case "Object":
                        this.visitObjectNode(childNode, objectNode, key);
                        break;
                    default:
                        this.visitValueNode(childNode, objectNode, key);
                        break;
                }
            }
        }
    }

    visitNode(instance) {
        switch (instance.constructor.name) {
            case "Array":
                this.visitArrayNode(instance);
                break;
            case "Object":
                this.visitObjectNode(instance);
                break;
            default:
                this.visitValueNode(instance);
                break;
        }
    }
}

module.exports = {
    InstanceWalker
};