//Using express api
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

//Instantiating sequelize ORM
var sequelize = require('sequelize');


//this is where we initialize the sequelize connection using the database, username and if necessary password
var conn = new sequelize('addressbook', 'lsinh');


//Where we setup the Account table within the addressbook database, sequelize will tend to pluralize table 
//names so make sure to redefine it in a different object
var Account= conn.define('Account', {
    email: sequelize.STRING,
    password: sequelize.STRING
    
}, {
    tableName: 'Account'
});


//Where we setup the AddressBook table within the addressbook database
var AddressBook = conn.define('AddressBook', {
    name: sequelize.STRING
}, {
    tableName: 'AddressBook'
});


//linking AddressBook to Account 
Account.hasMany(AddressBook, {foreignKey: 'accountId'});
AddressBook.belongsTo(Account, {foreignKey: 'accountId'});


//Where we setup the Entry table within the addressbook database
//you also need to add createdAd and updatedAt columns for sequelize to run properly

var Entry = conn.define('Entry', {
    addressbookId: sequelize.INTEGER,
    firstName: sequelize.STRING,
    lastName: sequelize.STRING,
    birthday: sequelize.DATE
}, {
    tableName: 'Entry'
});


//joining Entry to AddressBook
AddressBook.hasMany(Entry, {foreignKey: 'addressbookId'});
Entry.belongsTo(AddressBook, {foreignKey: 'addressbookId'});


//Setting up the Address table within addressbook database
var Address = conn.define('Address', {
    type: sequelize.STRING,
    line1: sequelize.STRING,
    line2: sequelize.STRING,
    city: sequelize.STRING,
    state: sequelize.STRING,
    zip: sequelize.STRING,
    country: sequelize.STRING
    
}, {
    tableName: 'Address'
});


// joining Address to Entry
Entry.hasMany(Address, {foreignKey: 'entryId'});
Address.belongsTo(Entry, {foreignKey: 'entryId'});



//Setting up the Phone table within addressbook database
var Phone = conn.define('Phone', {
    type: sequelize.STRING,
    subtype: sequelize.STRING,
    phoneNumber: sequelize.STRING
    
}, {
    tableName: 'Phone'
});

//joining Phone to Entry
Entry.hasMany(Phone, {foreignKey: 'entryId'});
Phone.belongsTo(Entry, {foreignKey: 'entryId'});





///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exercise 1: getting started
//This is our middleware function

