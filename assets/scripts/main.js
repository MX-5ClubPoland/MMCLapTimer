require(['jquery', 'config'], function ($) {

    $(document).ready(function(){

        function Spreadsheet() {
            this.configSheet = config.configSheet;
            this.config = {};
            this.results = new Array();
            this.resultsPractice = new Array();
            this.init();
        }

        Spreadsheet.prototype.init = function(){
            var _this = this;

            /* pobieranie konfigu */
            _this.getJSON(this.configSheet).done(function (data) {
                _this.config = _this.normalizeConfig(data);

                _this.refreshData();
            });
        };

        /* pobranie jsona z google docs - surowy */
        Spreadsheet.prototype.getJSON = function (sheetToken) {

            var url = "https://spreadsheets.google.com/feeds/list/" + sheetToken + "/od6/public/values?alt=json";
            var dff = $.Deferred();

            var ajaxPromise = $.ajax(
                {
                    url: url
                }
            );

            ajaxPromise.then(function (data) {

                dff.resolve(data.feed.entry);

            }, function (error) {
                dff.reject(error);
            });

            return dff.promise();
        };

        /* pobieranie arkusza konfiguracji */
        Spreadsheet.prototype.refreshConfig = function (data) {
            var _this = this;

            _this.getJSON(_this.configSheet).done(function (data) {

                _this.config = _this.normalizeConfig(data);

                console.log(_this.config);
            });
        };

        /* normalizacja konfiguracji */
        Spreadsheet.prototype.normalizeConfig = function (json) {

            var _config = {
                sheetRace: json[0].gsx$sheetrace.$t,
                sheetPractice: [],
                lapsPractice: json[0].gsx$lapspractice.$t,
                lapsRace: json[0].gsx$lapsrace.$t,
                lapsRaceCount: json[0].gsx$lapsracecount.$t
            };

            $(json).each(function () {
                _config.sheetPractice.push(this.gsx$sheetpractice.$t);
            });

            return _config;
        };

        /* normalizacja surowego jsona do czytelnego formatu */
        Spreadsheet.prototype.normalizeResults = function (json) {

            /* wyciaga z jsona czasy kolek i tworzy oddzielna tablice */
            this.getTimes = function (object) {

                var times = new Array();

                /* po kolei kazde kolko z limitem prob ustalonym na konstruktorze this.runs */
                for (i = 0; i < this.config.lapsPractice; i++) {
                    var j = i + 1,
                        time = eval('object.gsx$pomiar' + j).$t.trim();

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
            this.generateJson = function () {
                var _res = new Array(),
                    _this = this;

                $(json).each(function () {
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

        /* metoda do pobierania nowych danych z api */
        Spreadsheet.prototype.refreshData = function () {
            var _this = this;

            _this.getJSON(_this.config.sheetPractice[0]).done(function (data) {
                _this.results = _this.normalizeResults(data);
                _this.refreshView();
            });


        };

        /* metoda do odsiwezania widoku */
        Spreadsheet.prototype.refreshView = function () {
            $('body').addClass('ready'); // dodaje do body klase, po to, aby dopiero wyswietlic strone po zaladowaniu rezultatow - preloader

            /* miejsce na czary zwiazane z renderem widoku */
            console.log(this.results);
        };

        /* tworzymy obiekt dla zawodow */
        var ulez = new Spreadsheet();

        /* odsiwiezenie rezultatow */
        setInterval(function(){
            ulez.refreshData();

        }, config.refreshTimes.results * 1000);

        /* odswiezenie konfiguracji */
        setInterval(function () {
            ulez.refreshConfig();
        }, config.refreshTimes.config * config.refreshTimes.results * 1000)
    });
});
