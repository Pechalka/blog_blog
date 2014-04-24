(function(factory){
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['knockout', 'jquery'], factory);
    } else {
        // Browser globals
        window.AuthService = factory(ko, jQuery);
    }
}(function(ko, $){

// new AuthService('/api/gratify')	
// PUT   /api/gratify/:id
// POST  /api/gratify		-> register
// POST  /api/gratify/login
// GET   /api/gratify/session
// PUT   /api/gratify/session
// POST  /api/gratify/logout

	var $put = function(url, data){

		return $.ajax({
			contentType :  'application/json; charset=UTF-8',
            type: 'PUT',
          	data : JSON.stringify(data),//problem with null in field
            url : url
        }); 
	}

	var AuthService = function(url){
		var self = this;

		var user = ko.observable(null);

		self.update = function(data){
	        var d = $.Deferred();
	    
	        for(var key in data){
	            user()[key] = data[key];
	        }
	        
	        $put(url + '/' + user().id, data)
	            .done(function(){
	                $put(url + '/session' , data, d.resolve);
	            }).fail(d.reject)

	        return d.promise();
		}


		self.current = function(){
			var d = $.Deferred();

    	    d.resolve(user());

	        return d.promise();
		}

		self.login = function(email, password){
	        var d = $.Deferred();
	        var data = {
	            email : email,
	            password : password
	        }

	        $.post(url + '/login', data, function(json){
	            if (json.success){
	                user(json);
	                d.resolve(json);
	            } else {
	                d.reject(json.message)
	            }
	        });

	        return d.promise();
		}

		self.changePassword = function(oldPassword, password, confirm_password){
	        if (user().password != oldPassword){//todo move to server
	            var d = $.Deferred();
	            d.reject('old password does not match');
	            return d;
	        }

	        return self.update({ password : password });
	    }

        self.auth = function(){

	        var dfd = $.Deferred();  
	        var hash = window.location.hash.replace(/^#/, '')
	        //history.getHash();
	        if (hash === "/login") return true;
	        if (!!user()) {
	            return true;
	        } else { 
	            $.get(url + '/session')
	            .done(function(json) {

	                if (json.login === false) dfd.resolve("login");
	                else {
	                    user(json);
	                    dfd.resolve(true);
	                }
	            }).fail(function(){
	            	
	            	dfd.resolve("login");
	            })
	        }

	        return dfd.promise();
	    }

	    self.create = function(data){
	    	var d = $.Deferred();
	    	$.post(url, data)
	    		.done(function(u){
	    			self.login(data.email, data.password)
	    				.done(d.resolve)
	    				.fail(d.reject)
	    		}).fail(d.reject);

    		return d.promise();
	    }

	    self.logout = function(){
	    	user(null);
	        return $.post(url + '/logout');
	    }
	}
	
    return AuthService;

}))
