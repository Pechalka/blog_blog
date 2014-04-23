var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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


db.connect = function(cb) {
    var config = require('../config/common.json');
    mongoose.connect(config.mongo_url, cb);
} 

db.disconnect = function(){
    mongoose.disconnect();
}

module.exports = db;