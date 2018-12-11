const TriceratopsInstance = require("./TriceratopsInstance").default;
const TriceratopsPath = require("./TriceratopsPath").default;
const assert = require("assert");

describe("TriceratopsInstance", () => {
    it ("can create an instance", () => {
        // create an instance
        let trc = new TriceratopsInstance();

        trc.createObjectNodeByPath(TriceratopsPath.fromStr("$"));
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[name]"), "Phil");
        trc.createObjectNodeByPath(TriceratopsPath.fromStr("$[house]"));
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[house][color]"), "red");
        trc.createArrayNodeByPath(TriceratopsPath.fromStr("$[friends]"));
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][0]"), "Charlotte");
        trc.createValueNodeByPath(TriceratopsPath.fromStr("$[friends][1]"), "Annie");

        console.log(trc);

        console.assert(trc.getInstanceByPath(TriceratopsPath.fromStr("$[name]")).value === "Phil");
        assert.equal(Object.keys(trc.getInstanceByPath(TriceratopsPath.fromStr("$[house]")).children).length, 1);
        assert.equal(trc.getInstanceByPath(TriceratopsPath.fromStr("$[house][color]")).value, "red");
        console.assert(trc.getInstanceByPath(TriceratopsPath.fromStr("$[friends][0]")) != null);
        assert.equal(trc.getInstanceByPath(TriceratopsPath.fromStr("$[friends][0]")).value, "Charlotte")
    });
});