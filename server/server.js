var https = require('https'),
	http = require('http'),
	fs = require('fs'),
	express = require('express'),
	app = express(),
	_ = require('underscore'),
	results = [],
	port = process.argv[2] || 3000,
	sslPort = process.argv[3] || 5000;
	
app.set('view engine', 'jshtml');
app.engine('jshtml', require('jshtml-express'));
app.use('/javascript', express.static(__dirname + '/javascript'));

app.get('/', function(req, res){	
	var id = req.query.id,
		//partitions an array into sub-arrays
		//of a given size
		windowed = function (arr, size) {
			var len = arr.length,
				resized = [],
				loop = function (currentIndex, currentSize) {
					if (currentSize === size) {
						loop(currentIndex + size, 0);
					} else if (currentIndex + currentSize < len) {
						if (resized[currentIndex]) {
							resized[currentIndex].push(arr[currentIndex + currentSize]);
						} else {
							resized[currentIndex] = [arr[currentIndex + currentSize]];
						}
						loop(currentIndex, currentSize + 1);
					}
				};
			
			if(len > 0 && size > 1) {						
				loop(0, 0);
			} else {
				resized = arr;
			}

			return resized;
		},
		//reverses the elements of an array
		reverse = function (arr) {
			return _.reduce(arr, function (acc, next) {
				return [next].concat(acc);
			}, []);
		},
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
		},
		//Orders the results by count, but still maintains them
		//in the order received from the client.
		//Introduced to split the graphs up on the page, which couldn't handle 
		//40 observable lines being shown at once
		orderedByCount = function (theseResults) {
			
			var rev = reverse(theseResults);
			
			var take1 = rev.slice(0, 1);
			
			var flatten = _.flatten(take1);
			
			var sortBy = _.sortBy(flatten, 'count');
			
			var rev = reverse(sortBy);
			
			var map = _.pluck(rev, 'name');
			
			var _windowed = windowed(map, 10);
			
			var map = _.map(_windowed, function (window) {
				return _.map(theseResults, function (x) {
					return _.filter(x, function (n) {
						return _.contains(window, n.name);
					});
				});
			});
			
			var withoutEmpties = _.filter(map, function(l) { return l.length; });
			
			return withoutEmpties;
		};
		
	if(id) {
		res.locals({
			data: JSON.stringify(_.map(orderedByCount(results[id]), formatResultsForGraph))
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
	
	res.jsonp(200, { id: id });	
});

var options = {
    pfx: fs.readFileSync('cert.pfx'),
	passphrase: 'password'
};
// Create an HTTP service.
http.createServer(app).listen(port);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(sslPort);