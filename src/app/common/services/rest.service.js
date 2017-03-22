 (function () {
    'use strict';

     /** RestService */
    angular
        .module('iot')
        .factory('RestService', RestService);

    // REST service based on Restangular  that uses setFullResponse
    /** @ngInject */
    function RestService(Restangular, StorageService,logger) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            var token = StorageService.get('iot.hnair.cloud.access_token');
            if (token){
                logger.debug(token);
                // $http.defaults.headers.common['Authorization'] = token;
                //token = 'Bearer ' + token;

                RestangularConfigurer.setDefaultHeaders({UserName:token});
            }else{
                RestangularConfigurer.setDefaultHeaders({UserName:null});
            }
            RestangularConfigurer.setFullResponse(true);
        });
    }

    /** NetworkService */
    angular
        .module('iot')
        .factory('NetworkService', NetworkService);

    /** @ngInject */
    function NetworkService($state,RestService,toastr,StorageService,constdata,logger) {


        var service = {
            post  : post,
            get   : get,
            put   : put,
            delete: del
        };

        return service;

        /////////////////

        function post(path,body,successHandler,failedHandler) {
            path = checkPath(path);
            var account = RestService.one(path);
            account.customPOST(body).then(
                successHandler,function (response) {
                    failedResponse(response,failedHandler,path);
                }
            );
        };

        function get(path,param,successHandler,failedHandler) {
            path = checkPath(path);
            var account = RestService.one(path);
            var token = StorageService.get('iot.hnair.cloud.access_token');
            token = 'Bearer ' + token;
            account.customGET("",param,{Authorization:token}).then(successHandler,function (response) {
                failedResponse(response,failedHandler,path);
            });
        };
        
        function put(path,param,successHandler,failedHandler) {
            path = checkPath(path);
            var account = RestService.one(path);
            account.customPUT(param).then(successHandler,function (response) {
                failedResponse(response,failedHandler,path);
            });
        };
        function del(path,param,successHandler,failedHandler) {
            path = checkPath(path);
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
                    gotologin();
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

        function gotologin() {
            StorageService.clear('iot.hnair.cloud.access_token');
            StorageService.clear('iot.hnair.cloud.information');
            toastr.error('获取授权信息失败!');
            $state.go('access.signin');
        };

        /** 管理员与租户接口差别只在接口路径 */
        function checkPath(pathStr) {
            var newpath = pathStr;
            if (isAdminer()){
                var pattern = /^(tenants|metrics)/;
                var tenant = localStorage.getItem(constdata.tenant);
                if (pattern.test(newpath)){
                    var pattern2 = /^(metrics)/;
                    if (pattern2.test(newpath) && tenant && tenant.length > 0){
                        newpath = 'platform/tenants/' + tenant + '/' + pathStr;
                    }else{
                        newpath = 'platform/' + pathStr;
                        localStorage.removeItem(constdata.tenant);
                    }
                }else{
                    if (tenant && tenant.length > 0){
                        newpath = 'platform/tenants/' + tenant + '/' + pathStr;
                    }else{
                        newpath = 'platform/' + pathStr;
                    }
                }
            }
            return newpath;
        }

        function isAdminer() {
            // "ADMIN"; "TENANT"; "USER";
            var info = StorageService.get('iot.hnair.cloud.information');
            if (info && info.type.toUpperCase() == 'USER'){
                return true;
            }
            return false;
        }


    }

     /** LoginService */
     angular
         .module('iot')
         .factory('LoginService', LoginService);

     /** @ngInject */
     function LoginService(RestService,StorageService,constdata) {

         var service = {
            post: post,
             get: get,
             put: put
         };

         return service;

         ////////////

         function post(path,body,action,successHandler,failedHandler) {
             var formdata = new FormData();
             if(action == '1') {
                 formdata.append('name', body.username);
                 formdata.append('password', body.password);
             }else{
                 formdata.append('name', body.username);
             }

             var reg = RestService.one(path);
             reg.customPOST(formdata, undefined, undefined, { 'Content-Type': undefined }).then(
                 successHandler,function (response) {
                     failedResponse(response,failedHandler,path);
                 }
             );
         };

         function get(path,param,token,successHandler,failedHandler) {
             var account = RestService.one(path);
             if (token != 'undefined'){
             }else{
                 token = StorageService.get('iot.hnair.cloud.access_token');
             }

             account.customGET("",param,{UserName:token}).then(successHandler,function (response) {
                 failedResponse(response,failedHandler,path);
             });
         };

         function put(path,param,successHandler,failedHandler) {
             var account = RestService.one(path);
             account.customPUT(param).then(successHandler,function (response) {
                 failedResponse(response,failedHandler,path);
             });
         };

         function failedResponse(response,failedHandler,path) {
             if (constdata.debugMode){
                 console.log('failed----' + path);
                 console.log(response);
             }
             var newResponse = {};
             newResponse.status = response.status;
             if (response.data && response.data.message){
                 newResponse.statusText = response.data.message;
             }else{
                 newResponse.statusText = '服务器连接错误';
             }
             if (failedHandler){
                 failedHandler(newResponse);
             }
         }

     }


     /** RegisterService */
     angular
         .module('iot')
         .factory('RegisterService', RegisterService);

     /** @ngInject */
     function RegisterService(RestService,StorageService,constdata) {

         var service = {
             post: post,
         };

         return service;

         ////////////

         function post(path,body,successHandler,failedHandler) {
             var formdata = new FormData();
             formdata.append('email',body.email);
             formdata.append('phone',body.phone);
             formdata.append('name',body.name);
             formdata.append('password',body.password);

             var reg = RestService.one(path);
             reg.customPOST(formdata, undefined, undefined, { 'Content-Type': undefined }).then(
                 successHandler,function (response) {
                     failedResponse(response,failedHandler,path);
                 }
             );

         };

         function failedResponse(response,failedHandler,path) {
             if (constdata.debugMode){
                 console.log('failed----' + path);
                 console.log(response);
             }
             var newResponse = {};
             newResponse.status = response.status;
             if (response.data && response.data.message){
                 newResponse.statusText = response.data.message;
             }else{
                 newResponse.statusText = '服务器连接错误';
             }
             if (failedHandler){
                 failedHandler(newResponse);
             }
         }

     }


    /** StorageService */
    angular
        .module('iot')
        .service('StorageService', StorageService);

    /** @ngInject */
    function StorageService() {

        this.put=function (key,value,exp) {
            console.log("key",key);
            if(window.localStorage){
                var curtime = new Date().getTime();//获取当前时间
                if(!exp){
                    exp = 0;
                }
                localStorage.setItem(key,JSON.stringify({val:value,time:curtime,exp:exp}));//转换成json字符串序列
            }else{
                console.log('This browser does NOT support localStorage');
            }
        }
        this.get=function (key) {
            if(window.localStorage){
                var val = localStorage.getItem(key);
                if (!val) return null;
                var dataobj = JSON.parse(val);

                if (!dataobj) return null;

                if((dataobj.exp != 0) && (new Date().getTime() - dataobj.time > dataobj.exp * 1000)) {
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
        }

        this.clear = function (key) {
            localStorage.removeItem(key);
        }

        this.remove = function (key) {
            localStorage.removeItem(key);
        }

        this.item = function (key,value) {
            if (value){
                this.put(key,value,60 * 60);
            }
            var val = this.getItem(key);
            return val;
        }
        this.getItem = function (key) {
            var val = this.get(key);
            return val;
        }

    }


     angular
         .module('iot')
         .provider('unicornLauncher', unicornLauncher);
     // REST service based on Restangular  that uses setFullResponse
     /** @ngInject */
     function unicornLauncher(constdata) {
         this.username = function() {
             var val = localStorage.getItem('iot.hnair.cloud.information');
             if (val){
                 // var dataobj = JSON.parse(val);
                 // var role = dataobj.val.roles[0];
                 // if (role.toLowerCase() == 'admin'){
                 //     return 'admin';
                 // }else{
                 //     return 'tenant';
                 // }
                 return 'user';
             }
             return '';
         };
         this.$get = ["apiToken", function unicornLauncherFactory() {
             // return new UnicornLauncher(apiToken, useTinfoilShielding);
         }];
     }



     // GetTenant Name start
     /**
      *
      * facotry是一个单例,它返回一个包含service成员的对象。
      * 注：所有的Angular services都是单例，这意味着每个injector都只有一个实例化的service。
      *
      */
     angular
         .module('iot')
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
                 var information = StorageService.get('iot.hnair.cloud.information');
                 if (information && information.name) {
                     prefix = information.username;
                 }
             }
             return prefix;
         }
     }



     angular
         .module('iot')
         .service('EventDataShareServer', EventDataShareServer);

     /** @ngInject */
     function EventDataShareServer(StorageService) {

         // var information = StorageService.get('iot.hnair.cloud.information');
         return {

             // namespace:'com.hnair.iot.client.' + information.username +'.event',
             eventId:'',
             eventClasses:[],
             eventClass:{},
             isEditMode:-1,
             navStepTitles:[{name:'事件集',index:0}],
             navStepIndex:0

         }
     }

})();
