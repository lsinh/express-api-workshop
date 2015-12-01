var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

var db = require('mysql');


var connection = db.createConnection({
    user: 'lsinh',
    host: 'localhost',
    database: 'addressbook'
});

connection.connect();



app.get('/hello', function (req, res) {
  res.send('<h1>Hello World! </h1>');
});


//Exercise 1
app.use(function(req, res, next) {
    req.accountId = 1;
    console.log(req.accountId);
    next();
});


//Exercise 2
app.get('/AddressBook', function(req, res) {
    
    connection.query('select * from AddressBook where AddressBook.accountId =' + req.accountId, function(err, rows) {
        if (err) {
            console.log("Error Found");
        }
        else {
            res.json(rows);
        };
    });
});

//Exercise 3


app.listen(process.env.PORT, function(){
    console.log("SKYNET IS ONLINE!")
});

//Exercise 3


