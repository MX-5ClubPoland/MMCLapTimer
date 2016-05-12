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
		this.isDrawn = false;

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

	Trackday.prototype.load = function(config) {
		this.unload();
		if (config) {
			if (typeof config === 'string') {
				this.loadByToken(config);
			} else {
				this.loadByConfig(config);
			}
		}
		return this;
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
			}));
		}

		this.redraw();
		session.reloadSpreadsheets();
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
		if (!this.isDrawn) {
			this.redraw();
			this.isDrawn = true;
		}
		return this;
	}

	Trackday.prototype.redraw = function() {
		var s;
		if (!this.container) {
			this.container = $('<dic class="trackday">');
		}
		for (s in this.sessions) {
			this.sessions[s].draw();
			if (this.sessions[s].container) {
				this.sessions[s].container.appendTo(this.container);
			}
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
		this.isDrawn = false;
		return this;
	}

	return Trackday;
})();
