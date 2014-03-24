function jQueryReporter(port) {
	return function (report, success, failure) {
		var timeout = function() {
			setTimeout(failure, 500);
		};
		$.ajax({
			url: "http://localhost:" + port + "/post",
			data: report,
			type: 'get',
			dataType: 'jsonp'
		})
		.done(success)
		.fail(timeout);
	};
}