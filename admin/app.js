

var Edit = function(id){
	var self = this;	
	self.id = ko.observable();
	self.title = ko.observable();
	self.content = ko.observable();

	self.tags = ko.observableArray([]);

//	self.tagsAsString = ko.ob


	// self.submit = function(){
	// 	return false;
	// }

	var redirect = function(){
		window.location.href = "#/list";	
	}

	if(id){
		$.get('/api/posts/'+id, function(data){
			self.title(data.title);
			self.content(data.content);
		})
	}

	self.submit = function(){
		
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
		$.get('/api/tags', function(data){
			var tags = data.map(function(el){
				return el.title;
			})
			$('#edit input[data-role=tagsinput]').tagsinput({
				freeInput : false,
		    	typeahead: {
			        source: tags
		        }
			});
		})
	}

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
    	debugger;
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

var app = {
	page_url : ko.observable('list'),
	page : ko.observable(null),
	list_click : function(){
		app.page(new List());
	},
	edit_click : function(){
		app.page(new Edit());
	}
}


var procces = function(hash){
	if (hash == '/list' || hash == '') {
		app.page(new List);
		app.page_url('list');

	}
	if (hash == '/new') {
		app.page(new Edit(null));
		app.page_url('details');
	}
	if (hash.indexOf('/edit')!=-1) {
		app.page(new Edit(hash.replace('/edit/', '')))
		app.page_url('details');
	}
	
	if (app.page() && app.page().attach)
		app.page().attach()
}

$(function(){
	ko.applyBindings(app);
	app.page(new List())

	var hashchange = function() {
		var hash = window.location.hash.replace(/^#/, '');
		procces(hash);

	}
	$(window).on('hashchange', hashchange)
	hashchange();

	
})