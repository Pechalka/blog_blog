var db = require('../db/mongo');

var readByTitle = function(req, res){
	db.Tags.find({title : req.params.title}, function(err, tag){
		res.json(tag);
	})
}

var findAll = function(req, res){
	db.Tags.find({}, function(err, tags){
		res.json(tags);
	})
}


module.exports = {
	readByTitle : readByTitle,
	findAll : findAll
}