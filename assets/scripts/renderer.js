var Renderer = function(options) {

	this.config = $.extend(true, {
		rankingContainer: $('.ranking'),
		driverTemplate: $('.driverTemplate:first .driver').clone()
	}, options);
}

Renderer.prototype.addDriver = function(driver) {
	driver.container = this.config.driverTemplate.clone();
	this.updateDriver(driver);
	this.config.rankingContainer.append(driver.container);
	return this;
}

Renderer.prototype.updateDriver = function(driver) {
	driver.container.find('.carNumber').text(driver.number);
	driver.container.find('.nick').text(driver.nick);
	driver.container.find('.personalBest .time').text(driver.best).toggle(!!driver.best);
	driver.container.find('.personalLast .time').text(driver.last).toggle(!!driver.last);
}

var r = new Renderer();

r.addDriver({
	nick: 'Wolverine',
	number: 666,
	best: 189.22,
	last: 192.33
});

r.addDriver({
	nick: 'Jarri',
	number: 2,
	best: 179.04,
	last: 179.04
});

r.addDriver({
	nick: 'Ewelina',
	number: 69
});
