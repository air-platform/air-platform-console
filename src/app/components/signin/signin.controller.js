
/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('polly').controller('SigninController', SigninController);

    /** @ngInject */
    function SigninController(LoginServer,logger,toastr,StorageService,$timeout,$state,$rootScope,i18n,$translate) {
        /* jshint validthis: true */
        var vm = this;
        var accessToken = 'polly_access_token';
        var hnaInfo = 'polly.information';
        //语言
        var langChi = '中文';
        var langEng = 'English';
        var userLanguage = window.localStorage.userLanguage;

        vm.user = {username:'',password:''};
        vm.isLogining = false;


        vm.login = loginAction;
        vm.isAdmin = isAdmin;
        vm.logout = logoutAction;
        vm.username = username;

        function loginAction() {

            var param = {username:vm.user.username,password:vm.user.password};

            vm.isLogining = true;
            LoginServer.login(param,function (response) {
                var token = response.data.token;
                StorageService.put(accessToken,token,24 * 3 * 60 * 60);//3 天过期
                logger.info(token);

                LoginServer.info(function (infoResponse) {
                    logger.info(infoResponse.data);
                    var appGo = 'app.agents';
                    if (infoResponse.data.type.toLowerCase() == 'ADMIN'){
                        appGo = 'app.user';
                    }

                    StorageService.put(hnaInfo,infoResponse.data,24 * 3 * 60 * 60);
                    $rootScope.$on('$locationChangeSuccess',function(){//返回前页时，刷新前页
                        parent.location.reload();
                    });

                    $state.go(appGo);

                },function (infoError) {
                    var errInfo = '登录失败：' + infoError.statusText + ' (' + infoError.status +')';
                    toastr.error(errInfo);
                    vm.isLogining = false;
                });


            },function (err) {
                var errInfo = '登录失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
                vm.isLogining = false;
            });

        }
        function username() {
            var information = StorageService.get('polly.information');
            return information.username;
        }
        
        function logoutAction() {
            $timeout(function () {
                StorageService.clear(accessToken);
                StorageService.clear(hnaInfo);
            },60);
            $state.go('access.signin');
        }
        
        
        function isAdmin() {
            return LoginServer.isAdmin();
        }

        //切换语言
        userLanguage == 'zh-cn' ? vm.langChoosen = langChi : vm.langChoosen = langEng
        userLanguage == 'zh-cn' ? vm.langLeft = langEng : vm.langLeft = langChi
        vm.toggleLang = function(lang) {
            vm.langChoosen = (vm.langChoosen == langChi) ? langEng : langChi
            vm.langLeft = (vm.langLeft == langChi) ? langEng : langChi;
            // console.log(lang);
            lang == langEng ? $translate.use('en-us') : $translate.use('zh-cn');
            lang == langEng ? window.localStorage.userLanguage='en-us' :  window.localStorage.userLanguage='zh-cn'
            // window.location.reload();
        }

    }

})();