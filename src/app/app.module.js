(function () {
    'use strict';

    // Declare app level module which depends on views, and components
    angular
        .module('iot', [
        /* Angular Modules */
        'ngAnimate',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'ngMessages',
        'ngAria',
        'ngRoute',
        /* 3rd-Party Modules */
        'ui.bootstrap',
        'ui.router',
        'ui.bootstrap.tpls',
        'ui.jq',
        'ui.load',

        'toastr',
        'pascalprecht.translate',
        'restangular',
        'smart-table',
        'iot.ui.directives',
        'xeditable',
        'easypiechart',
        'ui.calendar',
        'angularSpinner',
            'ui.bootstrap-slider'
    ]);

})();
