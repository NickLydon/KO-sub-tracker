var express = require('express'),
	app = express();

app.set('../views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use('/javascript', express.static(__dirname + '/javascript'));

app.get('/', function(req, res){
  res.render('index.html');
});

app.post('/', function(req, res) {
	var body = '';
	req.on('data', function(c) { body += c; });
	
	req.on('end', function () { console.log(JSON.parse(body)); });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
