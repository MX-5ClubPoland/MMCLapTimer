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

	Renderer.prototype.destroy = function() {

	}

	return Renderer;
})();
