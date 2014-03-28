var viewModel = (function() {
	var vm = {
		arr: ko.observableArray([]),
		button: function() {
			this.arr.push(this.arr().length);
		},
		comp: []
	},
	addToComp = function() {
		vm.comp.push(ko.computed(function() {
			return this.arr().length + " many items in array";
		}, vm));
	};
	for(var i = 0; i < 40; i ++) {
		addToComp();
	}
	
	return vm;
}());

var tracker = ko_dependencies(jQueryReporter(3000))(viewModel);
tracker.start();
$(function() {
	ko.applyBindings(viewModel);
});