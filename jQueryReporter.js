(function(window, $) {
	window.jQueryReporter = function(port, scheme) {
		return function (report, success, failure) {
			var timeout = function() {
				setTimeout(failure, 500);
			};
			$.ajax({
				url: (scheme || "http") + "://localhost:" + (port || 3000) + "/post",
				data: report,
				type: 'get',
				dataType: 'jsonp'
			})
			.done(success)
			.fail(timeout);
		};
	};
}(window || {}, $));