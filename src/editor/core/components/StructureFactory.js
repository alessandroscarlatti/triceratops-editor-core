/**
 * Build the structure represented by the key/value pairs in the path map.
 * key: jsonPath
 * value: {
 *   value: object
 *   setter: function (generated earlier)
 * }
 * @param pathMap the path map being evaluated
 */
function buildStructure(pathMap) {
    for (let i = 0; i < pathMap.length; i++) {
        let path = pathMap[i];

    }
}

function buildStructureFromSetters(setters) {
    for (let i = 0; i < setters.length; i++) {
        let setter = setters[i];
        setter.set(setter.value);
    }
}