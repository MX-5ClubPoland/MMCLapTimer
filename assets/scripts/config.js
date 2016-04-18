/* config - wszystkie informacje dotyczace akruszy dla zawodow */

var interval = 3; // co ile sekund odpytywac api

/* arkusze sesji - implemntacja funkcjonalnosci w nowej wersji */
var spreadsheetIDs = [
    {
        id: '14czTfhE5YJrPSVlYk5huK1S6PKFJOtI4WeW_1H3TOC0',
        type: 0, // 0 = practice, race = 1,
        sessionName: 'Ułęż Trening 1'
    },
    {
        id: '14czTfhE5YJrPSVlYk5huK1S6PKFJOtI4WeW_1H3TOC0',
        type: 0, // 0 = practice, race = 1,
        sessionName: 'Ułęż Trening 2'
    },
    {
        id: '14czTfhE5YJrPSVlYk5huK1S6PKFJOtI4WeW_1H3TOC0',
        type: 1, // 0 = practice, race = 1,
        sessionName: 'Ułęż Rallysprint'
    }
];

var spreadsheetID = "14czTfhE5YJrPSVlYk5huK1S6PKFJOtI4WeW_1H3TOC0"; // tylko identyfikator do dokumentu na google docs, z linku przy opcji udosteniania - do usuniecia w nowszej wersji
