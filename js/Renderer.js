/**
 * @constructor
 * Options:
 * 	container
 */
MMCLapTimer.Renderer = (function() {
	var Renderer = function(ranking, options) {
		this.config = $.extend(true, {
			container: $('.practice .ranking')
		}, options);

		this.ranking = ranking;
		this.draw();
	}

	Renderer.prototype.showDriverRecursively = function(d) {
		var that = this,
			driver = this.ranking.standings[d];
		if (driver) {
			setTimeout(function() {
				driver.container.animate({
					width: 'show',
				}, {
					duration: 300
				});
				that.showDriverRecursively(d + 1);
			}, 20);
		}
	}

	Renderer.prototype.adjustHeights = function() {
		$('.driver').css({fontSize: 'calc(90vh / ' + Math.max(this.ranking.standings.length, 12) + ')'}).show();
		return this;
	}

	Renderer.prototype.destroy = function() {

	}

	return Renderer;
})();
