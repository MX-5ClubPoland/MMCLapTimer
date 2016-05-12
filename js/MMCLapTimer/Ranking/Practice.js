/**
 * @constructor
 */
MMCLapTimer.Ranking.Practice = MMCLapTimer.Ranking.extend((function() {
	var Ranking = function PracticeRanking(results, options) {}

	Ranking.prototype.driverClass = MMCLapTimer.Driver.Practice;

	return Ranking;
})());
