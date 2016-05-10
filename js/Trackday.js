/**
 * @constructor
 * Options:
 * 	container
 * 	sessionTemplate
 * 	rankingTemplate
 * 	driverTemplate
 */
MMCLapTimer.Trackday = (function() {
	var Trackday = function(options) {
		if (options.sessionTemplate) {
			this.sessionTemplate = options.sessionTemplate;
		}
		if (options.rankingTemplate) {
			this.rankingTemplate = options.rankingTemplate;
		}
		if (options.driverTemplate) {
			this.driverTemplate = options.driverTemplate;
		}
		if (options.container) {
			this.container = options.container;
		}

		this.load();
	}

	Trackday.prototype.sessions = {};
	Trackday.prototype.container = null;
	Trackday.prototype.sessionTemplate = null;
	Trackday.prototype.rankingTemplate = null;
	Trackday.prototype.driverTemplate = null;

	Trackday.prototype.load = function(singleSessionResults) {
		var s;
		this.reset();
		this.sessions.practice = new MMCLapTimer.Session({
			container: this.sessionTemplate ? this.sessionTemplate.clone() : null,
			rankingTemplate: this.rankingTemplate,
			driverTemplate: this.driverTemplate,
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
			this.container = $('<dic class="trackday">')
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
		this.sessionTemplate = null;
		this.rankingTemplate = null;
		this.driverTemplate = null;
		return this;
	}

	return Trackday;
})();
