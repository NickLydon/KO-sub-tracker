function tracker(viewModel) {
	var observables = [],
		currentlyTracking = false,
		walkTheGraph = function(o, formPropertyName) {
			
		var visited = '__ko__sub_tracker__';
			
			for(var i in o) {
				if (o.hasOwnProperty(i) && o[i] && ko.isObservable(o[i])) {
			
					var subscriberToken = {
						name: formPropertyName(i),
						count: 0
					};
						 
					o[i].subscribe(function() {
						if(currentlyTracking) {
							subscriberToken.count++;
						}
					});
				
					observables.push(subscriberToken);
					
					o[i][visited] = true;
				}

				if(!o[i][visited]) {
					walkTheGraph(o[i], function(parentProperty) { return i + '.' + parentProperty; });
				}

			}
			
			o[visited] = true;
	
		};
		
	walkTheGraph(viewModel, function identity(propertyName) { return propertyName; });
	
	return {
		getCount: function() {
			return observables;
		},
		start: function() {
			currentlyTracking = true;
		},
		stop: function() {
			currentlyTracking = false;
		}
	};
}