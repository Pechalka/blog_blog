var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var db = require('./db/mongo');
db.connect();

var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views' });
app.engine('.html', ectRenderer.render);
app.set('view engine', 'html');

app.use(express.favicon());
app.use(express.bodyParser());
app.use('/admin', express.static(path.join(__dirname, 'admin')));


app.use(app.router);




var posts = require('./routes/posts');
var tags = require('./routes/tags');

app.get('/', posts.renderAll)
app.get('/posts', posts.renderAll)
app.get('/post/:id', posts.renderOne)

app.get('/api/posts', posts.readAll);
app.post('/api/posts', posts.create);
app.get('/api/posts/:id', posts.readOne);
app.put('/api/posts/:id', posts.update);
app.delete('/api/posts/:id', posts.remove);

app.post('/api/posts/findByTag', posts.findByTag);

app.get('/api/tags/:title', tags.readByTitle);

app.get('/api/tags', tags.findAll);

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});