app.use(function(req, res, next) {
    req.accountId = 1;
    console.log(req.accountId);
    next();
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exercise 2: listing some addressbooks

// app.get('/addressbook', function(req, res) {
    
//  AddressBook.findAll({
//      where: {
//          accountId: req.accountId
//      }
     
//  }).then(function(result) {
//      result.forEach(function(row) {
//          console.log('name: ' + row.name + ' , id:' + row.id);
//      });
//      res.json(result);
     
     
 
//  }, function(err)
//  {
//      res.status(400).send('Cannot find this addressbook!');
//  });
    
// });


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Exercise 3: listing a specific addressbook

// app.get('/addressbook/:id', function(req,res) {
    
//     var found = AddressBook.findAll({
//      where: {
//          id: req.params.id,
//          accountId: req.accountId
//      },
//      attributes: {
//      exclude: ['createdAt', 'updatedAt']
//      }
        
//     }).then(function(result) {
//     if (result) {console.log(result);
//     res.json(result);
    //   } else {
    //       res.send('error!');
    //   } 
//     });
    
// });


/////////////////////////////////////////////////////////////////////////////////////////////////
// Exercise 4: creating a new addressbook

// app.post('/addressbook', function(req, res) {
//     if (req.body.name) {
//         AddressBook.create({
//         name: req.body.name, 
//         accountId: req.accountId
//       }).then(function(row) {
//       console.log(row);
//       return  AddressBook.findAll({
//             where: {
//                 accountId: req.accountId,
//                 name: req.body.name
//             }
//         })    
//         }).then(function(result) {
//             //console.log(result);
//             res.json(result);
//         })
        
//     }
    
// });


//////////////////////////////////////////////////////////////////////////////////////////////////////////             
//Exercise 5: Deleting an addressbook

// app.delete('/AddressBook/:id', function(req,res) {
//     if (req.accountId) {
// return AddressBook.destroy({ where: {
//     id: req.params.id
    
// }
    
// }).then(function(row) {
//      res.send('Deleted!')
//     console.log('destroyed ' + row);
   
// });

// }
    
// });


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Exercise 6: Modifying an addressbook

// app.put('/addressbook/:id', function(req,res) {
//   //only if addressBook belongs to currently logged in user
//     if (req.accountId) {
//   return     AddressBook.update(
//             {name: req.body.name},
//             {where: {
//                 id: req.params.id }
//         }).then(function(row) {
//             res.send('Updated!');
//             console.log('destroyed ' + row);
//         });
    
        
//     }
    
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Exercise 7: CRUD for Entries
//findAll RETURNS AN ARRAY so IF IT RETURNS NO RESULTS THE ARRAY IS EMPTY..i.e. ROW.LENGTH !== 
//findOne RETURNS AN OBJECT

// app.post('/entries/:addressbookId', function(req,res) {
    
//         AddressBook.findOne({
//         where: {
//             id : req.params.addressbookId,
//             accountId: req.accountId
//         }
            
//         }).then(function(row) {
//             console.log('Fuck you! ' +row);
//      the if statement represents the condition for which the findAll is true
//      if(row) {
//             return Entry.create({
//             firstName: req.body.firstName, 
//             lastName: req.body.lastName, 
//             birthday: req.body.birthday, 
//             addressbookId: req.params.addressbookId
//         }).then(function(row) {
              
//               res.json(row);
//         });
//         }
//             else {
//                 res.send('You do not have access!')
//             }
//         })
 
// });


//ALTERNATIVE way to do exercise 7 using FindAll
// app.post('/entries/:addressbookId', function(req,res) {
    
        // AddressBook.findAll({
        // where: {
        //     id : req.params.addressbookId,
        //     accountId: req.accountId
        // }
            
        // }).then(function(row) {
        //     console.log('Fuck you! ' +row);
            
    //row.length represents the amount of objects within that array        
    //the if statement represents the condition for which the findAll is true
    
//      if(row.length != 0) {return Entry.create({
//             firstName: req.body.firstName, 
//             lastName: req.body.lastName, 
//             birthday: req.body.birthday, 
//             addressbookId: req.params.addressbookId
//         }).then(function(row) {
              
//               res.json(row);
//         });
//         }
//             else {
//                 res.send('You do not have access!')
//             }
//         })
    
// });

        
//for deleting  
  
// app.delete('/entries/:addressbookId', function(req,res) {
//     AddressBook.findOne({
//         where: {
//             id : req.params.addressbookId,
//             accountId: req.accountId
//         }
           
// }).then(function(row) {
//     console.log('Okie Dokes '+ row);
//     if (row) {
//         return Entry.destroy({
//             where: {
//                 addressbookId : req.params.addressbookId
                
//             }
//         }).then(function(row) {
//             res.json('deleted!');
//         });
//     }
//         else {
//              res.send('You do not have access!');
//         }
    
    
// });
// });
 
 
 
//for updating

// app.put('/entries/:addressbookId/:entryid', function(req,res) {
//       AddressBook.findOne({
//         where: {
//             id : req.params.addressbookId,
//             accountId: req.accountId
//         }
           
// }).then(function(row) {
//     if (row) {
//         return Entry.update(
//             {firstName: req.body.firstName},
//             {where: {
//                 id: req.params.entryid
//             }}
//         ).then(function(row) {
//             res.json('updated Entry!');
            
//         });
        
//     }
//     else {
//         res.send('Cannot delete this entry!');
//     }
    
// });
    
// });






////////////////////////////////////////////////////////////////////////////////////////

//Exercise 8: CRUD Endpoints for Addresses

//don't forget to add createdAt and updatedAt columns for Address in mysql
//and use return when trying to output to then function (promise)


//CRUD for Address

// app.get('/address/:addressbookid/:entryid/:addressid', function(req,res) {
//         Address.findOne({
//         include: 
//         [{model: Entry, 
//             where: {id: req.params.entryid},
//             include:
//         [{model: AddressBook,
//             where: {id: req.params.addressbookid},
//             include:
//             [{model: Account,
//                 where: {id: req.accountId}
//             }]
//         }] 
//         }],
//         where: {id: req.params.addressid}}).then(function(row) { 
//         if (row) {
//         console.log(row);
//         res.json(row);
//         }
//         else {
//             res.send('You do not have access to this address');
//         }
//     });
    
// });
    



// app.post('/address/:addressbookId/:entryId', function(req, res) {
//     Entry.findOne(
//     {include: 
//     [{model: AddressBook, 
//     where: {id: req.params.addressbookId}, 
//         include: 
//         [{model: Account, 
//         where: {id: req.accountId}
//         }]
//     }],
//          where: {id: req.params.entryId}
// }).then(function(row) {
//   if (row) {  Address.create({
//           city: req.body.city, 
//           state: req.body.state,
//           country: req.body.country,
//           entryId: req.params.entryId
// } ).then(function(row) {
//      res.json(row);
// }) } else {
//     res.send('Error');
// } 
// });
// });


// app.delete('/address/:addressbookId/:entryId',  function(req, res) {
//       Address.destroy({
//         include: 
//         [{model: Entry, 
//             where: {id: req.params.entryId},
//             include:
//         [{model: AddressBook,
//             where: {id: req.params.addressbookId},
//             include:
//             [{model: Account,
//                 where: {id: req.accountId}
//             }]
//         }] 
//         }],
//         where: {id: req.body.id}}).then(function(row) {
//          if (row) {
//             res.json(row);
//             console.log(row);
//         } else {
//             res.send('Cannot delete this Address');
    
// }}); 
    
// });


// app.put('/address/:addressbookId/:entryId/:addressId', function(req, res) {
//     Address.findOne({
//       include: 
//         [{model: Entry, 
//             where: {id: req.params.entryId},
//             include:
//         [{model: AddressBook,
//             where: {id: req.params.addressbookId},
//             include:
//             [{model: Account,
//                 where: {id: req.accountId}
//             }]
//         }] 
//         }],
//         where: {id: req.params.addressId}}).then(function(row) {
//         if(row) {
//             console.log('fuck you!' + '\n' + row);
//             res.json(row);
            
//           Address.update({
//                 type: req.body.type,
//                 line1: req.body.line1,
//                 city: req.body.city,
//                 country: req.body.country
//             }, {where: {id: req.params.addressId}
                
//             }).then(function(row) {
//                 res.send('Deleted the Entry');
//             });
//         } else {
//             res.send('Cannot Update Address!');
//         }
        
//     });
// });



//CRUD For Phone
// app.get('/phone/:addressbookId/:entryId/:phoneId', function(req,res) {
//         Entry.findOne(
//     {include: 
//     [{model: AddressBook, 
//     where: {id: req.params.addressbookId}, 
//         include: 
//         [{model: Account, 
//         where: {id: req.accountId}
//         }]
//     }],
//          where: {id: req.params.entryId}
// }).then(function(row) { 
//             console.log('No birds do sing!' + '\n');
//         if (row) {
//         console.log(row);
//         res.json(row);
//         }
//         else {
//             res.send('You do not have access to this Phone');
//         }
//     });
    
// });


// app.post('/phone/:addressbookId/:entryId', function(req, res) {
//       Entry.findOne({
//         include: 
//         [{model: AddressBook,
//             where: {id: req.params.addressbookId},
//             include:
//             [{model: Account,
//                 where: {id: req.accountId}
//             }]
//         }] ,
//         where: {id: req.params.entryId}}).then(function(row) {
//             console.log(row);
//   if (row) {  Phone.create({
//           type: req.body.type, 
//           subtype: req.body.subtype,
//           phoneNumber: req.body.phoneNumber
// } ).then(function(row) {
//      res.json(row);
// }) } else {
//     res.send('Error');
// } 
// });
// });


// app.delete('/phone/:addressbookId/:entryId',  function(req, res) {
// //Have to add a Phone.Findone before proceeding to destroy
    
//       Phone.destroy({
//         include: 
//         [{model: Entry, 
//             where: {id: req.params.entryId},
//             include:
//         [{model: AddressBook,
//             where: {id: req.params.addressbookId},
//             include:
//             [{model: Account,
//                 where: {id: req.accountId}
//             }]
//         }] 
//         }],
//         where: {id: req.body.id}}).then(function(row) {
//          if (row) {
//             res.json(row);
//             console.log(row);
//         } else {
//             res.send('Cannot delete this Phone');
    
// }}); 
    
// });


app.put('/phone/:addressbookId/:entryId/:phoneId', function(req, res) {
    Phone.findOne({
      include: 
        [{model: Entry, 
            where: {id: req.params.entryId},
            include:
        [{model: AddressBook,
            where: {id: req.params.addressbookId},
            include:
            [{model: Account,
                where: {id: req.accountId}
            }]
        }] 
        }],
        where: {id: req.params.phoneId}}).then(function(row) {
        if(row) {
            console.log('fuck you!' + '\n' + row);
            res.json(row);
            
          Phone.update({
                type: req.body.type,
                subtype: req.body.subtype,
                phoneNumber: req.body.phoneNumber
            }, {where: {id: req.params.phoneId}
                
            }).then(function(row) {
                res.send('Updated the Entry');
            });
        } else {
            res.send('Cannot Update Address!');
        }
        
    });
});





// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

