var db = require('../db/mongo')

var login = function(req, res){
	db.Users.find({ email : req.body.email, password : req.body.password }, function(err, rows){
		if(rows.length == 1){
			req.session.user = rows[0];
        	req.session.save();

			res.json({
				success : true
			})
		}else{
			res.json({
				success : false,
				message : 'Incorrect data'
			})
		}
	})
}

var session = function(req, res){
	var login = req.session && req.session.user != null;
    if (!login){
        res.json({ login : false })
    } else {
        var user = req.session.user;
        user.login = true;  
             
        res.json(user);
    }
}

var logout = function(req, res){
	req.session.user = null;
	res.send(204);
}

module.exports = {
	login : login,
	session : session,
	logout : logout
}