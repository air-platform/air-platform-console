/**
 * Created by cqp.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('PushNotificationsEditController', PushNotificationsEditController)
        .filter('userType',function(i18n) {
            return function(input) {
                var out = '';
                if(input==='admin') {
                    out = i18n.t('profile.ADMIN');
                } else if(input==='tenant') {
                    out = i18n.t('profile.TENANT');
                }
                return out;
            };
        });

    /** @ngInject */
    function PushNotificationsEditController($scope, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.user = {};
        vm.title = i18n.t('profile.ADD_T_INFO');
        vm.power = i18n.t('profile.USER');
        vm.options = {
            power: [
                i18n.t('profile.USER'),
                i18n.t('profile.TENANT'),
                i18n.t('profile.ADMIN')
            ]
        };
        vm.isAdd = true;
        vm.isEdit = false;
        vm.isDetail = false;
        // vm.getTenantItem = getTenantItem;
        // vm.getNotidItem = getNotidItem()
        vm.submitAction = submitAction;

        vm.backAction = backAction;
        vm.back = back;






        var username = $stateParams.username;
        // console.log($stateParams.username);
        var type = $stateParams.args.type;
        // vm.notid = username;
        vm.Notifications = [];
        console.log(username);
        console.log(type);
        if (username){
            vm.isAdd = false;
            vm.title = i18n.t('profile.EDIT_T_INFO');
        }

        if(type && type==='edit'){
            vm.isEdit = true;
        }
        if(type && type==='detail'){
            vm.isDetail = true;
        }


        vm.subPath = 'pushnotifications';
        vm.reqPath =  constdata.api.admin.platPath;

        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role !== 'tenant'){
            vm.reqPath = constdata.api.admin.platPath;

            vm.isAdmin = true;
        }
        vm.changeLink = function(){
            vm.user.link = '';
        };
        vm.labelClass = {
            'push_success':'bg-success',
            'none_push':'bg-created',
            'push_failed':'bg-info'
        };
        vm.statusMap={
            'none_push':'未推送',
            'push_success':'推送成功',
            'push_failed':'推送失败'
        };


        // vm.addNewNotifications = function() {
        //
        //     vm.Notifications.push({
        //         message:'',
        //         type:'',
        //     });
        // };

        // function updatePagination(pageination) {
        //
        //     if (!pageination.hasContent) {
        //         // toastr.error('当前无数据哦~');
        //         return;
        //     }
        //
        // }

        function getProductsDatas() {

                NetworkService.get(vm.reqPath + '/' + vm.subPath+ '/' + username,null,function (response) {
                    vm.items = response.data;
                    // if(vm.items){
                    //     vm.Notifications.message = vm.items.message;
                    //     vm.Notifications.type = vm.items.type;
                    //
                    // }
                    console.log(vm.items);
                },function (response) {
                    toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
                });

        }
        getProductsDatas();

        function addItem() {


                // vm.Notifications.message = vm.items.message;
                // vm.Notifications.type = 'plain_text';
                // console.log(vm.Notifications.message);
            vm.Notifications = {message:vm.items.message, type:'plain_text'};
            // console.log(vm.Notifications);

            // vm.user.items = [{title:'item1', image:'img1', link:'lnk1'}];

            NetworkService.post(vm.reqPath + '/' + vm.subPath,vm.Notifications,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }
        function editItem() {

            vm.Notifications = {message:vm.items.message, type:'plain_text'};

            NetworkService.put(vm.reqPath  + '/' + vm.subPath + '/'+ username,vm.Notifications,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText);
            });
        }
        function submitAction() {
            if (vm.isAdd){
                addItem();
            }else{
                editItem();
            }
        }



        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }

        function back() {
            // history.back();
            vm.backAction();
        }




    }

})();