MMCLapTimer.Renderer = (function() {
	var Renderer = function(results, options) {
		this.config = $.extend(true, {
			driverTemplate: $('.driverTemplates .practice .driver').clone(),
			container: $('.ranking')
		}, options);

		this.ranking = new MMCLapTimer.Ranking(results);

		this.draw();
	}

	Renderer.prototype.draw = function() {
		var d, container = $('<div>');
		for (d in this.ranking.ranking) {
			container.append(this.ranking.ranking[d].draw().container);
		}
		this.config.container.html(container);
		this.drawPositions().autoSize();
	}

	Renderer.prototype.drawPositions = function() {
		var d, position = 1;
		for (d in this.ranking.ranking) {
			this.ranking.ranking[d].drawPosition(position);
			position++;
		}
		return this;
	}

	Renderer.prototype.autoSize = function() {
		$('.driver').css({fontSize: 'calc(91vh / ' + this.ranking.ranking.length + ')'}).show();
		return this;
	}

	Renderer.prototype.destroy = function() {

	}

	return Renderer;
})();
