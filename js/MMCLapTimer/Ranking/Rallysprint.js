/**
 * @constructor
 */
MMCLapTimer.Ranking.Rallysprint = MMCLapTimer.Ranking.extend((function() {

	var Ranking = function RallysprintRanking(results, options) {
		options = options || [];
		this._averageLapsCount = options.averageLapsCount || 0;
	}

	Ranking.prototype.driverClass = MMCLapTimer.Driver.Rallysprint;
	Ranking.prototype.averageLapsCount = 0;

	Ranking.prototype.averageLapsCount = function() {
		return this._averageLapsCount || this.session.trackday.config.lapsRaceCount;
	};

	Ranking.prototype.compareDrivers = function(driverA, driverB) {
		if (!driverA.times.length && !driverB.times.length) {
			return 0;
		} else if (!driverA.times.length) {
			return 1;
		} else if (!driverB.times.length) {
			return -1;
		}
		return driverA.timeAverage(this.averageLapsCount) - driverB.timeAverage(this.averageLapsCount);
	}

	Ranking.prototype.fastestDriver = function() {
		var driver, lap, fastestDriver = null;
		for (driver in this.drivers) {
			lap = this.drivers[driver].fastestLap();
			if (lap && (!fastestDriver || lap < fastestDriver.fastestLap())) {
				fastestDriver = this.drivers[driver];
			}
		}
		return fastestDriver;
	}

	Ranking.prototype.drawFastestLap = function() {
		var fastestDriver;
		if (this.standings.length) {
			if (fastestDriver = this.fastestDriver()) {
				fastestDriver.container.find('.personalTopLaps .time:first').addClass('generalFastest');
			}
		}
		return this;
	}

	Ranking.prototype.draw = function() {
		var d;
		if (!this.container) {
			this.container = $('.templates .ranking.category-' + this.category + (this.session ? '.' + this.session.name : '')).first().clone();
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

			for (d = 0; d < this.standings.length; d++) {
				this.standings[d].container.find('.personalAverage, .personalTopLaps').css({
					width: this.barWidth(this.standings[d].timeAverage()) + '%'
				});
			}
		}
		return this;
	}

	return Ranking;
})());
