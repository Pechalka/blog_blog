

var Edit = function(id){
	var self = this;	
	self.id = ko.observable();
	self.title = ko.observable();
	self.content = ko.observable();

	var clean = function(){
		self.title('');
		self.content('')	
	}

	if(id){
		$.get('/api/posts/'+id, function(data){
			self.title(data.title);
			self.content(data.content);
		})
	}

	self.save = function(){
		var req = {			
			title : self.title(),
			content : self.content()
		}

		if(!id){
			$.post('/api/posts', req, clean);
		}else{
			$.ajax({
			url : '/api/posts/'+id,
			data : req,
			type : 'PUT',
			success : function(){
				alert('success');
			}
		})

		}
	}

	self.template = 'edit-template';
}

var List = function(){
	var self = this;

	self.template = 'list-template';	

	self.models = ko.observableArray([]);

	$.get('/api/posts', function(data){
		ko.utils.arrayPushAll(self.models, data);		
	})

    self.removePost = function() {
    	self.models.remove(this);
    	$.ajax({
			url : '/api/posts/'+this.id,			
			type : 'DELETE',
			success : function(){
				
			}
		})       
    }

    self.editPost = function(){
    	app.page(new Edit(this.id));
    }
}

var app = {
	page : ko.observable(null),
	list_click : function(){
		app.page(new List());
	},
	edit_click : function(){
		app.page(new Edit());
	}
}


$(function(){
	ko.applyBindings(app);
	app.page(new List())
})