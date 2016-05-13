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
		return driverA.averageTime(this.averageLapsCount) - driverB.averageTime(this.averageLapsCount);
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
				//this.standings[d].container.hide();
				this.standings[d].container.find('.personalAverage').css({
					width: this.barWidth(this.standings[d].averageTime()) + '%'
				});
				//this.standings[d].container.find('.personalLast').css({
				//	width: this.barWidth(this.standings[d].lastLap()) + '%'
				//});
			}
		}
		return this;
	}

	return Ranking;
})());
