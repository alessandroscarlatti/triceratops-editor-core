const assert = require("assert");
const JsObjectInstance = require("./smartJsInstance").JsObjectInstance;
const JsArrayInstance = require("./smartJsInstance").JsArrayInstance;
const JsValueInstance = require("./smartJsInstance").JsValueInstance;

describe('test backing store', function () {
    it("create an object instance", function () {

        let penguin = new JsObjectInstance(penguin => {
            penguin.putMeta({
                description: "The coolest kid you know X 10!"
            });
            penguin.putValue("name", "Phillip", {
                description: "This penguin's name"
            });
            penguin.putValue("age", 2, {
                description: "This penguin's age"
            });
            penguin.putArray("nicknames", (nicknames) => {
                nicknames.putMeta({
                    description: "The penguin's nicknames"
                });
                nicknames.putValue("Phil");
                nicknames.putValue("Phillie");
            });
            penguin.putArray("friends", (friends) => {
                friends.putMeta({
                    description: "The penguin's friends"
                });
                friends.putObject((friend) => {
                    friend.putMeta({
                        description: "Friend #1"
                    });
                    friend.putValue("name", "Charlotte");
                    friend.putValue("age", 3);
                    friend.putObject("address", address => {
                        address.putValue("street", "123 Main Street")
                    });
                    friend.putArray("nicknames", nicknames => {
                        nicknames.putValue("Charlotte Squash")
                    })
                });
                friends.putObject((friend) => {
                    friend.putMeta({
                        description: "Friend #2"
                    });
                    friend.putValue("name", "Annie");
                    friend.putValue("age", 4);
                })
            });
            penguin.putArray("shoppingLists", (shoppingListList) => {
                shoppingListList.putMeta({
                    description: "A list of shopping lists"
                });
                shoppingListList.putArray((shoppingList) => {
                    shoppingList.putMeta({
                       description: "Shopping list #1"
                    });
                    shoppingList.putValue("milk");
                    shoppingList.putValue("eggs");
                });
                shoppingListList.putArray((shoppingList) => {
                    shoppingList.putMeta({
                        description: "Shopping list #2"
                    });
                    shoppingList.putValue("sausage");
                    shoppingList.putValue("hamburger");
                })
            });
            penguin.putArray("level1List", (level1List) => {
                level1List.putArray((level2List) => {
                    level2List.putArray((level3Array => {
                        level3Array.putValue("value at level 3!")
                    }))
                })
            });
            penguin.putObject("address", (address) => {
                address.putValue("street", "123 Sesame Street");
            })
        });

        console.log(penguin);
        let jsPenguin = penguin.toJsInstance();
        console.log(jsPenguin);

        assert(jsPenguin != null);
        assert.deepEqual(jsPenguin, {
            name: "Phillip",
            age: 2,
            nicknames: [
                "Phil",
                "Phillie"
            ],
            friends: [
                {
                    name: "Charlotte",
                    age: 3,
                    address: {
                        street: "123 Main Street"
                    },
                    nicknames: [
                        "Charlotte Squash"
                    ]
                },
                {
                    name: "Annie",
                    age: 4
                }
            ],
            shoppingLists: [
                [
                    "milk",
                    "eggs"
                ],
                [
                    "sausage",
                    "hamburger"
                ]
            ],
            address: {
                street: "123 Sesame Street"
            },
            level1List: [
                [
                    ["value at level 3!"]
                ]
            ]
        });
    });

    it("create an array instance", () => {
        let penguins = new JsArrayInstance((penguins) => {
            penguins.putValue("Charlotte");
            penguins.putValue("Phil");
        });

        let jsPenguins = penguins.toJsInstance();
        assert.deepEqual(jsPenguins, [
            "Charlotte",
            "Phil"
        ])
    });

    it("create a value instance", () => {
        let penguinName = new JsValueInstance("Phil");
        let jsPenguinName = penguinName.toJsInstance();

        assert.equal(jsPenguinName, "Phil")
    })
});