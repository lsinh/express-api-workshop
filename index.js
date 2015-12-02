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

//we set the logged in account as 1 in perpetuity, so it never changes in subsequent exercises


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
app.post('/AddressBook', function(req, res) {
    if (req.body.name) {
        connection.query("insert into AddressBook (accountId, name) values (" +  req.accountId + ",'" + req.body.name +"')", function (err,rows){
           
        console.log(rows);
        connection.query('select * from AddressBook where AddressBook.id=' + rows.insertId, function(err, res) {
            console.log(res);
            res.json(res);
        }

        );
        
        
        
        });
        
    
        res.end();
    }  
    else {
         res.status(400).send('Access Denied');
    }
    });

//in API client, you must type in just the name in json object form, in which everything is a string not the accountId, which
//is automatically passed in


//Exercise 5: Deleting an addressBook
app.delete('/AddressBook/:id', function(req,res) {
    if (req.accountId) {
    connection.query('delete from AddressBook where id=' + Number(req.params.id), function(err,rows) {
        console.log(rows);
        res.send('Addressbook is clear!');
    })
    
    }
    else {
        res.status(400).send('Cannot delete this Account');
    }
});

//in the API client, you must type in URL ... /addressBook/<number> and check the delete checkbox and it 
//will delete that number which corresponds to AddressBook.id



//Exercise 6: Modifying an addressbook
app.put('/AddressBook/:id', function(req,res) {
   //only if addressBook belongs to currently logged in user
    if (req.accountId) {
        connection.query('update AddressBook set name ="' + req.body.name + '" ' +' where id=' + req.params.id, function(err, rows) {
            // var name = req.body.name;
            console.log(rows);
        })
    
    }
    else{
            res.status(400).send('Cannot modify this Account');
    }
    res.end();
})


//in the API client, you must type in URL ... /addressBook/<number> and check the put checkbox and it 
//will modify that number which corresponds to AddressBook.id





//Exercise 7: Copy/Pasta
app.post('/entry/:addressbookId', function(req, res) {
    if (req.body.firstName && req.body.lastName && req.body.birthday) {
        connection.query("select * from AddressBook where AddressBook.id =" + req.params.addressbookId, function(err,rows) {
           if(err) {
               res.status(400).send('Cannot find ID');
           } 
            if (rows) {
                connection.query("insert into Entry (addressbookId, firstName, lastName, birthday) values (" + req.params.addressbookId + ", '" + req.body.firstName +  "', '" + req.body.lastName +  "', '" + req.body.birthday + "')", 
        function(err, rows) {
            if (err) {
                res.status(400).send('Cannot Find ID');
            }
            if (rows) {
            console.log(rows);
            }
        });
            }
            
        });
        
     }
        
        res.end();
    
});

// app.delete('/entry/:addressbookId', function(req, res) {

//         connection.query("select Entry.id, Entry.firstName, Entry.lastName, Entry.birthday from Entry join AddressBook on AddressBook.id = Entry.addressbookId join Account on Account.id = AddressBook.accountId where AddressBook.id =" + req.params.addressBookId + " and Account.id = " + req.accountId + " and Entry.id =" + req.params.id, function(err,rows) {
//           if(err) {
//               res.status(400).send('Cannot find ID');
//           } 
//             if (rows) {
//                 connection.query("delete from Entry where addressbookId= " + req.params.addressbookId + "and id= " + req.body.entryId, 
//         function(err, rows) {
//             if (err) {
//                 res.status(400).send('Cannot Find ID');
//             }
//             if (rows) {
//             console.log(rows);
//             }
//         });
//             }
            
//         });
        
        
//         res.end();
    
// });

app.delete('/entry/:addressBookId/:id', function(req, res) {
    connection.query("select Entry.id, Entry.firstName, Entry.lastName, Entry.birthday from Entry join AddressBook on AddressBook.id = Entry.addressbookId join Account on Account.id = AddressBook.accountId where AddressBook.id =" + req.params.addressBookId + " and Account.id = " + req.accountId + " and Entry.id =" + req.params.id, function(err, rows) {
        console.log(rows);
        if (rows) {
            if (err) {
                res.status(404).send("No match found");
            }
            else {
                connection.query("DELETE from Entry where Entry.id=" + req.params.id + " and Entry.addressbookId=" + req.params.addressBookId, function(err, rows) {
                    if(err){
                        res.status(404).send();
                    } else {
                        res.send("Entry deleted!");
                    }
                });
            }
        } else{
            res.status(404).send("No match found");
        }
    });
    res.end();
});

app.put('/entry/:addressBookId/:id', function(req, res) {
     connection.query("select Entry.id, Entry.firstName, Entry.lastName, Entry.birthday from Entry join AddressBook on AddressBook.id = Entry.addressbookId join Account on Account.id = AddressBook.accountId where AddressBook.id =" + req.params.addressBookId + " and Account.id = " + req.accountId + " and Entry.id =" + req.params.id, function(err, rows) {
         if (err) {
             res.status(404).send("Access denied");
         }
         
         if (rows) {
             connection.query("update Entry set name ="' + req.body.firstName + '" ' +' where id=' + req.params.id)
         }
         
         res.end();
     })
}




//req.body is the JSON objects specified in the API client form, if they are defined we run the instructions following the if
//statement







// app.listen(process.env.PORT, function(){
//     console.log("Skynet!");
// });






// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

