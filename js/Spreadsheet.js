/**
 * @constructor
 * Options:
 * 	complete
 */
MMCLapTimer.Spreadsheet = (function () {

	var Spreadsheet = function(token, options) {
		options = options || {};
		this.lastModified = null;
		this.token = token;
		this.data = {};

		if (this.token && options.complete) {
			this.load(options.complete);
		}
	};

	Spreadsheet.prototype.url = function() {
		return 'https://spreadsheets.google.com/feeds/list/' + this.token + '/od6/public/values?alt=json';
	}

	Spreadsheet.prototype.load = function(complete) {
		var that = this;
		this.getJSON(this.token).done(function(data) {
			that.data = that.normalize(data);
			if (typeof complete === 'function') {
				complete.call(that);
			}
		});
		return this;
	}

	Spreadsheet.prototype.reload = function(complete) {
		var that = this;
		this.dirtyCheck().done(function(isChanged) {
			if (isChanged) {
				that.load();
			}
		});
		return this;
	}

	//Spreadsheet.prototype.init = function() {
	//	var _this = this;
	//
	//	this.refreshConfig();
	//
	//	setInterval(function configInterval() {
	//		_this.dirtyCheck(_this.configSheetToken).done(function dirtyCheckCb(isChanged) {
	//			if (isChanged) {
	//				_this.refreshConfig();
	//			}
	//		});
	//	}, config.refreshTimes.config * config.refreshTimes.results * 1000);
	//
	//	setInterval(function dataInterval() {
	//		_this.dirtyCheck(_this.config.sheetPractice[0], _this.lastModified).done(function dirtyCheckCb(isChanged) {
	//			if (isChanged) {
	//				_this.refresh();
	//			}
	//		});
	//	}, config.refreshTimes.results * 1000);
	//};

	Spreadsheet.prototype.normalize = function(json) {
		return json;
	};

	/* Sprawdzanie czy last-modified header się zmienił */
	Spreadsheet.prototype.dirtyCheck = function dirtyCheck() {
		var _this = this;
		var dff = $.Deferred();

		var ajaxPromise = $.ajax({
			url: this.url(),
			type: 'HEAD'
		});

		ajaxPromise.then(function onSuccess(data, textStatus, request) {
			if (!_this.lastModified || _this.lastModified < request.getResponseHeader('last-modified')) {
				dff.resolve(true);
			} else {
				dff.resolve(false);
			}
		}, function onError(error) {
			dff.reject(error);
		});

		return dff.promise();
	};

	/* pobranie jsona z google docs - surowy */
	Spreadsheet.prototype.getJSON = function() {
		var _this = this;
		var dff = $.Deferred();

		var ajaxPromise = $.ajax({
			url: this.url()
		});

		ajaxPromise.then(function(data, textStatus, request) {
			_this.lastModified = request.getResponseHeader('last-modified');
			dff.resolve(data.feed.entry);

		}, function(error) {
			dff.reject(error);
		});

		return dff.promise();
	};

	Spreadsheet.prototype.destroy = function() {

	}

	return Spreadsheet;
})();


MMCLapTimer.ConfigSpreadsheet = (function() {
	var ConfigSpreadsheet = function() {
		MMCLapTimer.Spreadsheet.apply(this, arguments);
	}
	$.extend(ConfigSpreadsheet.prototype, MMCLapTimer.Spreadsheet.prototype);

	ConfigSpreadsheet.prototype.normalize = function(json) {
		var data = {
			sheetRace: [],
			sheetPractice: [],
			lapsRaceCount: json[0].gsx$lapsracecount.$t
		};
		$(json).each(function() {
			if (this.gsx$sheetrace.$t) {
				data.sheetRace.push(this.gsx$sheetrace.$t);
			}
		});
		$(json).each(function() {
			if (this.gsx$sheetpractice.$t) {
				data.sheetPractice.push(this.gsx$sheetpractice.$t);
			}
		});
		return data;
	};

	return ConfigSpreadsheet;
})();

MMCLapTimer.ResultsSpreadsheet = (function() {
	var ResultsSpreadsheet = function() {
		MMCLapTimer.Spreadsheet.apply(this, arguments);
	}
	$.extend(ResultsSpreadsheet.prototype, MMCLapTimer.Spreadsheet.prototype);

	ResultsSpreadsheet.prototype.normalize = function(json) {

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

	return ResultsSpreadsheet;
})();
