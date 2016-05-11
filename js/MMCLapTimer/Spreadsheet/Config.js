MMCLapTimer.Spreadsheet.Config = (function() {
	var Config = function() {
		MMCLapTimer.Spreadsheet.apply(this, arguments);
	}
	$.extend(Config.prototype, MMCLapTimer.Spreadsheet.prototype);

	Config.prototype.normalize = function(json) {
		var data = {
			sessions: {
				practice: [],
				rallysprint: []
			},
			lapsRaceCount: json[0].gsx$lapsracecount.$t
		};
		$(json).each(function() {
			if (this.gsx$sheetpractice.$t) {
				data.sessions.practice.push(this.gsx$sheetpractice.$t);
			}
		});
		$(json).each(function() {
			if (this.gsx$sheetrace.$t) {
				data.sessions.rallysprint.push(this.gsx$sheetrace.$t);
			}
		});
		return data;
	};

	return Config;
})();
