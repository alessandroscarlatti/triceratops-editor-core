const assert = require("assert");
const SmartInstance = require("./SmartInstance").default;

describe("smart instance", () => {
    it("can be created and deleted", () => {
        let si = new SmartInstance();
        si.createEmptyObject("$");
        si.createValue("$", "name", "Phil");
        si.createValue("$", "age", 2);
        si.createEmptyArray("$", "friends");
        si.createEmptyObject("$[friends]", "0");
        si.createValue("$[friends][0]", "name", "Charlotte");
        si.createValue("$[friends][0]", "age", 3);

        assert.deepEqual(si.getInstance(), {
            name: "Phil",
            age: 2,
            friends: [
                {
                    name: "Charlotte",
                    age: 3
                }
            ]
        });

        si.deleteRecursive("$[name]");
        si.deleteRecursive("$[friends]");

        assert.deepEqual(si.getInstance(), {
            age: 2
        });

        console.log("json:", JSON.stringify(si.getPathTree(), null, 2));

        si.deleteRecursive();
        console.log("json:", JSON.stringify(si.getPathTree(), null, 2));

    })
});
