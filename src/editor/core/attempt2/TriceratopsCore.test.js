const assert = require("assert");
const TriceratopsCore = require("./TriceratopsCore").default;

describe("TriceratopsCore", () => {
    it("can add a controller", () => {
        let trc = new TriceratopsCore();

        trc.setRootEmptyObject();
        trc.createValueNode("$", "name", "Charlotte");
        trc.updateMetaData("$[name]", meta => {
            meta.description = "the penguin's name";
        });

        trc.createEmptyObjectNode("$", "address");
        trc.createValueNode("$[address]", "street", "123 Sesame");
        trc.createEmptyArrayNode("$", "nicknames");
        trc.createValueNode("$[nicknames]", 0, "char");
        trc.createValueNode("$[nicknames]", 1, "squash");

        console.log(trc);
        assert.equal(trc.getJsInstance("asdf"), undefined);
        assert.equal(trc.getJsInstance("$[name]"), "Charlotte");
        assert.deepEqual(trc.getJsInstance(), {
            name: "Charlotte",
            address: {
                street: "123 Sesame"
            },
            nicknames: [
                "char", "squash"
            ]
        });
    })
});