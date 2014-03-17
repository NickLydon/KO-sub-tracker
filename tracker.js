function tracker(o) {
	var observables = [],
		walkTheGraph = function(o) {
			
		var visited = '__ko__sub_tracker__';
			
			for(var i in o) {
				if (o.hasOwnProperty(i) && o[i] && ko.isObservable(o[i])) {
			
					var subscriberToken = {
						observable: o[i],
						name: i.toString(),
						count: 0
					};
						 
					subscriberToken.observable.subscribe(function() {
						subscriberToken.count++;
					});
				
					observables.push(subscriberToken);
					
					o[i][visited] = true;
				}

				if(!o[i][visited]) {
					walkTheGraph(o[i]);
				}

			}
	
		};
		
	walkTheGraph(o);
	
	return {
		getCount: function() {
			return observables;
		}
	};
}