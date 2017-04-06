/**
 * Created by Otherplayer on 2016/12/12.
 */

(function () {
    'use strict';


    /**
     *
     * facotry是一个单例,它返回一个包含service成员的对象。
     * 注：所有的Angular services都是单例，这意味着每个injector都只有一个实例化的service。
     *
     */
    angular
        .module('airs')
        .factory('MainServer', MainServer);

    /** @ngInject */
    function MainServer(constdata,NetworkService) {

        var service = {
            jsonQueryStandard: jsonQueryStandard
        };

        return service;

        ////////////
        
        function jsonQueryStandard(param, successHandler, failedHandler) {
            NetworkService.post( constdata.api.query, param, successHandler, failedHandler);
        }
    }


})();
