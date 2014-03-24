(function(window, ko, undefined) {

	window.ko_dependencies = function (sendResults) {

		return function tracker(viewModel) {
			var serverId = null,	
				observables = [],
				maxDepth = 1000,
				currentDepth = 0,
				currentlyTracking = true,
				walkTheGraph = function (o, formPropertyName) {

					var visited = '__ko__sub_tracker__';

					if (currentDepth < maxDepth) {
						currentDepth++;

						for (var i in o) {
							if (o.hasOwnProperty(i) && o[i] && ko.isObservable(o[i])) {

								var subscriberToken = {
									name: formPropertyName(i),
									count: 0
								},
									latestObservableValue = o[i]();

								o[i].subscribe(function () {
									if (currentlyTracking) {
										subscriberToken.count++;
									}
								});

								observables.push(subscriberToken);

								o[i][visited] = true;

								if (latestObservableValue && !latestObservableValue[visited]) {
									walkTheGraph(latestObservableValue, function (childProperty) { return formPropertyName(i) + '().' + childProperty; });
									latestObservableValue[visited] = true;
								}
							}

							if (!o[i][visited]) {
								walkTheGraph(o[i], function (childProperty) { return formPropertyName(i) + '.' + childProperty; });
							}

						}

						o[visited] = true;
					}
					
					currentDepth--;
				},
				orderBy = function(getProperty) {
					return function(a,b) {
						if (getProperty(a) > getProperty(b)) return -1;
						if (getProperty(a) < getProperty(b)) return 1;
						return 0;
					};
				},
				
				orderByCount = orderBy(function(a) { return a.count; }),
				orderByName = orderBy(function(a) { return a.name; }),
				
				getCount = function (order) {
					return observables.sort(order || orderByCount);
				},
				
				postResultsUntilSuccessful = function() {
					var results = getCount(),
						tryUntilSuccessful = function() {
							sendResults(
							 	{
									results: results,
									id: serverId
								},
								function success(response) {
									serverId = response.id;
								}, 
								tryUntilSuccessful);
						};
					
					tryUntilSuccessful();
				};
				
			walkTheGraph(viewModel, function identity(childProperty) { return childProperty; });
			postResultsUntilSuccessful();

			return {
				getCount: getCount,
				start: function () {
					currentlyTracking = true;
				},
				stop: function () {
					currentlyTracking = false;					
				},
				sendResults: function() {				
					postResultsUntilSuccessful();
				},
				orderByCount: orderByCount,
				orderByName: orderByName
			};
		};
	}
	
}(window || {}, ko));