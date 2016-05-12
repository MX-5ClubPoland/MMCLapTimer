/**
 * @constructor
 * Options:
 * 	{ConfigSpreadsheet|String} config
 * 	{HTMLElement} container
 * 	{String} sessionName
 */
MMCLapTimer.Trackday = (function() {
	var Trackday = function(options) {
		options = options || {};
		this.config = null;
		this.container = options.container || null;
		this.sessionName = options.sessionName || null;
		if (!this.sessionClass()) {
			console.log('Unknown session name.');
			alert('Nie ma sesji o takiej nazwie.');
			return false;
		}
		this.load(options.config);
	}

	Trackday.prototype.sessionClass = function() {
		switch (this.sessionName) {
			case 'rallysprint':
				return MMCLapTimer.Session.Rallysprint;
			case 'practice':
				return MMCLapTimer.Session.Practice;
		}
		return false;
	}

	Trackday.prototype.unload = function() {
		var name;
		for (name in this.sessions) {
			this.removeSession(name);
		}
		this.sessions = {};
		return this;
	}

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
		this.unload();
		if (config) {
			if (typeof config === 'string') {
				this.loadByToken(config);
			} else {
				this.loadByConfig(config);
			}
		}
	}

	Trackday.prototype.loadByToken = function(configToken) {
		var that = this;
		new MMCLapTimer.Spreadsheet.Config(configToken, {
			complete:function() {
				this.data.spreadsheet = this;
				that.loadByConfig(this.data);
			}
		});
		return this;
	}

	Trackday.prototype.loadByConfig = function(config) {
		this.unload();
		this.config = config;
		this.loadResults();
	}

	Trackday.prototype.loadResults = function() {
		var i,
			that = this,
			session = this.addSession(this.sessionName);
		for (i = 0; i < this.config.sessions[session.name].length; i++) {
			session.spreadsheets.push(new MMCLapTimer.Spreadsheet.Results(this.config.sessions[session.name][i], {
				session: session
			}).reload());
		}

		MMCLapTimer.loader.show();
		setTimeout(function() {
			var i;
			for (i = 0; i < session.spreadsheets.length; i++) {
				session.appendResults(session.spreadsheets[i].data);
			}
			MMCLapTimer.loader.hide();
			that.draw();
		}, 3000);
		//this.sessions[session].observe(10);
		return this;
	}

	Trackday.prototype.addSession = function(name, results) {
		return this.sessions[name] = new (this.sessionClass())({
			trackday: this,
			name: name,
			results: results
		});
	}

	Trackday.prototype.removeSession = function(name) {
		if (this.sessions[name]) {
			this.sessions[name].destroy();
			delete this.sessions[name];
		}
		return this;
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

	Trackday.prototype.destroy = function() {
		this.unload();
		if (this.container) {
			this.container.remove();
		}
		this.container = null;
		this.config = null;
		return this;
	}

	return Trackday;
})();
