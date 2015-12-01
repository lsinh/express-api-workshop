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


//Exercise 1: getting started
app.use(function(req, res, next) {
    req.accountId = 1;
    console.log(req.accountId);
    next();
});




//Exercise 2: listing some addressbooks
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





//Exercise 3: listing a specific addressbook
app.get('/AddressBook/:id', function(req,res) {
    
    connection.query('select * from AddressBook where AddressBook.accountId =' + Number(req.params.id), function(err,rows) {
        rows.forEach(function(addressbook) {
              if (addressbook.accountId !== req.accountId) {
            console.log('Error was detected');
            res.status(400).send('Access Denied');
        }
        else {
            res.json(rows);
        }
            
        })
    
    })
    
})


//Exercise 4: creating a new addressbook
app.post('/AddressBook/', function(req, res) {
    if (req.body.name) {
        connection.query("insert into AddressBook (accountId, name) values (" +  req.accountId + ",'" + req.body.name +"')", function (err,rows){
           
        console.log(rows);
        connection.query('select * from AddressBook where AddressBook.id=' + rows.insertId, function(err, res) {
            console.log(res);
        }

        );
        
        
        
        })
        
    
        res.end();
    }  
    else {
         res.status(400).send('Access Denied');
    }
    
    
  
})




app.listen(process.env.PORT, function(){
    console.log("Skynet!")
});





