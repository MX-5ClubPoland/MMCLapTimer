require(['jquery', 'config'], function ($) {

    $(document).ready(function(){

        function Spreadsheet(spreadsheetID) {
            this.spreadsheetID = spreadsheetID;
            this.runs = 8; // maskymalna ilość kółek pomiarowych - ilosc kolumn 'Pomiar'
            this.results = new Array();
            this.init();
        }

        Spreadsheet.prototype.init = function(){
            this.refreshData();
        };

        /* pobranie jsona z google docs - surowy */
        Spreadsheet.prototype.getJSON = function () {

            var url = "https://spreadsheets.google.com/feeds/list/" + this.spreadsheetID + "/od6/public/values?alt=json";
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

        /* normalizacja surowego jsona do czytelnego formatu */
        Spreadsheet.prototype.normalize = function (json) {

            /* wyciaga z jsona czasy kolek i tworzy oddzielna tablice */
            this.getTimes = function (object) {

                var times = new Array();

                /* po kolei kazde kolko z limitem prob ustalonym na konstruktorze this.runs */
                for (i = 0; i < this.runs; i++) {
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

            _this.getJSON().done(function (data) {
                _this.results = _this.normalize(data);
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
        var ulez = new Spreadsheet(spreadsheetID);

        setInterval(function(){
            ulez.refreshData();
        }, interval * 1000);
    });
});
