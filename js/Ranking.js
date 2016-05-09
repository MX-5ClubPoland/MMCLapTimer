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
		this.standings = [];
		for (r = 0; r < results.length; r++) {
			this.standings.push(
				this.drivers[results[r].number.toString()] = new MMCLapTimer.Driver(results[r], {
					container: this.config.driverTemplate.clone()
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

	Ranking.prototype.destroy = function() {

	}

	return Ranking;
})();
