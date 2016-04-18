requirejs.config({
    baseUrl: 'bower_components/',
    paths: {
        jquery: 'jquery/dist/jquery.min',
        config: '../assets/scripts/config',
        main: '../assets/scripts/main'
    }
});

require(['main']);