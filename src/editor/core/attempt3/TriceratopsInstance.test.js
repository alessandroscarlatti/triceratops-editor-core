const TriceratopsInstance = require("./TriceratopsInstance").default;
const TriceratopsPath = require("./TriceratopsPath").default;
const assert = require("assert");

describe("TriceratopsInstance", () => {
    it("can create an instance", () => {
        // create an instance
        let trc = new TriceratopsInstance();

        trc.createObjectNodeByPath(TriceratopsPath.fromStr("$"));
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[name]"), "Phil");
        trc.createObjectNodeByPath(TriceratopsPath.fromStr("$[house]"));
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[house][color]"), "red");
        trc.createArrayNodeByPath(TriceratopsPath.fromStr("$[friends]"));
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][0]"), "Charlotte");
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][1]"), "Annie");

        // update a value
        trc.updateValueNodeByPath(TriceratopsPath.fromStr("$[friends][1]"), "Annie2");

        console.log(trc);

        console.assert(trc.getInstanceByPath(TriceratopsPath.fromStr("$[name]")).instance === "Phil");
        assert.equal(Object.keys(trc.getInstanceByPath(TriceratopsPath.fromStr("$[house]")).children).length, 1);
        assert.equal(trc.getInstanceByPath(TriceratopsPath.fromStr("$[house][color]")).instance, "red");
        console.assert(trc.getInstanceByPath(TriceratopsPath.fromStr("$[friends][0]")) != null);
        assert.equal(trc.getInstanceByPath(TriceratopsPath.fromStr("$[friends][0]")).instance, "Charlotte");


        console.assert(trc.getInstanceById("id0") != null);
    });

    it("can update a value", () => {
        let trc = new TriceratopsInstance();

        trc.createObjectNodeByPath(TriceratopsPath.fromStr("$"));
        trc.createArrayNodeByPath(TriceratopsPath.fromStr("$[friends]"));
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][0]"), "Charlotte");
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][1]"), "Annie");

        // update a value
        trc.updateValueNodeByPath(TriceratopsPath.fromStr("$[friends][1]"), "Annie2");

        assert.equal(trc.getInstanceByPath(TriceratopsPath.fromStr("$[friends][1]")).instance, "Annie2");
    });

    it("return newly created node", () => {
        let trc = new TriceratopsInstance();

        let rootNode = trc.createObjectNodeByPath(TriceratopsPath.fromStr("$"));
        let friendsNode = trc.createArrayNodeByPath(TriceratopsPath.fromStr("$[friends]"));
        let friends0Node = trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][0]"), "Charlotte");
        let friends1Node = trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][1]"), "Annie");

        // update a value
        let updatedFriends1Node = trc.updateValueNodeByPath(TriceratopsPath.fromStr("$[friends][1]"), "Annie2");

        assert(rootNode != null);
        assert(friendsNode != null);
        assert(friends0Node != null);
        assert(friends1Node != null);
        assert(updatedFriends1Node.id === friends1Node.id)
    });

    it ("access the js instance", () => {
        let trc = new TriceratopsInstance();

        let rootNode = trc.createObjectNodeByPath(TriceratopsPath.fromStr("$"));
        let friendsNode = trc.createArrayNodeByPath(TriceratopsPath.fromStr("$[friends]"));
        let friends0Node = trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][0]"), "Charlotte");
        let friends1Node = trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][1]"), "Annie");

        let instanceById = trc.getJsInstanceById("$");

        assert.deepEqual(instanceById, {
            friends: [
                "Charlotte", "Annie"
            ]
        });
        assert.deepEqual(trc.jsInstance, instanceById)

        let instanceByPath = trc.getJsInstanceByPath(TriceratopsPath.fromStr("$"));
        assert.deepEqual(instanceByPath, {
            friends: [
                "Charlotte", "Annie"
            ]
        });

        let friendsArray = trc.getJsInstanceByPath(TriceratopsPath.fromStr("$[friends]"));
        assert.deepEqual(friendsArray, ["Charlotte", "Annie"]);
    });

    it("update js instance", () => {
        let trc = new TriceratopsInstance();

        let rootNode = trc.createObjectNodeByPath(TriceratopsPath.fromStr("$"));
        let friendsNode = trc.createArrayNodeByPath(TriceratopsPath.fromStr("$[friends]"));
        let friends0Node = trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][0]"), "Charlotte");
        let friends1Node = trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][1]"), "Annie");

        let updatedFriends1Node = trc.updateValueNodeById(friends1Node.id, "Annie2");

        assert.equal(updatedFriends1Node.instance, "Annie2");
        assert.equal(trc.jsInstance.friends[1], "Annie2");

    });
});