/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('iot').controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($rootScope,LoginService,constdata,toastr,i18n,StorageService) {
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


        getProfile();


        function getProfile () {
            var token = StorageService.get('iot.hnair.cloud.access_token');
            LoginService.get(constdata.api.login.profilePath,null,token,function (response) {
                vm.userinfo = response.data;
            },function (response) {
                vm.authError = i18n.t('login.LOGIN_FAILED');
                toastr.error(i18n.t('u.GET_DATA_FAILED') + ' ' + response.statusText);
            });
        };


        function editItem(){
            vm.editing = true;
        };

        function doneEditing(){
            vm.editing = false;
            LoginService.put(constdata.api.login.updatePath,{nickName:vm.userinfo.nickName},function (response) {
                $rootScope.savedNickName = vm.userinfo.nickName;
                toastr.success(i18n.t('u.UPDATE_SUC'));
            },function (response) {
                vm.authError = i18n.t('login.LOGIN_FAILED');
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText);
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
