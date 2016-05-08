MMCLapTimer.Driver = (function() {
	var Driver = function(data, options) {

		this.config = $.extend(true, {
			container: null
		}, options);


		this.container = this.config.container;
		this.reset(data);
	}

	Driver.prototype.reset = function(data) {
		var i;
		this.data = data;
		this.laps = [];
		if (this.data.times) {
			for (i in this.data.times) {
				this.laps.push(this.data.times[i] = parseFloat(this.data.times[i]));
			}
		}
		this.laps.sort();
		return this;
	}

	Driver.prototype.update = function(data) {
		return this.reset(data).draw();
	}

	Driver.prototype.bestLap = function() {
		if (this.laps.length) {
		//if (this.data.times.length) {
		//	return Math.min.apply(Math, this.laps);
			return this.laps[0];
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
		var bestLap, lastLap;
		if (this.container) {
			bestLap = this.bestLap();
			lastLap = this.lastLap();
			this.container.find('.carNumber').text(this.data.number);
			this.container.find('.nick').text(this.data.nick);
			this.container.find('.personalBest .time').text(this.formatLaptime(bestLap)).toggle(!!bestLap);
			this.container.find('.personalLast .time').text(this.formatLaptime(lastLap)).toggle(!!lastLap);
		}
		return this;
	}

	Driver.prototype.formatLaptime = function(lap) {
		return String('000' + Math.floor(lap)).slice(-3) + '.' + String('00' + (lap * 100 % 100)).slice(-2);
	}

	Driver.prototype.addLap = function(position) {

	}

	Driver.prototype.drawPosition = function(position) {
		this.container.find('.position').text(position + '.');
	}

	Driver.prototype.destroy = function() {

	}

	return Driver;
})();
