/**
 * @constructor
 */
MMCLapTimer.Driver.Rallysprint = MMCLapTimer.Driver.extend((function() {
	var Driver = function RallysprintDriver(results, options) {
		options = options || [];
		this.container = options.container || $('.templates .driver.rallysprint').first().clone();
	}

	Driver.prototype.averageTime = function() {
		var i,
			n = this.ranking.averageLapsCount || 4;
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
		var averageLap = this.averageTime();
			//lastLap = this.lastLap();
		if (!this.container) {
			this.container = $('<div class="driver">');
		}
		this.container.find('.number').text(this.number);
		if (averageLap/* || lastLap*/) {
			this.container.find('.nick.bar').remove();
		}
		this.container.find('.nick').text(this.nick);
		this.container.find('.personalAverage.bar')
			.toggle(!!averageLap)
			.find('.time').html('<i>&Phi;</i> ' + this.formatLaptime(averageLap));
		//this.container.find('.personalLast')
		//	.toggle(!!lastLap)
		//	.find('.time').text(this.formatLaptime(lastLap));
		return this;
	}

	return Driver;
})());
