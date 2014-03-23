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
	var labels = _.range(0, results.length),
		datasets = (function() {
			var flattened = _.flatten(results);
			var nameGroups = _.groupBy(flattened, 'name');
			var keys = _.keys(nameGroups);
			var totalColours = 256;
			
			var numberOfLines = keys.length;
			
			var numberOfdifferentColours = Math.ceil(totalColours / (numberOfLines + 1));
			var lines = _.range(0, numberOfLines);
			var lineColours = _.map(lines, function(x) {
				return numberOfdifferentColours * x;
			});
			var datas = _.map(keys, function(k) {
				
				return {
					name: k,
					data: _.pluck(nameGroups[k], 'count')
				};
			});
			var dataWithColours = _.zip(datas,lineColours);
			
			return _.map(dataWithColours, function(m) {
				var data = m[0], colour = m[1],
					makeColourString = function(a) {
						return "rgba(" + colour + "," + colour + "," + colour + "," + a + ")";
					},
					strokeColour = makeColourString(1);
				return {
					name: data.name,
					data: data.data,
					fillColor : makeColourString(0.5),
					strokecolor : strokeColour,
					pointcolor : strokeColour,
					pointstrokecolor : "#fff"
				};
			});
		}());
		  		  
	res.locals({
        data: JSON.stringify({
			labels: labels,
			datasets: datasets
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
