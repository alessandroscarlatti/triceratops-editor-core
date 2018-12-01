const assert = require("assert");
const ObjectInObjectInstance = require("./BackingStore").ObjectInObjectInstance;

describe('test backing store', function () {
    describe("create a store", function () {
        let penguin = new ObjectInObjectInstance("penguin", (penguin) => {
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
                shoppingListList.putArray((shoppingList) => {
                    shoppingList.putValue("milk");
                    shoppingList.putValue("eggs");
                });
                shoppingListList.putArray((shoppingList) => {
                    shoppingList.putValue("sausage");
                    shoppingList.putValue("hamburger");
                })
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
                    age: 3
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
            ]
        });
    });
});