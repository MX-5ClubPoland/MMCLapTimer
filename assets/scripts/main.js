require(['jquery'], function ($) {
    
    $(document).ready(function(){

        function Spreadsheet(spreadsheetID) {
            this.spreadsheetID = spreadsheetID;
            this.init();
        }

        Spreadsheet.prototype.init = function(){
            this.runs = 8; // maskymalna ilość kółek pomiarowych

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

        /* tworzymy obiekt dla sesji treningowej lub rallysprint */

        var spreadsheetID = "14czTfhE5YJrPSVlYk5huK1S6PKFJOtI4WeW_1H3TOC0"; // tylko identyfikator do dokumentu na google docs, z linku przy opcji udosteniania

        var rallysprint = new Spreadsheet(spreadsheetID);

        rallysprint.getJSON().done(function (data) {

            var results = rallysprint.normalize(data);
            console.log(results);

        });
    });
});
