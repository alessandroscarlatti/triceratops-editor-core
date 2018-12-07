const TriceratopsInstance = require("./TriceratopsInstance").default;

describe("TriceratopsInstance", () => {
    it ("can create an instance", () => {
        // create an instance
        let trc = new TriceratopsInstance();

        trc.createObjectNodeByPath("$");
        trc.createValueNodeByPath(["$", "name"], "Phil");
        trc.createObjectNodeByPath(["$", "house"]);


        console.log(trc);
    });
});