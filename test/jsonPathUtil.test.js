const assert = require("assert");
const JsonPathParser = require("../src/editor/core/util/JsonPathParser").JsonPathParser;

describe("get parent path util returns parent path", function () {

    describe("valid paths", function() {
        let validScenarios = [
            {
                child: "$",
                parent: null,
            },
            {
                child: "$['author']",
                parent: "$",
            },
            {
                child: "$[0]",
                parent: "$",
            },
            {
                child: "$[0]['firstName']",
                parent: "$[0]",
            },
            {
                child: "$['author']['firstName']",
                parent: "$['author']",
            },
            {
                child: "$['authors'][0]",
                parent: "$['authors']",
            },
            {
                child: "$['authors'][0]['firstName']",
                parent: "$['authors'][0]",
            },
            {
                child: "$['authors'][0]['[first]Name']",
                parent: "$['authors'][0]",
            },
            {
                child: "$['authors'][0]['first$Name']",
                parent: "$['authors'][0]",
            },
            {
                child: "$['author's friends'][0]['first$Name']",
                parent: "$['author's friends'][0]",
            },
        ];

        validScenarios.forEach(function (sc) {
            it(`parent path of ${sc.child} is ${sc.parent}`, function () {
                console.log("child", sc.child);
                console.log("parent", sc.parent);
                assert.equal(new JsonPathParser(sc.child).getParentPath(), sc.parent);
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
            "$'authors']["
        ];

        invalidPaths.forEach(function(p) {
            it(`throws exception for bad path (${p})`, function() {
                assert.throws(function() { new JsonPathParser(p).getParentPath() }, Error);
            });
        });
    });
});
