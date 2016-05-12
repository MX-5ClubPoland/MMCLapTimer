MMCLapTimer.Session.Rallysprint = MMCLapTimer.Session.extend((function() {
	var Session = function RallysprintSession(options) {}

	Session.prototype.rankingClass = MMCLapTimer.Ranking.Rallysprint;

	Session.prototype.drawFastestLap = function() {
		this.fastestDriver().container.find('.personalAverage').addClass('generalFastest');
		return this;
	}

	return Session;
})());
