/**
 * @constructor
 */
MMCLapTimer.Driver.Rallysprint = MMCLapTimer.Driver.extend((function() {
	var Driver = function RallysprintDriver(results, options) {
		options = options || [];
		this.container = options.container || $('.templates .driver.rallysprint').first().clone();
	}

	Driver.prototype.timeAverage = function() {
		var i,
			n = this.ranking.averageLapsCount();
		sum = 0;
		for (i = 0; i < this.times.length; i++) {
			if (n && i >= n) {
				break;
			}
			sum += this.times[i];
		}
		return i ? (sum / i) : null;
	}

	Driver.prototype.draw = function() {
		var i,
			timesAverage = this.timeAverage(),
			averageTimes = this.averageTimes();
		MMCLapTimer.Driver.prototype.draw.call(this);
		if (timesAverage || averageTimes.length) {
			this.container.find('.nick.bar').remove();
		}
		this.container.find('.personalAverage.bar')
			.toggle(!!timesAverage)
			.find('.time .seconds').html(this.formatLaptime(timesAverage));
		for (i = 0; i < averageTimes.length; i++) {
			this.container.find('.personalTopLaps').append($('<div class="time">').html(averageTimes[i]));
		}
		if (averageTimes.length >= this.ranking.averageLapsCount()) {
			this.container.addClass('qualified');
		}
		return this;
	}

	return Driver;
})());
