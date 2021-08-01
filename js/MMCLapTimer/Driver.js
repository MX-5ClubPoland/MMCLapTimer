/**
 * @constructor
 * Options:
 * 	container
 * 	{Ranking} ranking
 */
MMCLapTimer.Driver = (function() {
	var Driver = function(results, options) {
		options = options || {};
		this.ranking = options.ranking || undefined;
		this.container = options.container || $('.templates .driver').first().clone();
		if (results) {
			this.load(results);
		}
	}

	Driver.prototype.unload = function() {
		this.category = '';
		this.model = '';
		this.name = '';
		this.nick = '';
		this.number = '';
		this.times = [];
		this.laps = [];
		return this;
	}

	Driver.prototype.load = function(results) {
		this.unload();
		if (results.category) this.category = results.category;
		if (results.number) this.number = results.number;
		this.update(results);
		return this;
	}

	Driver.prototype.update = function(results) {
		var i, time;
		if (results.model) this.model = results.model;
		if (results.name) this.name = results.name;
		if (results.nick) this.nick = results.nick;
		if (results.times && results.times.length) {
			for (i in results.times) {
				time = parseFloat(results.times[i]);
				this.times.push(time);
				this.laps.push(time);
			}
			this.times.sort(function(a, b) {
				return a - b;
			});
		}
		return this;
	}

	Driver.prototype.fastestLap = function() {
		return this.times.length ? this.times[0] : null;
	}

	Driver.prototype.slowestLap = function() {
		return this.times.length ? $(this.times).last()[0] : null;
	}

	Driver.prototype.lastLap = function() {
		return this.laps.length ? $(this.laps).last()[0] : null;
	}

	/**
	 * Returns top N times.
	 * @param n
	 * @returns {Array}
	 */
	Driver.prototype.topTimes = function(n) {
		return this.times.slice(0, n);
	}

	Driver.prototype.averageTimes = function() {
		return this.topTimes(this.ranking.averageLapsCount());
	}

	Driver.prototype.draw = function() {
		if (!this.container) {
			this.container = $('<div class="driver">');
		}
		this.container.find('.number').text(this.number);
		this.container.find('.nick').text(this.nick);
		return this;
	}

	Driver.prototype.formatLaptime = function(lap) {
		lap = lap || 0.0;
		return String('0000000' + lap.toFixed(3)).slice(-7);
	}

	Driver.prototype.addLap = function(position) {

	}

	Driver.prototype.drawPosition = function(position) {
		if (this.container) {
			this.container.find('.position').text(position + '.');
		}
		return this;
	}

	Driver.prototype.destroy = function() {
		this.unload();
		if (this.container) {
			this.container.remove();
		}
		this.container = null;
		return this;
	}

	return Driver;
})();
