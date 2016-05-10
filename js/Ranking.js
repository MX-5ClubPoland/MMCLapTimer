/**
 * @param {Array} results
 * @param {Object} options
 * @constructor
 * Options:
 * 	driverTemplate
 * 	container
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
		if (options.container) {
			this.container = options.container;
		}
		this.load(results);
	}

	Ranking.prototype.container = null;
	Ranking.prototype.drivers = {};
	Ranking.prototype.standings = [];
	Ranking.prototype.category = '';
	Ranking.prototype.driverTemplate = null;
	Ranking.prototype.showDriverRecursivelyTimeout = null;

	Ranking.prototype.load = function(results) {
		var r;
		this.reset();
		for (r = 0; r < results.length; r++) {
			this.standings.push(
				this.drivers[results[r].number.toString()] = new MMCLapTimer.Driver(results[r], {
					container: this.driverTemplate ? $(this.driverTemplate).clone() : null
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
		if (!this.container) {
			this.container = $('<div class="ranking">');
		}
		if (this.standings.length) {
			if (!this.standings.container) {
				this.standings.container = this.container.find('.standings:first').length ? this.container.find('.standings:first') : this.container;
			}
			for (d = 0; d < this.standings.length; d++) {
				this.standings[d]
					.draw()
					.drawPosition(d + 1)
					.container.appendTo(this.standings.container);
			}
			this.tune();
		}
		return this;
	}

	Ranking.prototype.tune = function() {
		var d;
		for (d = 0; d < this.standings.length; d++) {
			//this.standings[d].container.hide();
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
					width: '100%',
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
		if (this.standings.container) {
			this.standings.container.remove();
			delete this.standings.container;
		}
		this.standings = [];

		if (this.container) {
			this.container.remove();
		}
		this.container = null;
		return this;
	}

	Ranking.prototype.destroy = function() {
		this.reset();
		this.category = '';
		this.driverTemplate = null;
		return this;
	}

	return Ranking;
})();
