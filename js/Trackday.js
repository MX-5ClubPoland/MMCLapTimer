/**
 * @constructor
 * Options:
 * 	{ConfigSpreadsheet|String} config
 * 	{HTMLElement} container
 */
MMCLapTimer.Trackday = (function() {
	var Trackday = function(options) {
		options = options || {};
		this.config = null;
		this.container = options.container || null;

		if (options.config) {
			this.load(options.config);
		}
	}

	Trackday.prototype.sessions = {};
	Trackday.prototype.container = null;

	Trackday.prototype.load2 = function(singleSessionResults) {
		var that = this;
		this.collector = new MMCLapTimer.Collector();
		// download config
		config = new Spreadsheet(config);
		// download results x3
		for (i in config.practiceSpreadsheets) {
			this.collector.enqueue(config.practiceSpreadsheets[i]);
		}
		this.collector.iterate(3, function(results) {
			that.loadByConfig(results);
		});
		// register obeserver
		this.collector.enqueue()
	}

	Trackday.prototype.load = function(config) {
		if (typeof config === 'string') {
			this.loadByToken(config);
		} else {
			this.loadByConfig(config);
		}
	}

	Trackday.prototype.loadByToken = function(configToken) {
		var that = this;
		new MMCLapTimer.ConfigSpreadsheet(configToken, {
			complete:function() {
				this.data.spreadsheet = this;
				that.loadByConfig(this.data);
			}
		});
		return this;
	}

	Trackday.prototype.loadByConfig = function(config) {
		this.reset();
		this.config = config;
		this.loadResults();
	}

	Trackday.prototype.loadResults = function() {
		var that = this;
		new MMCLapTimer.ResultsSpreadsheet(this.config.sheetPractice[0], {
			complete:function() {
				that.sessions.practice = new MMCLapTimer.Session({
					container: $('.templates .session.practice').first().clone(),
					results: this.data
				});
				MMCLapTimer.loader.hide();
				that.draw();
			}
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

		this.config = null;
		return this;
	}

	return Trackday;
})();
