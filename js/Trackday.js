/**
 * @constructor
 * Options:
 * 	container
 */
MMCLapTimer.Trackday = (function() {
	var Trackday = function(options) {
		if (options.container) {
			this.container = options.container;
		}
	}

	Trackday.prototype.sessions = {};
	Trackday.prototype.container = null;

	Trackday.prototype.load = function(singleSessionResults) {
		var s;
		this.reset();
		this.sessions.practice = new MMCLapTimer.Session({
			container: $('.templates .session.practice').first().clone(),
			results: singleSessionResults
		});
		return this;
	}

	Trackday.prototype.addSession = function(name, results) {
		this.sessions.practice = new MMCLapTimer.Session({
			name: name,
			results: results
		});
	}

	Trackday.prototype.draw = function() {
		var s;
		if (!this.container) {
			this.container = $('<dic class="trackday">');
		}
		for (s in this.sessions) {
			this.sessions[s].draw().container.appendTo(this.container);
		}
		return this;
	}

	Trackday.prototype.reset = function() {
		var s;
		for (s in this.sessions) {
			this.sessions[s].destroy();
		}
		this.sessions = {}
		return this;
	}

	Trackday.prototype.destroy = function() {
		this.reset();
		if (this.container) {
			this.container.remove();
		}
		this.container = null;
		return this;
	}

	return Trackday;
})();
