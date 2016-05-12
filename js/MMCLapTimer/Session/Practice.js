MMCLapTimer.Session.Practice = MMCLapTimer.Session.extend((function() {
	var Session = function PracticeSession(options) {}

	Session.prototype.rankingClass = MMCLapTimer.Ranking.Practice;

	return Session;
})());
