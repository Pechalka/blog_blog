var connection = require('../db/connection');
var write = connection.write;
var read = connection.read;

var renderOne = function(req, res){
	read.query('SELECT * FROM posts WHERE id=? ', [req.params.id], function(err, rows){
		res.render('post', { model : rows[0] });		
	})
	
}

var update = function(req, res){
	write.query('UPDATE posts SET ?  WHERE id = ' + req.params.id , req.body, function(){
		res.json('ok');
	})
}

var remove = function(req, res){
	write.query('DELETE FROM posts WHERE id = ' + req.params.id, function(){
		res.json('ok');
	})
}

var readAll = function(req, res){
	read.query('SELECT * FROM posts', function(err, rows){
		res.json(rows);
	})
}

var ok = function(req, res){
	res.json('ok');
}

var readOne = function(req, res){
	console.log(req.params.id);
	read.query('SELECT * FROM posts WHERE id=? ', [req.params.id], function(err, rows){
		console.log(rows);
		res.json(rows[0]);		
	})
}

var renderAll = function(req, res){
	read.query('select * from posts', function(e, rows){
		res.render('posts', { model : rows });
	})
}

var create = function(req, res){
	write.query('INSERT INTO posts SET ?', req.body, function(){
		res.json('ok');
	});
}




module.exports = {
	renderOne : renderOne,
	renderAll : renderAll,

	create : create,
	update : update,
	remove : remove,
	readOne : readOne,
	readAll : readAll,
}