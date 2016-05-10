/**
 * @constructor
 * Options:
 * 	container
 */
MMCLapTimer.Trackday = (function() {
	var Trackday = function(ranking, options) {
		this.config = $.extend(true, {
			container: $('.practice .ranking')
		}, options);

		this.ranking = ranking;
		this.draw();
	}

	Trackday.prototype.destroy = function() {

	}

	return Trackday;
})();
