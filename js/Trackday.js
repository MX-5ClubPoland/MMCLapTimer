/**
 * @constructor
 * Options:
 * 	container
 */
MMCLapTimer.Trackday = (function() {
	var Trackday = function(options) {
		var that = this;
		if (options.container) {
			this.container = options.container;
		}

		//this.collector = new MMCLapTimer.Collector();
		//// download config
		//config = new Spreadsheet(config);
		//// download results x3
		//for (i in config.practiceSpreadsheets) {
		//	this.collector.enqueue(config.practiceSpreadsheets[i]);
		//}
		//this.collector.iterate(3, function(results) {
		//	that.load(results);
		//});
		//// register obeserver
		//this.collector.enqueue()
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
