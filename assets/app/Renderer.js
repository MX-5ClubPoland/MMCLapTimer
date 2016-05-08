MMCLapTimer.Renderer = (function() {
	var Renderer = function(results, options) {
		this.config = $.extend(true, {
			driverTemplate: $('.driverTemplates .practice .driver').clone(),
			container: $('.ranking')
		}, options);

		this.ranking = new MMCLapTimer.Ranking($(results).filter(function() {
			return this.category == 1;
		}).toArray());
		//this.rankings = [
		//	new MMCLapTimer.Ranking($(results).filter(function() {
		//		return this.category == 1;
		//	}).toArray()),
		//	new MMCLapTimer.Ranking($(results).filter(function() {
		//		return this.category == 2;
		//	}).toArray()),
		//	new MMCLapTimer.Ranking($(results).filter(function() {
		//		return this.category == 3;
		//	}).toArray())
		//];
		this.draw();
	}

	Renderer.prototype.draw = function() {
		var d, container = $('<div>');
		if (this.ranking.standings.length) {
			for (d = 0; d < this.ranking.standings.length; d++) {
				this.ranking.standings[d]
					.draw()
					.drawPosition(d + 1)
					.container.appendTo(container);
			}
			this.config.container.html(container);
			this.adjustHeight();
			this.tune();
		}
		return this;
	}

	Renderer.prototype.tune = function() {
		var d;
		for (d = 0; d < this.ranking.standings.length; d++) {
			this.ranking.standings[d].container.hide();
			this.ranking.standings[d].container.find('.personalFastest').css({
				width: this.barWidth(this.ranking.standings[d].fastestLap()) + '%'
			});
			this.ranking.standings[d].container.find('.personalLast').css({
				width: this.barWidth(this.ranking.standings[d].lastLap()) + '%'
			});
		}
		this.ranking.standings[0].container.find('.personalFastest').addClass('generalFastest');
		this.showDriverRecursively(0);
		return this;
	}

	Renderer.prototype.barWidth = function(lap) {
		var scale = this.ranking.slowestLastLap();
		if (scale && lap) {
			return 100 / scale * lap;
		} else {
			return null;
		}
	}

	Renderer.prototype.showDriverRecursively = function(d) {
		var that = this,
			driver = this.ranking.standings[d];
		if (driver) {
			setTimeout(function() {
				driver.container.slideDown(200);
				that.showDriverRecursively(d + 1);
			}, 20);
		}
	}

	Renderer.prototype.adjustHeight = function() {
		$('.driver').css({fontSize: 'calc(90vh / ' + Math.max(this.ranking.standings.length, 12) + ')'}).show();
		return this;
	}

	Renderer.prototype.destroy = function() {

	}

	return Renderer;
})();
