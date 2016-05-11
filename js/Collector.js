/**
 * @constructor
 * Options:
 *
 */
MMCLapTimer.Collector = (function() {

	var Collector = function(options) {
		options = options || {};

	};

	Collector.prototype.sources = [];

	Collector.prototype.enqueue = function(spreadsheet) {
		this.spreadsheets.push(spreadsheet);
		return this;
	}

	Collector.prototype.iteration = function(duration, onComplete) {

	}

	Collector.prototype.startChecking = function(duration, onComplete) {
		var that = this;
		setTimeout(function() {
			that.spreadsheets
		}, duration);
	}

	Collector.prototype.checkSpreadsheetsRecursively = function(s) {
		var that = this,
			spreadsheet = this.spreadsheet[s];
		if (driver) {
			this.showDriverRecursivelyTimeout = setTimeout(function() {
			}, 20);
		}
	}

	Collector.prototype.reset = function() {
		return this;
	};

	Collector.prototype.destroy = function() {
		this.reset();
		return this;
	}
})();
