/**
 * app register controller
 */

(function () {
    'use strict';

    angular
        .module('iot')
        .controller('RegisterController', RegisterController)
        .filter('handleState',function() {
        return function(input) {
            var arr = input.split('.');
            var str = arr[arr.length-1];
            var out = str.toUpperCase();
            return out;
        }
    });

    // 用$inject手动添加Angular组件所需的依赖,使用ng-annotate的技术,对依赖关系进行自动化创建安全压缩
    // RegisterController.$inject = ['$location', '$routeParams', 'common', 'dataservice'];
    /* 登录模块 */
    // 自动依赖注入
    /** @ngInject */
    function RegisterController(RegisterService,StorageService,$timeout,$state,constdata,$rootScope,$cookies,$interval,$translate,i18n) {
       /* jshint validthis: true */
        var vm = this;// reg -> ViewModel

        vm.registerText = i18n.t('register.REGISTER');
        vm.isRegistering;
        vm.registerError = null;
        vm.user = {};
        vm.register = register;
        vm.$state = $state;

        //语言
        var langChi = '中文';
        var langEng = 'English';
        var hnaName = 'hna-username';
        var hnaPwd = 'hna-password';
        var hnaInfo = 'iot.hnair.cloud.information';
        var accessToken = 'iot.hnair.cloud.access_token'
        var userLanguage = window.local;Storage.userLanguage;
        var engine = null;


        function register(){
            /* 注册 */
            startRegister();

            RegisterService.post(constdata.api.register.registerPath,vm.user,function(response) {
                console.log("code:"+ response.data.code);
                    if (response.data.code == 0){
                        console.log("code:" + response.data.code);
                        vm.result = response.data.code;
                        vm.message = '恭喜您注册成功！';

                        var timer=$timeout(function(){
                            vm.$state.go('access.signin');
                        },3000);   //该函数延迟3秒执行

                        timer.then(function(){ console.log('创建成功')},
                            function(){ console.log('创建不成功')});
                    }else{
                        vm.result = response.data.code;
                        vm.message = '注册失败！';
                        stopRegister();
                        vm.authError = i18n.t('register.REGISTER_FAILED');
                    }
                },function (response) {
                stopLogin();
                console.log(response);
                if(response.status == '-1'){
                    vm.authError = i18n.t('register.REGISTER_ERROR_SERVER');
                }else if(response.status == '401'){
                    vm.authError = i18n.t('register.REGISTER_ERROR');
                }else if(response.status == '404'){
                    vm.authError = i18n.t('register.REGISTER_ERROR_NO_URER');
                }else{
                    vm.authError = i18n.t('register.REGISTER_FAILED');
                }
                // toastr.error(vm.authError);
            });

        };


        function startRegister() {
            register.isRegistering = true;
            register.registerText = i18n.t('register.REGISTERING');
            engine = $interval(function(){changeRegisterText()},1000);
        }
        function stopRegister() {
            $interval.cancel(engine);
            $timeout.cancel(timer);
            register.isRegistering = false;
            register.registerText = i18n.t('register.REGISTER');;
        }
        function changeRegisterText() {
            if (register.registerText.length === 2){
                register.registerText = i18n.t('register.REGISTERING1');
            }else if(register.registerText.length === 4){
                register.registerText = i18n.t('register.REGISTERING2');
            }else if(register.registerText.length === 5){
                register.registerText = i18n.t('register.REGISTERING');
            }else if(register.registerText.length === 6){
                register.registerText = i18n.t('register.REGISTERING1');
            }
        }


        // $scope.$watch('vm.title', function(current, original) {
        //     $log.info('vm.title was %s', original);
        //     $log.info('vm.title is now %s', current);
        // });
        
    }
})();
