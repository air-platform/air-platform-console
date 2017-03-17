/**
 * Created by Otherplayer on 16/7/27.
 */
/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('iot').controller('EditDeviceManagerController', EditDeviceManagerController);

    /** @ngInject */
    function EditDeviceManagerController(NetworkService,constdata,$state,$rootScope,$stateParams,toastr,i18n) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.user = {};
        vm.title = i18n.t('device.ADD_DEVICE');
        vm.isAdd = true;
        vm.shouldShowBackAction = $stateParams.args.showBack;

        var deviceId = $stateParams.deviceId;

        if (deviceId){
            vm.isAdd = false;
            vm.title = i18n.t('device.EDIT_DEVICE_INFO');
        }

        function getDeviceItem() {

            NetworkService.get(constdata.api.device.deviceInfoPath,null,function (response) {
                console.log(response);
                vm.user=response.data;
                console.log(vm.user);
            },function (response) {
                // console.log('Error');
                // console.log('Status' + response.status);
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }


        function addItem() {
            NetworkService.post(constdata.api.device.addPath,vm.user,function (response) {
                console.log('Add success');
                toastr.success(i18n.t('u.ADD_SUC'));
                vm.backAction();
            },function (response) {
                // console.log('Error');
                // console.log('Status' + response.status);
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }

        function editItem() {
            NetworkService.post(constdata.api.device.updatePath,vm.user,function (response) {
                console.log('Update success');
                toastr.success(i18n.t('u.UPDATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }
        vm.submitAction = function () {
            if (vm.isAdd){
                addItem();
            }else{
                editItem();
            }
        }


        vm.backAction = function () {
            $rootScope.backPre();
        }

        if (!vm.isAdd){
            getDeviceItem();
        }

        vm.back = function () {
            vm.backAction();
        }

    }

})();