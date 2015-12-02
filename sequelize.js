//require sequelize library
var sequelize = require('sequelize');


//create connection with sequelize with database
var conn = new sequelize('addressbook', 'lsinh');

//describe fields in Account
//sequelize will assume there is a createdAt and modifiedAT and ID field
//sequelize also assumes everything is pluralized so make sure to spell out table_name

var Account= conn.define('Account', {
    email: sequelize.STRING,
    password: sequelize.STRING
    
}, {
    tableName: 'Account'
});



//let's make some basic queries

//find account by its ID
//There is still a callback passed after .then

// Account.findById(1).then(function(result) {
//     console.log('I found that account, the email is: ' +result.email);
// });

//you can also JSON stirngify it to just get relevant results but can't you use these results


//


var AddressBook = conn.define('AddressBook', {
    name: sequelize.STRING
}, {
    tableName: 'AddressBook'
})

// AddressBook.findById(1).then(function(result) {
//     console.log(result);
// })

//you can add createdAT --> alter table AddressBook add colume createdAt DATETIME;

// Account.find({
//     where: {
//         email: {like: 'john' },
//     }
// }).then(function(result) {
//     console.log(result);
// })


Account.hasMany(AddressBook, {foreignKey: 'accountId'});


// Account.find({
//     include: [AddressBook]
    
// }).then(function(result) {
//     console.log(result);
// }).catch(function(err) {
//     console.log(err);
// });



//you can add updatedAt


var Entry = conn.define('Entry', {
    firstName: sequelize.STRING,
    lastName: sequelize.STRING,
    birthday: sequelize.DATE
},{
    tableName: 'Entry'})

Account.find({
    include: [{
        model: AddressBook,
        include: [Entry]
    }]
}).then(function(result) {
    console.log(result);
})




