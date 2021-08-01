/**
 * @constructor
 */
MMCLapTimer.Driver.Groups = MMCLapTimer.Driver.extend((function() {
	var Driver = function GroupsDriver(results, options) {
		options = options || [];
		this.container = options.container || $('.templates .driver.spec').first().clone();
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

	return Driver;
})());
