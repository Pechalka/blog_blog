var db = require('../db/mongo');

var renderOne = function(req, res){
	db.Posts.findById(req.params.id, function(err, rows){
		res.render('post', { model : rows });		
	})	
}

var update = function(req, res){
	db.Posts.findByIdAndUpdate(req.params.id, req.body, function(err, result){
		res.send(204);
	})	
}

var remove = function(req, res){
	db.Posts.findByIdAndRemove(req.params.id, function(err){
		res.send(204);
	})
}

var readAll = function(req, res){
	db.Posts.find({},function(err, posts){
		res.json(posts);
	})
}

var ok = function(req, res){
	res.send(204);
}

var readOne = function(req, res){
	db.Posts.findById(req.params.id, function(err, rows){
		res.json(rows);
	})
}

var renderAll = function(req, res){
	db.Posts.find(function(e, rows){
		res.render('posts', { model : rows });
	})
}

var create = function(req, res){
	var post = new db.Posts(req.body);
	console.log(req.body);
	post.save(function(err){
		res.json("ok");
	})
}

var findByTag = function(req, res){
	var type = req.body.type == 'or' ? '$or' : '$and';
	var titles = req.body.titles || [];

	var q = { };	
	if (titles.length > 0){
		var params = [];
		for (var i = titles.length - 1; i >= 0; i--) {
			params.push({'tags' : titles[i]});
		};
		q[type] = params;
	}
	
	db.Posts.find(q, function(err, posts){
		res.json(posts);
	})
}




module.exports = {
	renderOne : renderOne,
	renderAll : renderAll,

	create : create,
	update : update,
	remove : remove,
	readOne : readOne,
	readAll : readAll,
	findByTag : findByTag
}