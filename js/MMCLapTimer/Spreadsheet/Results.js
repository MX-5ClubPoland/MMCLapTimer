MMCLapTimer.Spreadsheet.Results = (function() {
	var Results= function() {
		MMCLapTimer.Spreadsheet.apply(this, arguments);
	}
	$.extend(Results.prototype, MMCLapTimer.Spreadsheet.prototype);

	Results.prototype.normalize = function(json) {

		/* wyciaga z jsona czasy kolek i tworzy oddzielna tablice */
		this.getTimes = function(object) {

			var times = [];

			/* po kolei kazde kolko z limitem prob ustalonym na konstruktorze this.runs */
			for (i = 1; i < 100; i++) {
				if (object['gsx$pomiar' + i] === undefined) {
					break;
				}
				var time = object['gsx$pomiar' + i].$t.trim();

				if (time.toLowerCase() == 'x') {
					/* jezeli czas jest rowny x to wstawia null */
					times.push(null);
				} else if (time != '') {
					times.push(parseFloat(time).toFixed(2));
				}
			}
			return times;
		};

		/* generujemy docelowy JSON */
		this.generateJson = function() {
			var _res = new Array(),
				_this = this;

			$(json).each(function() {
				_res.push({
					number: parseInt(this.gsx$numer.$t),
					name: this.gsx$imie.$t,
					nick: this.gsx$nick.$t,
					model: this.gsx$model.$t,
					category: parseInt(this.gsx$kategoria.$t),
					times: _this.getTimes(this)
				});
			});

			return _res;
		};

		return this.generateJson();
	};

	return Results;
})();
