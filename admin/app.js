

var getPost = function(id){
	var d = $.Deferred();

	if (!id) d.resolve({ title : '', content : '', tags : []});
	else {
		$.get('/api/posts/'+id, d.resolve);
	}

	return d.promise();
}

var Edit = function(id){
	var self = this;	
	self.id = ko.observable();
	self.title = ko.observable().extend({ required : true});
	self.content = ko.observable().extend({ required : true});

	self.tags = ko.observableArray([]);

//	self.tagsAsString = ko.ob


	// self.submit = function(){
	// 	return false;
	// }

	var redirect = function(){
		window.location.href = "#/list";	
	}	

	self.submit = function(){

		if (!self.isValid()){
                self.errors.showAllMessages()
                return;
        } 
		
		var tags = $("#tags").val().split(',');		

		var req = {			
			title : self.title(),
			content : self.content(),
			tags : tags
		}

		if(!id){
			$.post('/api/posts', req, redirect);
		}else{
			$.ajax({
				url : '/api/posts/'+id,
				data : req,
				type : 'PUT',
				success : redirect
			})
		}	
	}

	self.attach = function(){
		 var $input = $('#edit input[data-role=tagsinput]');

		getPost(id).done(function(post){
			self.title(post.title);
			self.content(post.content);
			$input.val(post.tags.join(','));
			$input.tagsinput({
				freeInput : false,
		    	typeahead: {
			        source: tags
		        }
			});

			cleanValidation();


		})
	}

	var cleanValidation = function(){
		for(var key in self){		 	
		 	if (ko.isObservable(self[key]) && ('isModified' in self[key])){
		 		self[key].isModified(false);
		 	}
		 }
	}

	self.errors = ko.validation.group(self);

	self.template = 'edit-template';
}

var Tag = function(data){
	var self = this;
	self.title = data.title;
	self.selected = ko.observable(false);

} 


var List = function(){
	var self = this;

	self.template = 'list-template';	

	self.models = ko.observableArray([]);
	self.tags = ko.observableArray([]);
	self.type = ko.observable();

    self.removePost = function(el) {
    	$.ajax({
			url : '/api/posts/'+el._id,			
			type : 'DELETE',
			success : function(){
				self.models.remove(el);
			}
		})       
    }


    self.attach = function(){
		$.get('/api/tags', function(data){
			var tags = data.map(function(el){
				return new Tag(el);
			})
			self.tags(tags);
		});
    }


    var init =  ko.computed(function(){
    	var data = ko.toJS(self.tags);
    	var type = self.type();
    	
    	if (!init) return;
    	    	
    	var params = data.filter(function(el){
    		return el.selected;
    	}).map(function(el){
    		return el.title;
    	})

    	var q = {
    		type : type,
    		titles : params
    	}
    	
    	$.post('/api/posts/findByTag', q, self.models);
    })
}

var Login = function(){
	var self = this;

	self.password = ko.observable();
	self.email = ko.observable();

	self.login = function(){
		user.login(
				self.email(),
				self.password()
			).done(function(){
				app.page(new App);
				window.location.hash = '#/list';
			}).fail(function(error){
				alert(error);
			})
	}

	self.template = 'login-template';
}

var App = function() {
	var self = this;
	self.page_url = ko.observable('list');
	self.content = ko.observable(null);
	
	self.list_click = function(){
		app.page(new List());
	}

	self.edit_click = function(){
		app.page(new Edit());
	}

	self.logout = function(){
		user.logout().done(function(){
			window.location.hash = '#/login';
		})
	}

	self.template = 'app-template';
}

var app = {
	page : ko.observable(new App)
}



var routerCode = function(){
	var hash = window.location.hash.replace(/^#/, '');
	
	if (hash == '/list' || hash == '') {
		app.page().content(new List);
		app.page().page_url('list');

	}
	if (hash == '/new') {
		app.page().content(new Edit(null));
		app.page().page_url('details');
	}
	if (hash.indexOf('/edit')!=-1) {
		app.page().content(new Edit(hash.replace('/edit/', '')))
		app.page().page_url('details');
	}

	if (hash == '/login') {
		app.page(new Login());
	}
	
	if (app.page() && app.page().content() && app.page().content().attach)
		app.page().content().attach()	
}

var procces = function(hash){
	var result = user.auth();
	if (result === true){
		routerCode();
		return;	
	}  

	result
	.done(function(page){
		if (page!== true) window.location.hash = '#/' + page;	
		else routerCode();
	})

}


var tags = [];

var user = new AuthService('/api/user');

$(function(){

	$.when(
		$.get('/api/tags')
	).done(function(result1){
		tags = result1;
		tags = tags.map(function(_){ return _.title; });	

		ko.applyBindings(app);		

		var hashchange = function() {
			procces();

		}
		$(window).on('hashchange', hashchange)
		hashchange();
	})	

	ko.validation.configure({
        insertMessages: false,
        decorateElement : true,
        errorElementClass : 'error'
    });
})