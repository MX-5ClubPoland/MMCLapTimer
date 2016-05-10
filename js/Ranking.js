/**
 * @param {Array} results
 * @param {Object} options
 * @constructor
 * Options:
 * 	driverTemplate
 * 	rankingTemplate
 * 	category
 */
MMCLapTimer.Ranking = (function() {
	var Ranking = function(results, options) {
		if (options.category) {
			this.category = options.category;
		}
		if (options.driverTemplate) {
			this.driverTemplate = options.driverTemplate;
		}
		if (options.rankingTemplate) {
			this.rankingTemplate = options.rankingTemplate;
		} else {
			this.rankingTemplate = $('.templates .ranking.practice').clone();
		}
		this.load(results);
	}

	Ranking.prototype.container = null;
	Ranking.prototype.drivers = {};
	Ranking.prototype.standings = [];
	Ranking.prototype.category = '';
	Ranking.prototype.driverTemplate = null;
	Ranking.prototype.rankingTemplate = null;
	Ranking.prototype.showDriverRecursivelyTimeout = null;

	Ranking.prototype.load = function(results) {
		var r;
		this.reset();
		this.container = this.rankingTemplate ? $(this.rankingTemplate).clone() : $('<div class="ranking">');
		for (r = 0; r < results.length; r++) {
			this.standings.push(
				this.drivers[results[r].number.toString()] = new MMCLapTimer.Driver(results[r], {
					container: this.driverTemplate ? $(this.driverTemplate).clone() : undefined
				})
			);
		}
		this.sort();
		return this;
	}

	Ranking.prototype.sort = function() {
		this.standings.sort(this.compareDrivers);
		return this;
	}

	Ranking.prototype.compareDrivers = function(driverA, driverB) {
		if (!driverA.laps.length && !driverB.laps.length) {
			return 0;
		} else if (!driverA.laps.length) {
			return 1;
		} else if (!driverB.laps.length) {
			return -1;
		}
		return driverA.fastestLap() - driverB.fastestLap();
	}

	Ranking.prototype.update = function() {
		return this;
	}

	/**
	 * Finds the best lap.
	 * @returns float
	 */
	Ranking.prototype.fastestLap = function() {
		if (this.standings.length) {
			return this.standings[0].fastestLap();
		} else {
			return null;
		}
	}

	Ranking.prototype.slowestLap = function() {
		if (this.standings.length) {
			return $(this.standings).last()[0].slowestLap();
		} else {
			return null;
		}
	}

	/**
	 * Finds the driver who encounted the best lap.
	 * @returns {MMCLapTimer.Driver} or null
	 */
	Ranking.prototype.fastestDriver = function() {
		if (this.standings[0].laps.length) {
			return this.standings[0];
		}
		return null;
	}

	Ranking.prototype.slowestDriver = function() {
		var d;
		for (d = this.standings.length - 1; d >= 0; d--) {
			if (this.standings[d].laps.length) {
				return this.standings[d];
			}
		}
		return null;
	}

	Ranking.prototype.slowestLastLap = function() {
		var s, slowestLastLap = null;
		for (s = this.standings.length - 1; s >= 0; s--) {
			if (slowestLastLap === null || slowestLastLap < this.standings[s].lastLap()) {
				slowestLastLap = this.standings[s].lastLap();
			}
		}
		return slowestLastLap;
	}

	Ranking.prototype.draw = function() {
		var d;
		if (this.standings.length) {
			for (d = 0; d < this.standings.length; d++) {
				this.standings[d]
					.draw()
					.drawPosition(d + 1)
					.container.appendTo(this.container);
			}
			this.tune();
		}
		return this;
	}

	Ranking.prototype.tune = function() {
		var d;
		for (d = 0; d < this.standings.length; d++) {
			this.standings[d].container.hide();
			this.standings[d].container.find('.personalFastest').css({
				width: this.barWidth(this.standings[d].fastestLap()) + '%'
			});
			this.standings[d].container.find('.personalLast').css({
				width: this.barWidth(this.standings[d].lastLap()) + '%'
			});
		}
		this.container.find('.category').text(this.category);
		//this.standings[0].container.find('.personalFastest').addClass('generalFastest');
		return this;
	}

	Ranking.prototype.barWidth = function(lap) {
		var scale = this.slowestLastLap();
		if (scale && lap) {
			return 100 / scale * lap;
		} else {
			return null;
		}
	}

	Ranking.prototype.showDriverRecursively = function(d) {
		var that = this,
			driver = this.standings[d];
		if (driver) {
			this.showDriverRecursivelyTimeout = setTimeout(function() {
				driver.container.animate({
					width: 'show',
				}, {
					duration: 300
				});
				that.showDriverRecursively(d + 1);
			}, 20);
		}
	}

	Ranking.prototype.reset = function() {
		var i;
		clearTimeout(this.showDriverRecursivelyTimeout);
		for (i in this.drivers) {
			this.drivers[i].destroy();
			delete this.drivers[i];
		}
		this.drivers = {};

		while (this.standings.length > 0) {
			this.standings.shift().destroy();
		}
		this.standings = [];

		if (this.container) {
			this.container.remove();
		}
		this.container = null;
	}

	Ranking.prototype.destroy = function() {
		this.reset();
		this.category = '';
		this.driverTemplate = null;
		this.rankingTemplate = null;
	}

	return Ranking;
})();
