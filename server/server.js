var express = require('express'),
	app = express(),
	_ = require('underscore'),
	results = [],
	port = process.argv[2] || 3000;
	
app.set("jsonp callback", true);
app.set('view engine', 'jshtml');
app.engine('jshtml', require('jshtml-express'));
app.use('/javascript', express.static(__dirname + '/javascript'));

app.get('/', function(req, res){	
	var id = req.query.id,
	
		formatResultsForGraph = function(theseResults) {
			var mappedresults = 
					_.map(theseResults, function(v, i) {
						return _.reduce(v, function(acc, next) {
							acc[next.name] = next.count;
							return acc;
						}, {index: i});
					}),
				flattened = _.flatten(theseResults),
				observableNames = _.keys(_.groupBy(flattened, 'name'));
					
			return { 
				data: mappedresults,
				labels: _.map(observableNames, function(x) { return { valueField: x, name: x }; }) 
			};
		};
		
	if(id) {
		res.locals({
			data: JSON.stringify(formatResultsForGraph(results[id]))
		});

		res.render('index');
		
	} else {
		res.locals({
			data: _.map(_.keys(results), function(id) {
				return '/?id=' + id;
			})
		});
	
		res.render('links');
	}
});

app.get('/post', function(req, res) {
	var message = req.query.results,
		id = req.query.id;
	
	if(id) {
	
		if(results[id]) {
			results[id].push(message);
		} else {
			results[id] = [ message ];			
		}
		
	} else {
		id = results.length;
		results[id] = [ message ];		
	}
	
	res.send(req.query.callback + '(' + JSON.stringify({ id: id }) + ')');	
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
