/**
 * @constructor
 * Options:
 * 	container
 */
MMCLapTimer.Driver = (function() {
	var Driver = function(results, options) {
		options = options || {};
		this.container = options.container || $('.templates .driver.practice').first().clone();
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
			this.times.sort();
			//console.log(this.nick, this.laps)
		}
		return this;
	}

	Driver.prototype.fastestLap = function() {
		if (this.times.length) {
		//	return Math.min.apply(Math, this.times);
			return this.times[0];
		} else {
			return null;
		}
	}

	Driver.prototype.slowestLap = function() {
		if (this.times.length) {
			return $(this.times).last()[0];
		} else {
			return null;
		}
	}

	Driver.prototype.lastLap = function() {
		if (this.laps.length) {
			return $(this.laps).last()[0];
		} else {
			return null;
		}
	}

	/**
	 * Returns top N times.
	 * @param n
	 * @returns {Array}
	 */
	Driver.prototype.topNTimes = function(n) {
		var times = [];
		if (this.times.length) {
			times = this.times;
			times.sort();
			if (times.length > n) {
				return times.slice(n * -1);
			}
		}
		return times;
	}

	Driver.prototype.draw = function() {
		var fastestLap = this.fastestLap(),
			lastLap = this.lastLap();
		if (!this.container) {
			this.container = $('<div class="driver">');
		}
		this.container.find('.number').text(this.number);
		if (fastestLap || lastLap) {
			this.container.find('.nick.bar').remove();
		}
		this.container.find('.nick').text(this.nick);
		this.container.find('.personalFastest')
			.toggle(!!fastestLap)
			.find('.time').text(this.formatLaptime(fastestLap));
		this.container.find('.personalLast')
			.toggle(!!lastLap)
			.find('.time').text(this.formatLaptime(lastLap));
		return this;
	}

	Driver.prototype.formatLaptime = function(lap) {
		return String('000' + Math.floor(lap)).slice(-3) + '.' + String('00' + (lap * 100 % 100)).slice(-2);
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
