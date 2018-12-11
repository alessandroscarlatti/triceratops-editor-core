const assert = require("assert");
const JsonPathParser = require("../src/editor/core/util/JsonPathParser").JsonPathParser;

describe("get parent path util returns parent path", function () {
    describe("valid paths", function() {
        let validScenarios = [
            {
                child: "$",
                parent: null,
                name: "$",
                accessors: [],
            },
            {
                child: "$['author']",
                parent: "$",
                name: "author",
                accessors: ["author"],
            },
            {
                child: "$[0]",
                parent: "$",
                name: "0",
                accessors: ["0"],
            },
            {
                child: "$[0]['firstName']",
                parent: "$[0]",
                name: "firstName",
                accessors: ["0", "firstName"],
            },
            {
                child: "$['author']['firstName']",
                parent: "$['author']",
                name: "firstName",
                accessors: ["author", "firstName"],
            },
            {
                child: "$['authors'][0]",
                parent: "$['authors']",
                name: "0",
                accessors: ["authors", "0"],
            },
            {
                child: "$['authors'][0]['firstName']",
                parent: "$['authors'][0]",
                name: "firstName",
                accessors: ["authors", "0", "firstName"],
            },
            {
                child: "$['authors'][0]['[first]Name']",
                parent: "$['authors'][0]",
                name: "[first]Name",
                accessors: ["authors", "0", "[first]Name"],
            },
            {
                child: "$['authors'][0]['first$Name']",
                parent: "$['authors'][0]",
                name: "first$Name",
                accessors: ["authors", "0", "first$Name"],
            },
            {
                child: "$['author's friends'][0]['first$Name']",
                parent: "$['author's friends'][0]",
                name: "first$Name",
                accessors: ["author's friends", "0", "first$Name"],
            },
        ];

        validScenarios.forEach(function (sc) {
            it(`parent path of ${sc.child} is ${sc.parent}`, function () {
                console.log("child", sc.child);
                console.log("parent", sc.parent);
                console.log("name", sc.name);
                console.log("accessors", sc.accessors);
                assert.deepEqual(new JsonPathParser(sc.child).parseAccessorsArr(), sc.accessors);
            });
        });
    });

    describe("invalid paths", function () {
        let invalidPaths = [
            "a;sldkfj",
            "",
            "$$",
            " $",
            "$['authors'][",
            "$'authors'][",
            "$'authors'['asdf']"
        ];

        invalidPaths.forEach(function(p) {
            it(`throws exception for bad path (${p})`, function() {
                assert.throws(function() { new JsonPathParser(p).parseAccessorsArr() }, Error);
            });
        });
    });
});
