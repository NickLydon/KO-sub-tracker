function jQueryReporter() {
	
	return function(report, success, failure) {
		$.post("localhost:3000", JSON.stringify(report))
			.done(success)
			.fail(failure);
	};
}