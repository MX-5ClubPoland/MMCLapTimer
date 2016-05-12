/**
 * @constructor
 * @params {String} token
 * @params {Object} options
 * Options:
 * 	function complete function(isChanged) {...}
 * 	{Session} session
 */
MMCLapTimer.Spreadsheet = (function () {

	var Spreadsheet = function(token, options) {
		options = options || {};
		this.lastModified = null;
		this.token = token;
		this.data = {};
		this.session = options.session || null;

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
				complete.call(that, true);
			}
		});
		return this;
	}

	Spreadsheet.prototype.reload = function(complete) {
		var that = this;
		this.dirtyCheck().done(function(isChanged) {
			if (isChanged) {
				that.load(complete);
			} else if (typeof complete === 'function') {
				complete.call(that, false);
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

	Spreadsheet.prototype.getData = function() {
		return this.data;
	}

	Spreadsheet.prototype.destroy = function() {

	}

	return Spreadsheet;
})();

