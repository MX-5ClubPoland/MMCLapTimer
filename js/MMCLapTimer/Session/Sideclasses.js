MMCLapTimer.Session.Sideclasses = MMCLapTimer.Session.Rallysprint.extend((function() {
	var Session = function SideclassesSession(options) {}

	// Session.prototype.rankingClass = MMCLapTimer.Ranking.SideClasses;

	Session.prototype.categorizedResults = function(results) {
		var i, categorizedResults = {};
		for (i = 0; i < results.length; i++) {
			this.extractSideClasses(results[i]).forEach(function(category) {
				if (!categorizedResults[category]) {
					categorizedResults[category] = [];
				}
				categorizedResults[category].push(results[i]);
			});
		}
		return categorizedResults;
	};

	Session.prototype.extractSideClasses = function(result) {
		var categories = [];
		if (result.spec) {
			categories.push(result.spec);
		}
		if (result.category === 4) {
			categories.push('rx8');
		}
		if (result.stock) {
			categories.push('stock');
		}
		if (result.street) {
			categories.push(result.street);
		}
		if (result.woman) {
			categories.push('women');
		}
		if (result.extreme) {
			categories.push('extreme');
		}
		if (result.yt) {
			categories.push('yt');
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
		var order = ['spec1', 'spec2', 'extreme', 'street1', 'street2', 'stock', 'rx8', 'women', 'yt'];
		MMCLapTimer.Session.prototype.appendResults.call(this, results);
		this.rankings.sort(function(a, b) {
			return order.indexOf(a.category) - order.indexOf(b.category);
		});
		return this;
	};

	return Session;
})());
