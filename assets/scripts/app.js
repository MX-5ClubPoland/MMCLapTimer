requirejs.config({
    baseUrl: 'bower_components/',
    paths: {
        jquery: 'jquery/dist/jquery.min',
        main: '../assets/scripts/main'
    }
});

require(['main']);