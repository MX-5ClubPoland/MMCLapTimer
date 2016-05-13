/**
 * @constructor
 * @params {Object} options
 * Options:
 *  {HTMLElement} container
 * 	{Array} results
 * 	{String} name
 * 	{MMCLapTimer.Trackday} trackday
 * 	{MMCLapTimer.Spreadsheet} spreadsheets
 * 	rotateLayersDuration
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
		this.rotateLayersDuration = options.rotateLayersDuration || config.rotateLayersDuration || 5;
		if (options.results) {
			this.load(options.results);
		}
	}

	Session.prototype.rankingClass = MMCLapTimer.Ranking;

	Session.prototype.unload = function() {
		var ranking, category;
		for (category in this.categories) {
			this.categories[category].destroy();
			delete this.categories[category];
		}
		this.categories = {};
		for (ranking = 0; ranking < this.rankings.length; ranking++) {
			this.rankings[ranking].destroy();
			delete this.rankings[ranking];
		}
		this.rankings = [];
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
		var i;
		for (i = 0; i < this.spreadsheets.length; i++) {
			this.spreadsheets[i].data = null;
		}
		this.reloadSpreadsheetsRecursively(0);
	}

	Session.prototype.reloadSpreadsheetsRecursively = function(s) {
		var that = this, spreadsheet = this.spreadsheets[s];
		if (spreadsheet) {
			//console.log('reload', s);
			spreadsheet.reloadIfChanged(function(results) {
				if (results) {
					//console.log('changed', s);
					if (!that.newResults) {
						that.newResults = [];
					}
					that.newResults.push(results);
				}
				that.reloadSpreadsheetsRecursively(s + 1);
			});
		} else if (s > 0) {
			//console.log('all reloaded');
			this.allSpreadsheetsLoaded();
		}
	}

	Session.prototype.allSpreadsheetsLoaded = function() {
		var i, that = this;
		if (this.newResults) {
			this.unload();
			for (i = 0; i < this.newResults.length; i++) {
				this.appendResults(this.newResults[i]);
			}
			this.isDrawn = false;
			delete this.newResults;
		}
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
					this.categories[category] = new (this.rankingClass)(categorizedResults[category], {
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

	Session.prototype.bestDriver = function() {
		var i, bestDriver = null;
		for (i = 0; i < this.rankings.length; i++) {
			if (!bestDriver || bestDriver.fastestLap() > this.rankings[i].bestDriver().fastestLap()) {
				bestDriver = this.rankings[i].bestDriver();
			}
		}
		return bestDriver;
	}

	Session.prototype.fastestLap = function() {
		return this.bestDriver().fastestLap();
	}

	Session.prototype.draw = function() {
		if (!this.isDrawn) {
			this.redraw();
			this.isDrawn = true;
		}
		return this;
	}

	Session.prototype.redraw = function() {
		//console.log('redraw');
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
			this.drawFastestLaps();
			this.adjustHeights();
			this.rotateLayers();
		}
		return this;
	}

	var rotateLayers = function(focus) {
		var layers = $(this).find('.layer');
		layers.each(function(i) {
			$(this).toggle(i === (focus % layers.length));
		});
	}

	Session.prototype.rotateLayers = function() {
		var layerers = [],
			count = this.container.find('.driver:first .layers:has(.layer:nth-of-type(2))').find('.layer').length;
		for (i = 0; i < count; i++) {
			layerers.push(this.container.find('.driver .layers .layer:has(.personalTopLaps .time):nth-of-type(' + (i + 1) + ')'));
		}
		if (layerers) {
			var focus = 0;
			this.rotateLayersInterval = setInterval(function() {
				$(layerers).each(function(i) {
					$(this)[i === focus ? 'fadeOut' : 'fadeIn']();
				});
				focus = (focus + 1) % layerers.length;
			}, this.rotateLayersDuration * 1000);
		}
	}

	Session.prototype.drawFastestLaps = function() {
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
		clearInterval(this.rotateLayersInterval);
	}

	return Session;
})();
