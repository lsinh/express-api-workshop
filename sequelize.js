var bcrypt = require('bcrypt-nodejs');

// synchronous:
var hash = bcrypt.hashSync("bacon");
 
console.log(bcrypt.compareSync("bacon", hash)); // true
bcrypt.compareSync("veggies", hash); // false

var hash = bcrypt.hashSync("bacon");

console.log(hash);

// asynchronous
bcrypt.hash("bacon", null, null, function(err, hash) {
    console.log(hash);
});

var pass = bcrypt.genSaltSync(10);

//using it with hashsync
var crypt = bcrypt.hashSync('yoyo', pass, null);

console.log(crypt);