MMCLapTimer.Session.Rallysprint = MMCLapTimer.Session.extend((function() {
	var Session = function RallysprintSession(options) {}

	Session.prototype.rankingClass = MMCLapTimer.Ranking.Rallysprint;

	Session.prototype.drawFastestLap = function() {
		this.bestDriver().container.find('.personalAverage').addClass('generalFastest');
		return this;
	}

	Session.prototype.fastestDriver = function() {
		var category, lap, driver, bestDriver = null;
		for (category in this.categories) {
			driver = this.categories[category].bestDriver();
			if (driver) {
				lap = driver.fastestLap();
			}
			if (driver && lap && (!bestDriver || lap < bestDriver.fastestLap())) {
				bestDriver = this.categories[category].fastestDriver();
			}
		}
		return bestDriver;
	}

	Session.prototype.drawFastestLaps = function() {
		var fastestDriver;
		$(this.rankings).each(function() {
			this.drawFastestLap();
		});
		if (fastestDriver = this.fastestDriver()) {
			fastestDriver.container.find('.personalAverage.bar').addClass('generalFastest');
		}
		return this;
	}

	return Session;
})());
