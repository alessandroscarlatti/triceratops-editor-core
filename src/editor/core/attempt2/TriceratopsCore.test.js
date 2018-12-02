const assert = require("assert");
const TriceratopsCore = require("./TriceratopsCore").default;

describe("TriceratopsCore", () => {
    it("can add a controller", () => {
        let trc = new TriceratopsCore();

        trc._setRootEmptyObject();
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
    });

    it("can use builder syntax", () => {
        let trc = new TriceratopsCore();

        trc._setRootEmptyObject();
        trc.with("$", $ => {
            $.putValue("name", "Phil", {
                description: "penguin name"
            });
            $.putValue("age", 2, {
                description: "penguin age"
            });
            $.putObject("address", address => {
                address.putValue("street", "123 Sesame")
            })
        });

        assert.deepEqual(trc.getJsInstance(), {
            name: "Phil",
            age: 2,
            address: {
                street: "123 Sesame"
            }
        })
    });

    it("can retrieve metadata", () => {
        let trc = new TriceratopsCore();

        trc.putObject();
        assert.deepEqual(trc.getJsInstance(), {});

        trc.putArray();
        assert.deepEqual(trc.getJsInstance(), []);

        trc.putValue("asdf");
        assert.deepEqual(trc.getJsInstance(), "asdf");

        trc.putObject($ => {
            $.putValue("name", "Phil", {
                description: "penguin name"
            });
            $.putValue("age", 2, {
                description: "penguin age"
            });
            $.putObject("address", address => {
                address.putValue("street", "123 Sesame")
            });
            $.putArray("nicknames");
            $.putValue("stuff")
        });

        trc.with("$[nicknames]", nicknames => {
            nicknames.putNextValue("char");
            nicknames.putNextValue("squash");
        });

        assert.deepEqual(trc.getMeta("$[name]"), {
            description: "penguin name"
        });

        assert.deepEqual(trc.getJsInstance("$[nicknames]"), ["char", "squash"])
    });

    it("can remove node", () => {
        let trc = new TriceratopsCore();

        trc.putObject($ => {
            $.putValue("name", "Phil", {
                description: "penguin name"
            });
            $.putValue("age", 2, {
                description: "penguin age"
            });
            $.putObject("address", address => {
                address.putValue("street", "123 Sesame")
            });
            $.putArray("nicknames", nicknames => {
                nicknames.putNextValue("char", {
                    description: "char desc"
                });
                nicknames.putNextValue("squash", {
                    description: "squash desc"
                });
            });
            $.putValue("stuff");
        });

        assert.equal(2, trc.getJsInstance("$[nicknames]").length);

        trc.removeNodeRecursive("$[address]");
        assert.equal(trc.getJsInstance("$[name]"), "Phil");
        assert.equal(trc.getJsInstance("$[address]"), undefined);

        trc.removeNodeRecursive("$[nicknames][0]");
        assert.equal(trc.getJsInstance("$[nicknames][0]"), "char");
        assert.deepEqual(trc.getMeta("$[nicknames][0]"), {
            description: "char desc"
        });
        assert.equal(trc.getJsInstance("$[nicknames][1]"), undefined);

        trc.removeNodeRecursive("$[nicknames]");
        assert.equal(trc.getJsInstance("$[nicknames]"), undefined);
    });
});