/**
 * @constructor
 * @params {String} token
 * @params {Object} options
 * Options:
 * 	function complete function(data) {...}
 * 	{Session} session
 */
MMCLapTimer.Spreadsheet = (function () {
	var spreadsheetRequest;
	var headersRequest;	

	var Spreadsheet = function(token, options) {
		options = options || {};
		this.lastModified = null;
		this.token = token;
		this.session = options.session || null;
		this.data = null;

		if (this.token && options.complete) {
			this.load(options.complete);
		}
	};

	Spreadsheet.prototype.url = function() {
		return 'https://spreadsheets.google.com/feeds/list/' + this.token + '/od6/public/values?alt=json';
	}

	Spreadsheet.prototype.load = function(complete) {
		var that = this;
		this.getJSON(this.token)
			.done(function(data) {
				that.data = that.normalize(data);
				if (typeof complete === 'function') {
					complete.call(that, that.data);
				}
			})
			.fail(function() {
				if (typeof complete === 'function') {
					complete.call(that);
				}
			});
		return this;
	}

	Spreadsheet.prototype.reloadIfChanged = function(complete) {
		var that = this;
		this.dirtyCheck()
			.done(function(isChanged) {
				if (isChanged) {
					that.load(complete);
				} else if (typeof complete === 'function') {
					complete.call(that);
				}
			})
			.fail(function() {
				if (typeof complete === 'function') {
					complete.call(that);
				}
			});
		return this;
	}

	Spreadsheet.prototype.getData = function(json) {
		return this.data;
	}

	Spreadsheet.prototype.normalize = function(json) {
		return json;
	};

	/* Sprawdzanie czy last-modified header się zmienił */
	Spreadsheet.prototype.dirtyCheck = function dirtyCheck() {
		var _this = this;
		var dff = $.Deferred();

		headersRequest = $.ajax({
			url: this.url(),
			type: 'HEAD'
		});

		headersRequest.then(
			function onSuccess(data, textStatus, request) {
				if (!_this.lastModified || _this.lastModified < request.getResponseHeader('last-modified')) {
					dff.resolve(true);
				} else {
					dff.resolve(false);
				}
			},
			function onError(error) {
				dff.reject(error);
			}
		);

		return dff.promise();
	};

	/* pobranie jsona z google docs - surowy */
	Spreadsheet.prototype.getJSON = function() {
		var _this = this;
		var dff = $.Deferred();

		spreadsheetRequest = $.ajax({
			url: this.url()
		});

		spreadsheetRequest.then(
			function onSuccess(data, textStatus, request) {
				_this.lastModified = request.getResponseHeader('last-modified');
				dff.resolve(data.feed.entry);

			},
			function onError(error) {
				dff.reject(error);
			}
		);

		return dff.promise();
	};

	Spreadsheet.prototype.destroy = function() {
		if (typeof headersRequest !== 'undefined' && typeof headersRequest.abort === 'function') {
			headersRequest.abort();
		}
		if (typeof spreadsheetRequest !== 'undefined' && typeof spreadsheetRequest.abort === 'function') {
			spreadsheetRequest.abort();
		}
		delete this.session;
		delete this.data;
	}

	return Spreadsheet;
})();

