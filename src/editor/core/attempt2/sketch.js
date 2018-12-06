let instance = {
    name: "Phil",
    age: 2,
    friends: [
        "Annie",
        "Charlotte"
    ]
};

let accessorFuncs = {
    $: function () {
        return instance;
    },
    "bcde": function() {
        return instance["name"];
    },
    "cdef": function () {
        return instance["age"];
    },
    "defg": function() {
        return instance["friends"];
    },

    // these are values within an array.
    // they only refer to their parent.
    // IF the parent were an item within an array, and got moved around, it wouldn't matter,
    // because we would still refer to that function whatever it is
    // at the time this function is invoked.
    // and doing it this way, we will never have to rewrite the function
    // even when the parent changes.
    // this could even be maintained in a getParent table
    // this is really a generic function...
    "efgh": function() {
        let i = instances["efgh"].accessor;
        return accessorFuncs[instances["efgh"].parent]()[i]
    },
    "fghi": function() {
        let i = instances["efgh"].accessor;
        return accessorFuncs[instances["fghi"].parent]()[i]
    }
};

let setterFuncs = {
    $: function (val) {
        instance = val;
    },
    "bcde": function(val) {
        instance["name"] = val;
    },
    "cdef": function (val) {
        instance["age"] = val;
    },
    "defg": function(val) {
        instance["friends"] = val;
    },
    "efgh": function(val) {
        let i = instances["efgh"].accessor;
        accessorFuncs.defg()[i] = val
    },
    "fghi": function(val) {
        let i = instances["efgh"].accessor;
        accessorFuncs.defg()[i] = val
    }
};

let deleteFuncs = {
    $: function () {
        instance = undefined;
    },
    "bcde": function() {
        delete instance["name"];
    },
    "cdef": function () {
        delete instance["age"];
    },
    "defg": function() {
        delete instance["friends"];
    },

    // if the parent changes here, we will have to recreate this function.
    // you COULD have a map of getParent functions!
    // then even moving the parent would have no impact.
    "efgh": function() {
        let i = instances["efgh"].accessor;
        accessorFuncs[instances["fghi"].parent]().splice(i);
    },
    "fghi": function() {
        let i = instances["efgh"].accessor;
        accessorFuncs[instances["fghi"].parent]().splice(i);
    }
};

let instances = {
    "$": {
        key: "$",
        accessor: "$",
        parent: null,
        nodeType: "OBJECT_NODE",
        meta: {

            // this metadata can allow the order to remain correct for a gui.
            children: [
                "bcde", "cdef", "defg"
            ]
        },
        children: {
            name: "bcde",
            age: "cdef",
            friends: "defg"
        }
    },
    "bcde": {
        key: "bcde",
        accessor: "name",
        parent: "$",
        nodeType: "VALUE_NODE",
        value: "Phil",
        meta: {
            name: "Name"
        }
    },
    "cdef": {
        key: "cdef",
        accessor: "age",
        parent: "$",
        nodeType: "VALUE_NODE",
        value: 2,
        meta: {
            name: "Age"
        }
    },
    "defg": {
        key: "defg",
        accessor: "friends",
        parent: "$",
        nodeType: "ARRAY_NODE",
        meta: {
            children: [
                "efgh", "fghi"
            ],
            meta: {
                name: "Friends"
            }
        },
        children: [
            "efgh", "fghi"
        ]
    },
    "efgh": {
        key: "efgh",
        accessor: 0,
        parent: "defg",
        nodeType: "VALUE_NODE",
        value: "Annie",
        meta: {
            name: "Friend {number}"
        }
    },
    "fghi": {
        key: "fghi",
        accessor: 1,
        parent: "defg",
        nodeType: "VALUE_NODE",
        value: "Charlotte",
        meta: {
            name: "Friend {number}"
        }
    }
};