/**
 * Created by Otherplayer on 2016/11/9.
 */
(function () {

    /**
     * 过滤器:国际化
     *
     */
    angular
        .module("iot")
        .filter("T", T);

    /** @ngInject */
    function T($translate) {
        return function(key) {
            if(key){
                return $translate.instant(key);
            }
            return key;
        };
    }


    /**
     * 服务:国际化
     *
     */
    angular
        .module("iot")
        .factory("i18n", i18n);

    /** @ngInject */
    function i18n($translate) {
        var service = {
                 t: translate,
            value : translate
        };
        return service;

        ////////////////////

        function translate(key) {
            if(key){
                return $translate.instant(key);
            }
            return key;
        };
    };






})();