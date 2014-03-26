///Example - can be used instead of reporting 
///results to the server
(function(window) {
	window.consoleReporter = function() {
		return function (report, success, failure) {
			console.log(report);
			success();
		};
	};
}(window || {}));