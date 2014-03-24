var viewModel = (function() {
	var vm = {
		arr: ko.observableArray([]),
		button: function() {
			this.arr.push(this.arr().length);
		}
	};
	vm.comp = ko.computed(function() {
		return this.arr().length + " many items in array";
	}, vm);
	
	return vm;
}());

var tracker = ko_dependencies(jQueryReporter(3000))(viewModel);
tracker.start();
$(function() {
	ko.applyBindings(viewModel);
});