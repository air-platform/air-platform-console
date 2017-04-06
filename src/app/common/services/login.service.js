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
    .factory('LoginServer', LoginServer);

/** @ngInject */
function LoginServer(constdata,NetworkService,StorageService) {


    var service = {
        login: login,
        info: info,
        isAuthed:isAuthed,
        isAdmin:isAdmin
    };

    return service;

    ////////////

    function login(param,successHandler,failedHandler) {
        NetworkService.post(constdata.api.account.auth,param,successHandler,failedHandler);
    }
    function info(successHandler,failedHandler) {
        NetworkService.get(constdata.api.account.info,null,successHandler,failedHandler);
    }
    function isAuthed() {
        return true;
        var token = StorageService.get('airspc_access_token');
        if (token && token.length > 0){
            return true;
        }
        return false;
    }
    function isAdmin() {
        return false;
        // "ADMIN"; "TENANT"; "USER";
        var information = StorageService.get('airspc.information');
        if (information && information.type.toUpperCase() == 'ADMIN'){
            return true;
        } else {
            return false;
        }
    }
}





})();
