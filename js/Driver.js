/**
 * @constructor
 * Options:
 * 	container
 */
MMCLapTimer.Driver = (function() {
	var Driver = function(data, options) {
		if (options.container) {
			this.container = options.container;
		}
		this.load(data);
	}

	Driver.prototype.data = {};
	Driver.prototype.laps = [];
	Driver.prototype.container = null;

	Driver.prototype.load = function(data) {
		var i;
		this.reset();
		if (data) {
			this.data = data;
			if (this.data.times) {
				for (i in this.data.times) {
					this.laps.push(this.data.times[i] = parseFloat(this.data.times[i]));
				}
			}
			this.laps.sort();
		}
		return this;
	}

	Driver.prototype.update = function(data) {
		return this.reset(data).draw();
	}

	Driver.prototype.fastestLap = function() {
		if (this.laps.length) {
		//if (this.data.times.length) {
		//	return Math.min.apply(Math, this.laps);
			return this.laps[0];
		} else {
			return null;
		}
	}

	Driver.prototype.slowestLap = function() {
		if (this.laps.length) {
			return $(this.laps).last()[0];
		} else {
			return null;
		}
	}

	Driver.prototype.lastLap = function() {
		if (this.data.times.length) {
			return $(this.data.times).last()[0];
		} else {
			return null;
		}
	}

	/**
	 * Returns top N laps.
	 * @param n
	 * @returns {Array}
	 */
	Driver.prototype.topNLaps = function(n) {
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
		this.container.find('.number').text(this.data.number);
		if (fastestLap || lastLap) {
			this.container.find('.nick.bar').remove();
		}
		this.container.find('.nick').text(this.data.nick);
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

	Driver.prototype.reset = function(data) {
		this.laps = [];
		this.data = null;
	}

	Driver.prototype.destroy = function() {
		this.reset();
		if (this.container) {
			this.container.remove();
		}
		this.container = null;
	}

	return Driver;
})();
