/**
 * @constructor
 * @params {Object} options
 * Options:
 *  {HTMLElement} container
 * 	{Array} results
 * 	{String} name
 * 	{MMCLapTimer.Trackday} trackday
 * 	{MMCLapTimer.Spreadsheet} spreadsheets
 */
MMCLapTimer.Session = (function() {
	var Session = function(options) {
		this.rankings = [];
		this.categories = {};
		this.trackday = options.trackday;
		this.spreadsheets = options.spreadsheets || [];
		this.container = options.container || null;
		this.name = options.name || '';
		this.isDrawn = true;
		if (options.results) {
			this.load(options.results);
		}
	}

	Session.prototype.unload = function() {
		var ranking, category;
		for (category in this.categories) {
			this.categories[category].destroy();
		}
		for (ranking = 0; ranking < this.rankings.length; ranking++) {
			this.rankings[ranking].destroy();
			delete this.rankings[ranking];
		}
		return this;
	}

	/**
	 * Replaces all results with a new set.
	 * Removes all previous data and redraws all related views.
	 * @param results
	 * @return this Methods chaining.
	 */
	Session.prototype.load = function(results) {
		this.unload();
		this.appendResults(results);
		return this;
	}

	Session.prototype.reloadSpreadsheets = function() {
		this.reloadSpreadsheetsRecursively(0);
	}

	Session.prototype.reloadSpreadsheetsRecursively = function(s) {
		var that = this, spreadsheet = this.spreadsheets[s];
		if (spreadsheet) {
			console.log('reload', s);
			spreadsheet.reload(function(isChanged) {
				if (isChanged) {
					console.log('changed', s);
					that.isDrawn = false;
					that.appendResults(this.data);
				}
				that.reloadSpreadsheetsRecursively(s + 1);
			});
		} else if (s > 0) {
			console.log('all reloaded');
			this.allSpreadsheetsLoaded();
		}
	}

	Session.prototype.allSpreadsheetsLoaded = function() {
		var i, that = this;
		MMCLapTimer.loader.hide();
		this.draw();
		this.reloadTimeout = setTimeout(function() {
			that.reloadSpreadsheets();
		}, config.refreshTimes.results * 1000);
	}

	/**
	 * Adds new laptimes.
	 * @param {Array} results Results from Collector.
	 * @return this Methods chaining.
	 */
	Session.prototype.appendResults = function(results) {
		var category,
			categorizedResults = this.categorizedResults(results);
		for (category in categorizedResults) {
			if (this.categories[category]) {
				this.categories[category].appendResults(categorizedResults[category]);
			} else {
				this.rankings.push(
					this.categories[category] = new MMCLapTimer.Ranking(categorizedResults[category], {
						session: this,
						category: category
					})
				);
			}
		}
		this.rankings.sort(function(a, b) {
			return b.standings.length - a.standings.length;
		});
		return this;
	}

	Session.prototype.categorizedResults = function(results) {
		var i, categorizedResults = {};
		for (i = 0; i < results.length; i++) {
			category = results[i].category.toString();
			if (!categorizedResults[category]) {
				categorizedResults[category] = [];
			}
			categorizedResults[category].push(results[i]);
		}
		return categorizedResults;
	}

	Session.prototype.fastestDriver = function() {
		var i, fastestDriver = null;
		for (i = 0; i < this.rankings.length; i++) {
			if (!fastestDriver || fastestDriver.fastestLap() > this.rankings[i].fastestDriver().fastestLap()) {
				fastestDriver = this.rankings[i].fastestDriver();
			}
		}
		return fastestDriver;
	}

	Session.prototype.fastestLap = function() {
		return this.fastestDriver().fastestLap();
	}

	Session.prototype.draw = function() {
		if (!this.isDrawn) {
			this.redraw();
			this.isDrawn = true;
		}
		return this;
	}

	Session.prototype.redraw = function() {
		console.log('redraw');
		var i;
		if (!this.container) {
			this.container = $('.templates .session.' + this.name).first().clone();
			if (this.trackday && this.trackday.container) {
				this.trackday.container.append(this.container);
			}
		}
		for (i = 0; i < this.rankings.length; i++) {
			this.rankings[i].draw();
			this.rankings[i].container.appendTo(this.container);
		}
		for (i = 0; i < this.rankings.length; i++) {
			this.rankings[i].container.find('.driver').css('width', 0).show();
			this.rankings[i].showDriverRecursively(0);
		}
		if (i > 0) {
			this.drawFastestLap();
			this.adjustHeights();
		}
		return this;
	}

	Session.prototype.drawFastestLap = function() {
		this.fastestDriver().container.find('.personalFastest').addClass('generalFastest');
		return this;
	}

	Session.prototype.adjustHeights = function() {
		var rowsCount = Math.max(this.rankings[0].standings.length, this.rankings[1].standings.length + this.rankings[2].standings.length, 12);
		//this.container.css({fontSize: ($(window).height() * 0.85 / rowsCount) + 'px'});
		this.container.css({
			fontSize: 'calc(85vh / ' + rowsCount + ')'
		});
		$('body').css({
			minHeight: '500px'
		});
		return this;
	}

	Session.prototype.destroy = function() {
		var i;
		this.unload();
		for (i = 0; i < this.spreadsheets.length; i++) {
			this.spreadsheets[i].destroy();
			delete this.spreadsheets[i];
		}
		this.spreadsheets = [];
		if (this.container) {
			this.container.remove();
		}
		this.container = null;
		this.name = '';
		this.isDrawn = false;
		clearTimeout(this.reloadTimeout);
	}

	return Session;
})();
