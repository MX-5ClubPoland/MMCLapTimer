require([
	'jquery',
	'config',
	'app/MMCLapTimer',
	'app/Driver',
	'app/Ranking',
	'app/Spreadsheet',
	'app/Renderer'
], function ($) {

    $(document).ready(function() {
        /* tworzymy obiekt dla zawodow */
        var ulez = new MMCLapTimer.Spreadsheet();

		// Testy jakieśtam...
		//var rendererTest = new MMCLapTimer.Renderer();

		//rendererTest.addDriver({
		//	nick: 'Wolverine',
		//	number: 666,
		//	best: 189.22,
		//	last: 192.33
		//});
		//
		//rendererTest.addDriver({
		//	nick: 'Jarri',
		//	number: 2,
		//	best: 179.04,
		//	last: 179.04
		//});
		//
		//rendererTest.addDriver({
		//	nick: 'Ewelina',
		//	number: 69
		//});
    });
});
