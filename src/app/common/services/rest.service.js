 (function () {
    'use strict';

     /** RestService */
    angular
        .module('airs')
        .factory('RestService', RestService);

    // REST service based on Restangular  that uses setFullResponse
    /** @ngInject */
    function RestService(Restangular, StorageService,logger) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            var token = StorageService.get('airspc_access_token');
            if (token){
                logger.debug(token);
                // $http.defaults.headers.common['Authorization'] = token;
                token = 'Bearer ' + token;
                RestangularConfigurer.setDefaultHeaders({Authorization:token});
            }else{
                RestangularConfigurer.setDefaultHeaders({Authorization:null});
            }
            RestangularConfigurer.setFullResponse(true);
        });
    }

    /** NetworkService */
    angular
        .module('airs')
        .factory('NetworkService', NetworkService);

    /** @ngInject */
    function NetworkService(RestService,StorageService,logger) {


        var service = {
            post  : post,
            get   : get,
            put   : put,
            delete: del
        };

        return service;

        /////////////////

        function post(path,body,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customPOST(body).then(
                successHandler,function (response) {
                    failedResponse(response,failedHandler,path);
                }
            );
        }

        function get(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            var token = StorageService.get('airspc_access_token');
            token = 'Bearer ' + token;
            account.customGET("",param,{Authorization:token}).then(successHandler,function (response) {
                failedResponse(response,failedHandler,path);
            });
        }
        
        function put(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customPUT(param).then(successHandler,function (response) {
                failedResponse(response,failedHandler,path);
            });
        }
        function del(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customDELETE().then(successHandler,function (response) {
                console.log('delete failed');
                failedResponse(response,failedHandler,path);
            });
        }

        function failedResponse(response,failedHandler,path) {

            logger.info('-------' + path + '---------');
            logger.error(response);


            var newResponse = {};
            newResponse.status = response.status;
            if (response.data && response.data.message){
                newResponse.statusText = response.data.message;
            }else{
                newResponse.statusText = '服务器连接错误';
            }
            if (response.status == 401){
                if (path != 'account/auth'){
                    if (failedHandler){
                        failedHandler(newResponse);
                    }
                }else{
                    if (failedHandler){
                        failedHandler(newResponse);
                    }
                }
            }else{
                if (failedHandler){
                    failedHandler(newResponse);
                }
            }
        }

    }


    /** StorageService */
    angular
        .module('airs')
        .service('StorageService', StorageService);

    /** @ngInject */
    function StorageService() {

        this.put=function (key,value,exp) {
            if(window.localStorage){
                var curtime = new Date().getTime();//获取当前时间
                if(!exp){
                    exp = 0;
                }
                localStorage.setItem(key,JSON.stringify({val:value,time:curtime,exp:exp}));//转换成json字符串序列
            }else{
                console.log('This browser does NOT support localStorage');
            }
        };
        this.get=function (key) {
            if(window.localStorage){
                var val = localStorage.getItem(key);
                if (!val) return null;
                var dataobj = JSON.parse(val);

                if (!dataobj) return null;

                if((dataobj.exp !== 0) && (new Date().getTime() - dataobj.time > dataobj.exp * 1000)) {
                    console.log("expires");//过期
                    return null;
                }
                else{
                    //console.log("val="+dataobj.val);
                    return dataobj.val;
                }

            }else{
                console.log('This browser does NOT support localStorage');
                return null;
            }
        };

        this.clear = function (key) {
            localStorage.removeItem(key);
        };

        this.remove = function (key) {
            localStorage.removeItem(key);
        };

        this.item = function (key,value) {
            if (value){
                this.put(key,value,60 * 60);
            }
            var val = this.getItem(key);
            return val;
        };
        this.getItem = function (key) {
            var val = this.get(key);
            return val;
        };

    }






     /**
      *
      * facotry是一个单例,它返回一个包含service成员的对象。
      * 注：所有的Angular services都是单例，这意味着每个injector都只有一个实例化的service。
      *
      */
     angular
         .module('airs')
         .factory('UserInfoServer', UserInfoServer);

     /** @ngInject */
     function UserInfoServer(constdata,StorageService) {


         var service = {
             tenantName: tenantName
         };

         return service;

         ////////////

         function tenantName() {
             /* 获取租房name */
             var tenant = localStorage.getItem(constdata.tenant);
             var prefix = '';
             if (tenant && tenant.length > 0) {
                 prefix = 'tenant-' + tenant;
             } else {
                 var information = StorageService.get('airspc.information');
                 if (information && information.name) {
                     prefix = information.username;
                 }
             }
             return prefix;
         }
     }





})();
