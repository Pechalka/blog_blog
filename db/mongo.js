var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Users = new Schema({
	email : { type : String, require : true},
	password : { type : String, require : true}
})

var Tags = new Schema({
	title : { type : String, require: true}
})

var Posts = new Schema({
	title : { type : String, require: true},
	content : { type : String, require: true },
	tags : [String]
})


var db = {};

db.Tags = mongoose.model('Tags', Tags);
db.Posts = mongoose.model('Posts', Posts);
db.Users = mongoose.model('Users', Users);


db.connect = function(cb) {
    var config = require('../config/common.json');
    mongoose.connect(config.mongo_url, cb);
} 

db.disconnect = function(){
    mongoose.disconnect();
}

module.exports = db;