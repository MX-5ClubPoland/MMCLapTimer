MMCLapTimer.Ranking = (function() {
	var Ranking = function(results, options) {
		this.config = $.extend(true, {
			driverTemplate: $('.driverTemplates .practice .driver:first').clone()
		}, options);

		this.load(results);
	}

	Ranking.prototype.load = function(results) {
		var r;
		this.drivers = {};
		this.ranking = [];
		for (r in results) {
			this.ranking.push(this.drivers[results[r].number.toString()] = new MMCLapTimer.Driver(results[r], {
				container: this.config.driverTemplate.clone()
			}));
		}
		this.sort();
		return this;
	}

	/**
	 * Finds the best lap.
	 * @returns float
	 */
	Ranking.prototype.bestLap = function() {
		var d, t, lap = null;
		for (d in this.drivers) {
			for (t in this.drivers[d].laps) {
				if (lap === null || lap < this.drivers[d].laps[t]) {
					lap = this.drivers[d].laps[t];
				}
			}
		}
		return lap;
	}

	/**
	 * Finds the driver who encounted the best lap.
	 * @returns {MMCLapTimer.Driver} or null
	 */
	Ranking.prototype.fastestDriver = function() {
		var d, t, lap = null, driver = null;
		for (d in this.drivers) {
			for (t in this.drivers[d].times) {
				if (lap === null || lap < this.drivers[d].times[t]) {
					driver = this.drivers[d];
					lap = this.drivers[d].times[t];
				}
			}
		}
		return driver;
	}

	Ranking.prototype.sort = function() {
		this.ranking.sort(function(a, b) {
			if (!a.laps.length && !b.laps.length) {
				return 0;
			} else if (!a.laps.length) {
				return 1;
			} else if (!b.laps.length) {
				return -1;
			}
			return a.bestLap() - b.bestLap();
		});
		return this;
	}

	Ranking.prototype.destroy = function() {

	}

	return Ranking;
})();
