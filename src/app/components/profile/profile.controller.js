/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('iot').controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($rootScope,$stateParams,$state, LoginService,NetworkService,constdata,toastr,i18n,StorageService) {
        /* jshint validthis: true */
        var vm = this;

        vm.newpassword = null;
        vm.confirm_password = null;
        vm.password = null;
        vm.editing = false;

        vm.userinfo = {};


        vm.editItem = editItem;
        vm.doneEditing = doneEditing;
        vm.changePsd = changePsd;

        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.isAdmin = true;
        }



        getProfile();

        vm.uploadFile = function (){
            vm.showSpinner = true;
            console.log(vm.myUploadFile);
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.showSpinner = false;
                console.log(response.data);
                vm.userinfo.avatar = response.data.url;
                //vm.backAction();
            },function (response) {
                vm.showSpinner = false;
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }
        function getProfile () {
            NetworkService.get(constdata.api.login.profilePath,{page:vm.pageCurrent},function (response) {
               // vm.items = response.data.content;
                vm.userinfo = response.data;
                //updatePagination(response.data);
            },function (response) {
                vm.authError = i18n.t('login.LOGIN_FAILED');
                toastr.error(i18n.t('u.GET_DATA_FAILED') + ' ' + response.status + ' ' + response.statusText);
            });
        };


        function editItem(){
            vm.editing = true;
        };

        function doneEditing(){
            vm.editing = false;

            NetworkService.put(constdata.api.login.profilePath,vm.userinfo,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                $state.go('app.dashboard');
            },function (response) {
                vm.authError = i18n.t('login.LOGIN_FAILED');
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText)
            });


        };

        function changePsd() {
            if(vm.password && vm.newpassword && vm.password.length > 0 && vm.newpassword.length > 0){
                LoginService.post(constdata.api.login.changePSDPath,{'oldPassword':vm.password,'newPassword':vm.newpassword},function(response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText);
                });
            }
        };

    }

})();
