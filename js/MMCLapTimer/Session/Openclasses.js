MMCLapTimer.Session.Openclasses = MMCLapTimer.Session.Rallysprint.extend((function() {
	var Session = function OpenclassesSession(options) {}

	// Session.prototype.rankingClass = MMCLapTimer.Ranking.OpenClasses;

	Session.prototype.categorizedResults = function(results) {
		var i, categorizedResults = {};
		for (i = 0; i < results.length; i++) {
			this.extractOpenClasses(results[i]).forEach(function(category) {
				if (!categorizedResults[category]) {
					categorizedResults[category] = [];
				}
				categorizedResults[category].push(results[i]);
			});
		}
		return categorizedResults;
	};

	Session.prototype.extractOpenClasses = function(result) {
		var categories = [];
		if (result.category === 10) {
			categories.push('open');
		}
		if (result.category === 11) {
			categories.push('open-2wd-250');
		}
		if (result.category === 12) {
			categories.push('open-2wd-250-plus');
		}
		if (result.category === 13) {
			categories.push('open-awd');
		}
		return categories;
	};

	Session.prototype.getRowsCount = function() {
		var evenRowsCount = 0;
		var oddRowsCount = 0;
		var isOdd = false;
		this.rankings.forEach(function(ranking) {
			if (isOdd) {
				oddRowsCount += ranking.standings.length;
			} else {
				evenRowsCount += ranking.standings.length;
			}
			isOdd = !isOdd;
		});

		return Math.max(evenRowsCount, oddRowsCount, 30);
	};

	Session.prototype.appendResults = function(results) {
		var order = ['open', 'open-2wd-250', 'open-2wd-250-plus', 'open-awd'];
		MMCLapTimer.Session.prototype.appendResults.call(this, results);
		this.rankings.sort(function(a, b) {
			return order.indexOf(a.category) - order.indexOf(b.category);
		});
		return this;
	};

	return Session;
})());
