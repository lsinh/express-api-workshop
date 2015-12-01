var express = require('express');
var bodyParser = require('body-parser');

var db = require('mysql');

var connection = db.createConnection({
    user: 'ziad_saab',
    host: '127.0.0.1',
    database: 'addressbook'
});

var app = express();
app.use(bodyParser.json());

// app.get('...

app.use(function(request, response, next) {
    request.accountId === 1;
    next();
})
