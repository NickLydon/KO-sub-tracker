test('should start at 0', function() {
	var sut = tracker({
		
	});

	equal(0, sut.getCount().length);
});

test('should track observables', function() {
	var o = { o: ko.observable() },
		sut = tracker(o);
	 
	o.o.notifySubscribers("");
	
	equal(1, sut.getCount()[0].count);
});


test('should track observables multiple times', function() {
	var o = { o: ko.observable() },
		times = 3,
		sut = tracker(o), 
		i = 0;
	 
	for(; i < times; i++) {
		o.o.notifySubscribers("");
	}
	
	equal(sut.getCount()[0].count, times);
});

test('should track computeds', function() {
	var o = { o: ko.computed(function() { return 0; }) },
		sut = tracker(o);
	 
	o.o.notifySubscribers("");
	
	equal(1, sut.getCount()[0].count);
});

test('should give names of observables', function() {
	var o = { },
		name = 'name of observable',
		sut;
	 
	o[name] = ko.observable();
	
	sut = tracker(o);
	
	o[name].notifySubscribers("");
	
	equal(name, sut.getCount()[0].name);
});

test('should track nested observables', function() {
	var first = { 
		second : { 
			third: ko.observable() 
		} 
	},
		sut = tracker(first);
	
	first.second.third.notifySubscribers("");
	
	equal(sut.getCount()[0].name, 'third');
	equal(sut.getCount()[0].count, 1);
});