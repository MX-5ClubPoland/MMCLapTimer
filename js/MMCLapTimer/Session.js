/**
 * @constructor
 * @params {MMCLapTimer.ResultsFeed|null} resultFeed
 * @params {Object} options
 * Options:
 *  {HTMLElement} container
 *  {Array} results
 *  {String} name
 *  {MMCLapTimer.Trackday} trackday
 *  {MMCLapTimer.Spreadsheet} spreadsheets
 *  rotateLayersDuration
 */
MMCLapTimer.Session = (function() {
	var Session = function(options) {
		var that = this;
		this.rankings = [];
		this.categories = {};
		this.trackday = options.trackday;
		this.spreadsheets = options.spreadsheets || [];
		this.container = options.container || null;
		this.name = options.name || '';
		this.isDrawn = true;
		this.rotateLayersDuration = options.rotateLayersDuration || that.trackday.config.rotateLayersDuration || 5;
		this.resultsFeed = new MMCLapTimer.ResultsFeed(that.trackday.config.resultsLocalDbName, that.trackday.config.resultsRemoteDbUrl, {
			onUpdate: function() {
				return that.resultsFeed.reloadResults().then(function() {
					if (that.resultsFeed.isSynchronized()) {
						that.isDrawn = false;
						that.reloadView();
					}
				});
			}
		});

		if (options.results) {
			this.load(options.results);
		}
	};

	Session.prototype.rankingClass = MMCLapTimer.Ranking;

	Session.prototype.unload = function() {
		var ranking, category;
		if (this.resultsFeed) {
			this.resultsFeed.stopSync();
		}
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
	};

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
	};

	Session.prototype.reloadSpreadsheets = function() {
		//var i;
		//for (i = 0; i < this.spreadsheets.length; i++) {
		//	this.spreadsheets[i].data = null;
		//}
		this.reloadSpreadsheetsRecursively(0);
	};

	Session.prototype.reloadSpreadsheetsRecursively = function(s) {
		var that = this, spreadsheet = this.spreadsheets[s];
		if (spreadsheet) {
			//console.log('reload', s);
			spreadsheet.reloadIfChanged(function(results) {
				if (results) {
					spreadsheet.data = results;
					that.isDrawn = false;
					//console.log('changed', s);
					//if (!that.newResults) {
					//	that.newResults = [];
					//}
					//that.newResults.push(results);
				}
				that.reloadSpreadsheetsRecursively(s + 1);
			});
		} else if (s > 0) {
			//console.log('all reloaded');
			this.allSpreadsheetsLoaded();
		}
	};

	Session.prototype.areSpreadsheetsDirty = function() {
		var i;
		if (this.spreadsheets && this.spreadsheets.length) {
			for (i = 0; i < this.spreadsheets.length; i++) {
				if (this.spreadsheets[i].isDirty) {
					return true;
				}
			}
		}
		return false;
	};

	Session.prototype.allSpreadsheetsLoaded = function() {
		var that = this;
		if (this.resultsFeed) {
			this.resultsFeed.reloadResults().then(function(allResults) {
				that.reloadView();
			});
		}
	};

	Session.prototype.reloadView = function() {
		var that = this;
		var feedDrivers = {};
		var i;
		var n;
		if (!this.isDrawn) {
			this.unload();

			if (this.spreadsheets.length > 0) {
				this.resultsFeed.results.forEach(function(result) {
					if (result.hasOwnProperty('driverId')) {
						var num = result.driverId;
						var time = result.microtime / 1000000;
						var inRange = time >= that.trackday.config.minimumLapTime && time <= that.trackday.config.maximumLapTime;
						if (!feedDrivers.hasOwnProperty(num)) {
							feedDrivers[num] = {
								times: []
							};
						}
						// Rejecting invalid and out of range laps:
						if ((inRange && result.verification !== false) || (!inRange && result.verification === true)) {
							feedDrivers[num].times.push(time.toString());
						}
					}
				});
				this.spreadsheets[0].data.forEach(function(driver) {
					if (feedDrivers.hasOwnProperty(driver.number)) {
						$.extend(feedDrivers[driver.number], driver, {
							times: feedDrivers[driver.number].times
						});
					} else {
						return feedDrivers[driver.number];
					}
				});
				for (n in feedDrivers) {
					if (!feedDrivers[n].hasOwnProperty('number')) {
						delete feedDrivers[n];
					}
				}
				for (i = 0; i < this.spreadsheets.length; i++) {
					this.appendResults(this.spreadsheets[i].data);
				}
				this.appendResults(Object.values(feedDrivers));
			}
			if (this.resultsFeed) {
				this.resultsFeed.startSync();
			}
			this.isDrawn = false;
			// delete this.newResults;
		}
		if (this.resultsFeed && this.resultsFeed.isSynchronized()) {
			MMCLapTimer.loader.hide();
			this.draw();
		}
		this.reloadTimeout = setTimeout(function() {
			that.reloadSpreadsheets();
		}, that.trackday.config.sheetRefreshInterval * 1000);
	};

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
	};

	Session.prototype.categorizedResults = function(results) {
		var i, categorizedResults = {};
		for (i = 0; i < results.length; i++) {
			// if (!results[i].category) {
			// 	console.log(results[i]);
			// } else {
				category = results[i].category.toString();
				if (!categorizedResults[category]) {
					categorizedResults[category] = [];
				}
				categorizedResults[category].push(results[i]);
			// }
		}
		return categorizedResults;
	};

	Session.prototype.bestDriver = function() {
		var i, bestDriver = null;
		for (i = 0; i < this.rankings.length; i++) {
			if (!bestDriver || bestDriver.fastestLap() > this.rankings[i].bestDriver().fastestLap()) {
				bestDriver = this.rankings[i].bestDriver();
			}
		}
		return bestDriver;
	};

	Session.prototype.fastestLap = function() {
		return this.bestDriver().fastestLap();
	};

	Session.prototype.draw = function() {
		if (!this.isDrawn) {
			this.redraw();
			this.isDrawn = true;
		}
		return this;
	};

	Session.prototype.redraw = function() {
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
	};

	var rotateLayers = function(focus) {
		var layers = $(this).find('.layer');
		layers.each(function(i) {
			$(this).toggle(i === (focus % layers.length));
		});
	};

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
	};

	Session.prototype.drawFastestLaps = function() {
		return this;
	};

	Session.prototype.getRowsCount = function() {
		return Math.max(this.rankings[3].standings.length, this.rankings[1].standings.length + this.rankings[4].standings.length, 22);
	};

	Session.prototype.adjustHeights = function() {
		//this.container.css({fontSize: ($(window).height() * 0.85 / rowsCount) + 'px'});
		this.container.css({
			// fontSize: (100 / this.getRowsCount() + 0.1) + 'vh'
			fontSize: (100 / 58) + 'vh'
		});
		$('body').css({
			minHeight: '500px'
		});
		return this;
	};

	Session.prototype.destroy = function() {
		var i;
		this.unload();
		if (this.resultsFeed) {
			this.resultsFeed = null;
			delete this.resultsFeed;
		}
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
	};

	return Session;
})();
