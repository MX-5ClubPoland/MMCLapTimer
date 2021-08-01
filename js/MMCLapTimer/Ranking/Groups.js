/**
 * @constructor
 */
MMCLapTimer.Ranking.Groups = MMCLapTimer.Ranking.Rallysprint.extend((function() {

	var Ranking = function RallysprintRanking(results, options) {
		options = options || [];
		this._averageLapsCount = options.averageLapsCount || 0;
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
