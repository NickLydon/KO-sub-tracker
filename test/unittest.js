function getSut(o) {
	var sut = ko_dependencies(function() { 
		
	})(o);
	
	return sut;
}

function getSutWithReporting(o, reporting) {
	var sut = ko_dependencies(function(report,successCallback,failureCallback) { 
		reporting(report.results, successCallback, failureCallback);
	})(o);

	sut.start();
	
	return sut;
}

test('should start at 0', function() {
	var sut = getSut({
		
	});

	equal(0, sut.getCount().length);
});

test('should track observables', function() {
	var o = { o: ko.observable() },
		sut = getSut(o);
	 
	o.o.notifySubscribers("");
	
	equal(1, sut.getCount()[0].count);
});

test('should track observable arrays', function() {
	var o = { o: ko.observableArray([]) },
		sut = getSut(o);
	 
	o.o.push(1);
	
	equal(1, sut.getCount()[0].count);
});


test('should handle circular references', function() {
	var o = { o: ko.observable() },
		sut;

	o.o.o = o.o;	
		
	sut = getSut(o);
	 
	o.o.notifySubscribers("");
	o.o.o.notifySubscribers("");
	
	equal(1, sut.getCount().length, 'should only count observable once');
	equal(2, sut.getCount()[0].count);
});

test('should track observables multiple times', function() {
	var o = { o: ko.observable() },
		times = 3,
		sut = getSut(o), 
		i = 0;
	 
	for(; i < times; i++) {
		o.o.notifySubscribers("");
	}
	
	equal(sut.getCount()[0].count, times);
});

test('should track computeds', function() {
	var obs = ko.observable(false);
		o = { obs: ko.observable(false), o: ko.computed(function() { return obs(); }) },
		sut = getSut(o);
	 	
	obs(!obs());
	o.obs(!o.obs());
	
	equal(sut.getCount().length, 2);
	equal(sut.getCount()[0].count, 1);
	equal(sut.getCount()[0].name, "obs");
	equal(sut.getCount()[1].count, 1);
	equal(sut.getCount()[1].name, "o");
});

test('should give names of observables', function() {
	var o = { },
		name = 'name of observable',
		sut;
	 
	o[name] = ko.observable();
	
	sut = getSut(o);
	
	o[name].notifySubscribers("");
	
	equal(sut.getCount()[0].name, name);
});

test('should track nested observables', function() {
	var first = { 
		second : { 
			third: ko.observable() 
		} 
	},
		sut = getSut(first);
	
	first.second.third.notifySubscribers("");
	
	equal(sut.getCount()[0].name, 'second.third');
	equal(sut.getCount()[0].count, 1);
});

test('should track deep nested observables ', function() {
	var deep = 10000000,
		sut,
		i = 0,
		currentO = {};
		
		for(; i < deep; i++) {
			currentO.o = {};
			currentO = currentO.o;
		}
		
		currentO.o = ko.observable();
		
		sut = getSut(currentO);
	
	currentO.o.notifySubscribers("");
	
	equal(sut.getCount()[0].count, 1);
});

test('should not track changes when stopped', function() {
	var o = { o: ko.observable() },
		sut = getSut(o),
		notifyShouldCount1 = function() {		
			o.o.notifySubscribers("");
			equal(sut.getCount()[0].count, 1);			
		};		
	
	notifyShouldCount1();
	
	sut.stop();
	
	notifyShouldCount1();
});

test('should access observable object properties', function() {
	var o = { o: ko.observable({ internal: ko.observable() }) },
		sut = getSut(o);
		
		o.o().internal.notifySubscribers('');
		
	equal(sut.getCount().length, 2);		
	equal(sut.getCount()[0].name, 'o().internal');
	equal(sut.getCount()[0].count, 1);
});

test('should report results when stop is called', function() {
	var o = { o: ko.observable({ internal: ko.observable() }) },
		firstTime = true,
		sut = getSutWithReporting(o, function(report) {
			if(firstTime) {
				firstTime = false;
			} else {
				equal(report.length, 2);		
				equal(report[0].name, 'o().internal');
				equal(report[0].count, 1);
			}
		});
		
	o.o().internal.notifySubscribers('');
		
	sut.sendResults();		
});

test('should try to report results until successful', function() {
	var o = { o: ko.observable({ internal: ko.observable() }) },
		calledReport = 0,
		expected = 3;
		sut = getSutWithReporting(o, function(report, success, failure) {
			var firstTime = calledReport === 0;
			
			if(firstTime) {
				calledReport++;
			} else {
				calledReport++;

				if(calledReport < expected) {
					failure();
				} else {
					success({ id: 5 });
				}
			}
		});
				
	sut.sendResults();		
	
	equal(calledReport, expected);
});

test('should report results once observables have been subscribed to', function() {
	var o = { o: ko.observable() },
		sut = getSutWithReporting(o, function(report, success, failure) {
			equal(report.length, 1);
			equal(report[0].name, 'o');
			equal(report[0].count, 0);
		});
				
	expect(3);
});
