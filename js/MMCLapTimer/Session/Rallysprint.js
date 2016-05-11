MMCLapTimer.Session.Rallysprint = (function() {
	var Rallysprint = function() {
		MMCLapTimer.Session.apply(this, arguments);
	}
	$.extend(Rallysprint.prototype, MMCLapTimer.Session.prototype);

	return Rallysprint;
})();
