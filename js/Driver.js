/**
 * @constructor
 * Options:
 * 	container
 */
MMCLapTimer.Driver = (function() {
	var fields = ['category', 'model', 'name', 'nick', 'number', 'times'];

	var Driver = function(result, options) {
		options = options || {};
		if (options.container) {
			this.container = options.container;
		}
		this.init(result);
	}

	Driver.prototype.category = '';
	Driver.prototype.model = '';
	Driver.prototype.name = '';
	Driver.prototype.nick = '';
	Driver.prototype.number = '';
	Driver.prototype.times = [];
	Driver.prototype.laps = [];
	Driver.prototype.container = null;

	Driver.prototype.init = function(result) {
		return this.reset(result);
	}

	Driver.prototype.update = function(result) {
		var i;
		for (i in result) {
			if (fields.indexOf(i) > 0) {
				this[i] = result[i];
			}
		}
		if (this.times.length) {
			for (i in result.times) {
				this.times.push(this.laps[i] = parseFloat(this.times[i]));
			}
			this.times.sort();
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

	Driver.prototype.reset = function(result) {
		this.category = '';
		this.model = '';
		this.name = '';
		this.nick = '';
		this.number = '';
		this.times = [];
		this.laps = [];
		if (result) {
			this.update(result);
		}
		return this;
	}

	Driver.prototype.destroy = function() {
		this.reset();
		if (this.container) {
			this.container.remove();
		}
		this.container = null;
		return this;
	}

	return Driver;
})();
