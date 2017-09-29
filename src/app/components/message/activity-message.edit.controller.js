/**
 * Created by cqp
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('ActivityMessagesEditController', ActivityMessagesEditController)
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
    function ActivityMessagesEditController($scope, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.user = {};
        vm.title = i18n.t('profile.ADD_T_INFO');
        vm.power = i18n.t('profile.USER');
        $scope.response = {};
        $scope.response.content = 'my card';
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
        vm.getMessageItem = getMessageItem;
        vm.submitAction = submitAction;
        vm.backAction = backAction;
        vm.back = back;
        vm.subPath = 'activity-messages';
        vm.userType = [
            {
                title:'管理员',
                value:'admin'
            },
            {
                title:'商户',
                value:'tenant'
            },
            {
                title:'用户',
                value:'user'
            }
        ];
        vm.pubStatus = [
            {
                title:'已上线',
                value: true
            },
            {
                title:'已下线',
                value: false
            }
        ];
        vm.statusType = [
            {
                title:'已启用',
                value:'enabled'
            },
            {
                title:'已禁用',
                value:'disabled'
            }
        ];

        vm.editorContent = '';
        var username = $stateParams.username;
        var type = $stateParams.args.type;
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
        vm.user.clientManagersArr = [];
        vm.approveStatus=[{
            value:'pending',
            title:'未审批'
        },{
            value:'approved',
            title:'审批通过'
        },{
            value:'rejected',
            title:'审批拒绝'
        }];
        vm.reqPath = constdata.api.tenant.jetPath;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role !== 'tenant'){
            vm.isAdmin = true;
        }


        function getTenantDatas() {

            NetworkService.get(constdata.api.tenant.listAllPath + '/' + '?type=tenant',{page:vm.pageCurrent,pageSize:2000},function (response) {
                vm.tenants = response.data.content;
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }
        vm.selTenant = ''
        if(vm.isAdmin) {
            getTenantDatas();

        }
        function getMessageItem() {

            var myid = vm.userInfo.id;
            // console.log(myid);
            // console.log(username);
            console.log(vm.reqPath + '/' + vm.subPath);
            NetworkService.get(vm.reqPath + '/' + vm.subPath + '/'+ username,null,function (response) {
                vm.user = response.data;

                setUEContent(vm.user.description);
                // if(vm.isAdmin){
                //     vm.selTenant = vm.user.vendor.id;
                // }

            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED'));
            });
        }


        function addItem() {
            var myid = vm.userInfo.id;
            vm.user.description = getUEContent();
            // console.log(vm.user.description);
            var refReq;
            if(vm.isAdmin){
                refReq = vm.reqPath + '/' +vm.subPath +'?tenant=' + vm.user.vendor.id;
                // vm.user.vendor.id = vm.selTenant;
            }else {
                refReq = vm.reqPath  + '/' + vm.subPath;
            }

            NetworkService.post(refReq,vm.user,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }

        function editItem() {
            var myid = vm.userInfo.id;
            vm.user.description = getUEContent();

            // if(vm.isAdmin){
            //     vm.user.vendor.id = vm.selTenant;
            // }
            // console.log(vm.user.description);

            NetworkService.put(vm.reqPath + '/' + vm.subPath + '/'+ username,vm.user,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });
        }
        function submitAction() {
            if (vm.isAdd){
                addItem();
            } else if(vm.isEdit){
                editItem();
            }
        }
        function backAction() {
            $rootScope.backPre();
        }

        vm.uploadFile = function (){
            console.log(vm.myUploadFile);
            vm.showSpinner = true;
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.showSpinner = false;
                console.log(response.data);
                vm.user.thumbnails = response.data.url;
            },function (response) {
                vm.showSpinner = false;
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

        }
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');

        if (!vm.isAdd){
            vm.getMessageItem();
        }

        function back() {
            vm.backAction();
        }

    }

})();