const assert = require("assert");
const InstanceWalker = require("./instanceWalker").InstanceWalker;

describe("test instance walker", () => {
   it("can walk the instance", () => {

       class MyWalker extends InstanceWalker {

           visitValueNode(valueNode, parentNode, accessorNm) {
               console.log(`value node "${accessorNm}": ${valueNode}`);
               super.visitValueNode(valueNode, parentNode, accessorNm);
           }

           visitArrayNode(arrayNode, parentNode, accessorNm) {
               console.log(`array node "${accessorNm}": ${arrayNode}`);
               super.visitArrayNode(arrayNode, parentNode, accessorNm);
           }

           visitObjectNode(objectNode, parentNode, accessorNm) {
               console.log(`object node "${accessorNm}": ${objectNode}`);
               super.visitObjectNode(objectNode, parentNode, accessorNm);
           }
       }

       let myWalker = new MyWalker();

       let object = {
               "_id": "5c02e1e7a796ff753d8a632e",
               "index": 0,
               "guid": "43ef09fd-55b4-4e1e-b06d-1e3bda1c9b7a",
               "isActive": false,
               "balance": "$1,423.09",
               "picture": "http://placehold.it/32x32",
               "age": 21,
               "eyeColor": "green",
               "name": {
                   "first": "Lang",
                   "last": "Atkinson"
               },
               "company": "FIBRODYNE",
               "email": "lang.atkinson@fibrodyne.org",
               "phone": "+1 (800) 474-3957",
               "address": "961 Hastings Street, Silkworth, Federated States Of Micronesia, 9869",
               "about": "Voluptate occaecat ipsum voluptate ut et proident sunt nostrud aute pariatur. Nostrud veniam qui est aliquip fugiat non eiusmod. Nostrud quis incididunt veniam consectetur in ea nulla aliqua labore est. Nisi aliqua do occaecat nulla laboris ullamco. Qui aliqua sunt non in pariatur ea ea consectetur ullamco tempor.",
               "registered": "Sunday, December 28, 2014 4:42 PM",
               "latitude": "-29.295151",
               "longitude": "63.043307",
               "tags": [
                   "sunt",
                   "nostrud",
                   "ullamco",
                   "pariatur",
                   "consectetur"
               ],
               "range": [
                   0,
                   1,
                   2,
                   3,
                   4,
                   5,
                   6,
                   7,
                   8,
                   9
               ],
               "friends": [
                   {
                       "id": 0,
                       "name": "Hart Patterson"
                   },
                   {
                       "id": 1,
                       "name": "Bailey Miller"
                   },
                   {
                       "id": 2,
                       "name": "Gladys Caldwell"
                   }
               ],
               "greeting": "Hello, Lang! You have 5 unread messages.",
               "favoriteFruit": "apple"
           };

           myWalker.visitNode(object)
   })
});