/**
 * @constructor
 * Options:
 *  container
 * 	results
 * 	name
 * 	trackday
 */
MMCLapTimer.Session = (function(options) {
	var Session = function(options) {
		this.rankings = [];
		this.categories = {};
		this.trackday = options.trackday;
		this.container = options.container || null;
		this.name = options.name || '';
		if (options.results) {
			this.load(options.results);
		}
	}

	Session.prototype.unload = function() {
		var ranking, category;
		for (category in this.categories) {
			this.categories[category].destroy();
		}
		for (ranking = 0; ranking < this.rankings.length; ranking++) {
			this.rankings[ranking].destroy();
			delete this.rankings[ranking];
		}
		return this;
	}

	Session.prototype.name = '';
	Session.prototype.rankings = [];
	Session.prototype.categories = {};
	Session.prototype.container = null;

	/**
	 * Replaces all results with a new set.
	 * Removes all previous data and redraws all related views.
	 * @param results
	 * @return this Methods chaining.
	 */
	Session.prototype.load = function(results) {
		var category, categorizedResults;
		this.unload();
		categorizedResults = this.categorizedResults(results);
		for (category in categorizedResults) {
			this.rankings.push(
				this.categories[category] = new MMCLapTimer.Ranking(categorizedResults[category], {
					session: this,
					category: category
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
	 * @return this Methods chaining.
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
			this.container = $('.templates .session.' + this.name).first().clone();
		}
		for (i = 0; i < this.rankings.length; i++) {
			this.rankings[i].draw();
			this.rankings[i].container.appendTo(this.container);
		}
		for (i = 0; i < this.rankings.length; i++) {
			this.rankings[i].container.find('.driver').css('width', 0).show();
			this.rankings[i].showDriverRecursively(0);
		}
		if (i > 0) {
			this.drawFastestLap();
			this.adjustHeights();
		}
		return this;
	}

	Session.prototype.drawFastestLap = function() {
		this.fastestDriver().container.find('.personalFastest').addClass('generalFastest');
		return this;
	}

	Session.prototype.adjustHeights = function() {
		var rowsCount = Math.max(this.rankings[0].standings.length, this.rankings[1].standings.length + this.rankings[2].standings.length, 12);
		//this.container.css({fontSize: ($(window).height() * 0.85 / rowsCount) + 'px'});
		this.container.css({
			fontSize: 'calc(85vh / ' + rowsCount + ')'
		});
		$('body').css({
			minHeight: '500px'
		});
		return this;
	}

	Session.prototype.destroy = function() {
		this.unload();
		if (this.container) {
			this.container.remove();
		}
		this.container = null;
		this.name = '';
	}

	return Session;
})();
