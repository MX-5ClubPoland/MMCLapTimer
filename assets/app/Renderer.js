MMCLapTimer.Renderer = (function() {
	var Renderer = function(options) {
		this.config = $.extend(true, {
			rankingContainer: $('.ranking'),
			driverTemplate: $('.driverTemplate:first .driver').clone()
		}, options);

		this.drivers = [];
	}

	Renderer.prototype.addDriver = function(driver) {
		this.draw(driver);
		this.config.rankingContainer.append(driver.container);
		this.drivers.push(driver);
		return this;
	}

	Renderer.prototype.draw = function(driver) {
		if (!driver.container) {
			driver.container = this.config.driverTemplate.clone();
		}
		driver.container.find('.carNumber').text(driver.number);
		driver.container.find('.nick').text(driver.nick);
		driver.container.find('.personalBest .time').text(driver.best).toggle(!!driver.best);
		driver.container.find('.personalLast .time').text(driver.last).toggle(!!driver.last);
		this.drawPositions();
	}

	Renderer.prototype.drawPositions = function() {
		var i;
		for (i in this.drivers) {
			this.drivers[i].container.find('.position').text((i + 1) + '.');
		}
	}

	return Renderer;
})();
