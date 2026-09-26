import storege from "./storege.js";

let users = new storege();
users.collection("users");
let result = users.limit(3).get();  
console.log(result);