/**
 * @constructor
 * Options:
 *  driverTemplate
 * 	results
 */
MMCLapTimer.Session = (function(options) {
	var Session = function(options) {
		this.rankings = [];
		this.categories = {};
		this.container = null;
		if (options.driverTemplate) {
			this.driverTemplate = options.driverTemplate;
		} else {
			this.driverTemplate = $('.templates .driver.practice').clone();
		}
		if (options.results) {
			this.load(options.results);
		}
	}

	Session.prototype.rankings = [];
	Session.prototype.categories = {};
	Session.prototype.driverTemplate = null;
	Session.prototype.container = null;

	/**
	 * Replaces all results with a new set.
	 * Removes all previous data and redraws all related views.
	 * @param results
	 * @return this Methods chaning.
	 */
	Session.prototype.load = function(results) {
		var category, categorizedResults;
		this.reset();
		categorizedResults = this.categorizedResults(results);
		for (category in categorizedResults) {
			this.rankings.push(
				this.categories['Klasa ' + category] = new MMCLapTimer.Ranking(categorizedResults[category], {
					category: 'Klasa ' + category,
					driverTemplate: this.driverTemplate
				})
			);
		}
		this.rankings.sort(function(a, b) {
			return b.standings.length - a.standings.length;
		});
		return this;
	}

	/**
	 * Adds new laptimes.
	 * @param {Array} results Results from Collector.
	 * @return this Methods chaning.
	 */
	Session.prototype.appendResults = function(results) {
		return this;
	}

	Session.prototype.categorizedResults = function(results) {
		var i, categorizedResults = {};
		for (i = 0; i < results.length; i++) {
			category = results[i].category.toString();
			if (!categorizedResults[category]) {
				categorizedResults[category] = [];
			}
			categorizedResults[category].push(results[i]);
		}
		return categorizedResults;
	}

	Session.prototype.fastestDriver = function() {
		var i, fastestDriver = null;
		for (i = 0; i < this.rankings.length; i++) {
			if (!fastestDriver || fastestDriver.fastestLap() > this.rankings[i].fastestDriver().fastestLap()) {
				fastestDriver = this.rankings[i].fastestDriver();
			}
		}
		return fastestDriver;
	}

	Session.prototype.fastestLap = function() {
		return this.fastestDriver().fastestLap();
	}

	Session.prototype.draw = function() {
		var i;
		if (!this.container) {
			this.container = $('<div class="session">');
		}
		for (i = 0; i < this.rankings.length; i++) {
			this.rankings[i].draw();
			this.rankings[i].container.appendTo(this.container);
		}
		for (i = 0; i < this.rankings.length; i++) {
			this.rankings[i].showDriverRecursively(0);
		}
		if (this.fastestDriver()) {
			this.fastestDriver().container.find('.personalFastest').addClass('generalFastest');
			//this.adjustHeights();
		}
		return this;
	}

	//Session.prototype.longerColumn = function() {
	//	return this.rankings[0].standings.length >= this.rankings[1].standings.length + this.rankings[2].standings.length ? 'left' : 'right';
	//}

	Session.prototype.adjustHeights = function() {
		var rowsCount = Math.max(this.rankings[0].standings.length, this.rankings[1].standings.length + this.rankings[2].standings.length, 12);
		this.container.css({fontSize: 'calc(85vh / ' + rowsCount + ')'});
		return this;
	}

	Session.prototype.reset = function() {
		var i, category;
		for (category in this.categories) {
			this.categories[category].destroy();
		}
		for (i = 0; i < this.rankings.length; i++) {
			this.rankings[i].destroy();
			delete this.rankings[i];
		}
	}

	Session.prototype.destroy = function() {
		this.reset();
		if (this.container) {
			this.container.remove();
		}
		this.container = null;
		this.driverTemplate = null;
	}

	return Session;
})();