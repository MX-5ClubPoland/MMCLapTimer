MMCLapTimer.Session.Groups = MMCLapTimer.Session.Rallysprint.extend((function() {
	var Session = function GroupsSession(options) {}

	Session.prototype.categorizedResults = function(results) {
		var i, categorizedResults = {};
		for (i = 0; i < results.length; i++) {
			this.extractGroups(results[i]).forEach(function(category) {
				if (!categorizedResults[category]) {
					categorizedResults[category] = [];
				}
				categorizedResults[category].push(results[i]);
			});
		}
		return categorizedResults;
	};

	Session.prototype.extractGroups = function(result) {
		var groups = [];
		if (result.group) {
			groups.push('group' + 	result.group);
		}
		return groups;
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
		var order = ['group1', 'group2', 'group3', 'group4', 'group5', 'group6', 'group7', 'group8'];
		MMCLapTimer.Session.prototype.appendResults.call(this, results);
		this.rankings.sort(function(a, b) {
			return order.indexOf(a.category) - order.indexOf(b.category);
		});
		return this;
	};

	return Session;
})());
