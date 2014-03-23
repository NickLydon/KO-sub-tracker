var express = require('express'),
	app = express(),
	_ = require('underscore'),
	results = [
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
	],
	port = process.argv[2] || 3000;
	
app.set('view engine', 'jshtml');
app.engine('jshtml', require('jshtml-express'));
app.use('/javascript', express.static(__dirname + '/javascript'));

app.get('/', function(req, res){	
	var mappedresults = 
		_.map(results, function(v, i) {
			return _.reduce(v, function(acc, next) {
				acc[next.name] = next.count;
				return acc;
			}, {index: i});
		}),
		flattened = _.flatten(results),
		observableNames = _.keys(_.groupBy(flattened, 'name'));
			
	res.locals({
        data: JSON.stringify({ 
			data: mappedresults,
			labels: _.map(observableNames, function(x) { console.log(x); return { valueField: x, name: x }; }) 
		})
    });

    res.render('index');
});

app.post('/', function(req, res) {
	var body = '';
	req.on('data', function(c) { body += c; });
	
	req.on('end', function () { console.log(JSON.parse(body)); });
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
