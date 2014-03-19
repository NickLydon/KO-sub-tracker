function getSut(o) {
	var sut = tracker(o);

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
		o = { o: ko.computed(function() { return obs(); }) },
		sut = getSut(o);
	 	
	obs(!obs());
	
	equal(1, sut.getCount()[0].count);
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