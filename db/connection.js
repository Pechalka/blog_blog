var mysql      = require('mysql');
var config = require('../config/mysql.json'); 

var read = mysql.createConnection(config.read);
read.connect();

var write = mysql.createConnection(config.write);
write.connect();

read.on('error', function(e) {
    console.log(e);
    connection.end();
});

module.exports = {
    read : read,
    write : write
};