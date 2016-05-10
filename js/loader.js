$(document).ready(function () {
	MMCLapTimer.loader = (function loader() {
		var $loader = $('#loadingOverlay');
		var $spinner = $('#spinner');
		var $error = $('#loadingError');

		var show = function show() {
			$error.hide();
			$loader.removeClass('alert').show();
			$spinner.show();
		};

		var hide = function hide() {
			$error.hide();
			$loader.removeClass('alert').hide();
			$spinner.hide();
		};

		var error = function error(message) {
			$spinner.hide();
			$loader.addClass('alert').show();
			$error.text(message).show();	
		};

		return {
			show: show,
			hide: hide,
			error: error
		};
	})();
});