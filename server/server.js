var express = require('express'),
	app = express(),
	_ = require('underscore'),
	results = [ 
		[
			[{
				name: 'observable1',
				count: 5
			},
			{
				name: 'observable2',
				count: 5
			}],
			[{
				name: 'observable1',
				count: 6
			},
			{
				name: 'observable2',
				count: 5
			}],
			[{
				name: 'observable1',
				count: 9
			},
			{
				name: 'observable2',
				count: 5
			}],
			[{
				name: 'observable1',
				count: 11
			},
			{
				name: 'observable2',
				count: 5
			}],
			[{
				name: 'observable1',
				count: 15
			},
			{
				name: 'observable2',
				count: 5
			}],
			[{
				name: 'observable1',
				count: 30
			},
			{
				name: 'observable2',
				count: 5
			}]
		]
	],
	port = process.argv[2] || 3000;
	
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

app.post('/', function(req, res) {
	var body = '';
	req.on('data', function(c) { body += c; });
	
	req.on('end', function () { 
		var message = JSON.parse(body),
			id = message.id;
		
		if(message.id) {
		
			if(results[message.id]) {
				results[message.id].push(message.results);
			} else {
				results[message.id] = [ message.results ];			
			}
			
		} else {
			id = results.length;
			results[id] = [ message.results ];		
		}
		
		res.end(JSON.stringify({ id: id }));
	});
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
