/**
 *
 * Configuration blocks - get executed during the provider registrations and configuration phase.
 * Only providers and constants can be injected into configuration blocks. This is to
 * prevent accidental instantiation of services before they have been fully configured.
 *
 */

(function () {
    'use strict';

    angular
        .module('airs')
        .config(config);

    /** @ngInject */
    function config($translateProvider,timeAgoSettings, $logProvider, toastrConfig, RestangularProvider,constdata) {
        // Enable log
        $logProvider.debugEnabled(true);

        var BASE_API_URL = constdata.apiHost_ONLINE;
        if (constdata.debugMode){
            BASE_API_URL = constdata.apiHost_OFFLINE;
        }

        // Set options third-party lib of toastr
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = false;
        toastrConfig.progressBar = false;


        // config i18n
        $translateProvider.useStaticFilesLoader({
            prefix: 'locales/',
            suffix: '.json'
        });

        var userLanguage = window.localStorage.userLanguage || navigator.language || navigator.userLanguage;
        // var userLanguage = navigator.language || navigator.userLanguage;
        userLanguage = userLanguage.toLocaleLowerCase();
        if (userLanguage == 'zh-cn'){
            timeAgoSettings.overrideLang = 'zh_CN';
        }else{
            timeAgoSettings.overrideLang = 'en_US';
        }
        $translateProvider.preferredLanguage(userLanguage);
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy(null);
        // window.localStorage.userLanguage = userLanguage;
        //$translateProvider.useLocalStorage();

        // config REST
        RestangularProvider.setBaseUrl(BASE_API_URL);
        RestangularProvider.setDefaultHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });


    }

})();
