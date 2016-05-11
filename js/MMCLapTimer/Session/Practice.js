MMCLapTimer.Session.Practice = (function() {
	var Practice = function() {
		MMCLapTimer.Session.apply(this, arguments);
	}
	$.extend(Practice.prototype, MMCLapTimer.Session.prototype);

	return Practice;
})();
