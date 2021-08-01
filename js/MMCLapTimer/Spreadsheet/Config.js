MMCLapTimer.Spreadsheet.Config = (function() {
	var Config = function() {
		MMCLapTimer.Spreadsheet.apply(this, arguments);
	}
	$.extend(Config.prototype, MMCLapTimer.Spreadsheet.prototype);

	Config.prototype.normalize = function(json) {
		var data = {
			sessions: {
				practice: [],
				rallysprint: [],
				sideclasses: [],
				groups: [],
				openclasses: []
			},
			lapsRaceCount: json[0].gsx$settingsvalues.$t,
			minimumLapTime: json[1].gsx$settingsvalues.$t,
			maximumLapTime: json[2].gsx$settingsvalues.$t,
			sheetRefreshInterval: json[3].gsx$settingsvalues.$t,
			resultsLocalDbName: json[4].gsx$settingsvalues.$t,
			resultsRemoteDbUrl: json[5].gsx$settingsvalues.$t,
			rotateLayersDuration: json[6].gsx$settingsvalues.$t
		};

		$(json).each(function() {
			if (this.gsx$sheetpractice.$t) {
				data.sessions.practice.push(this.gsx$sheetpractice.$t);
			}
		});
		$(json).each(function() {
			if (this.gsx$sheetrace.$t) {
				data.sessions.rallysprint.push(this.gsx$sheetrace.$t);
				data.sessions.sideclasses.push(this.gsx$sheetrace.$t);
				data.sessions.groups.push(this.gsx$sheetrace.$t);
				data.sessions.openclasses.push(this.gsx$sheetrace.$t);
			}
		});
		return data;
	};

	return Config;
})();
