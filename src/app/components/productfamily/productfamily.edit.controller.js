/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('ProductFamilyEditController', ProductFamilyEditController)
        .filter('userType',function(i18n) {
        return function(input) {
            var out = '';
            if(input=='admin') {
                out = i18n.t('profile.ADMIN')
            } else if(input=='tenant') {
                out = i18n.t('profile.TENANT')
            }
            return out;
        }
    });

    /** @ngInject */
    function ProductFamilyEditController($scope, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        vm.getTenantItem = getTenantItem;
        vm.submitAction = submitAction;

        vm.backAction = backAction;
        vm.back = back;
        vm.addUser = {};
        vm.addUser.role='tenant';
        vm.subPath = 'aircrafts';
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

        vm.categoryType = [
            {
                title:'Air Jet',
                value:'air_jet'
            },
            {
                title:'Air Taxi',
                value:'air_taxi'
            },
            {
                title:'Air Trans',
                value:'air_trans'
            },
            {
                title:'Air Train',
                value:'air_training'
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

        vm.priceType = [
            {
                title:'人民币',
                value:'rmb'
            },
            {
                title:'美元',
                value:'usd'
            }
        ];
        var username = $stateParams.username;
        var type = $stateParams.args.type;



        vm.reqPath = constdata.api.productFamily.basePath;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.productFamily.adminPath;
            vm.isAdmin = true;
        }


        vm.clientManagersArr = [];
        console.log(type);
        if (username){
            vm.isAdd = false;
            vm.title = i18n.t('profile.EDIT_T_INFO');
        }

        if(type && type=='edit'){
            vm.isEdit = true;
        }
        if(type && type=='detail'){
            vm.isDetail = true;
        }

        vm.addNewClientManager = function() {

            vm.clientManagersArr.push({
                name:'',
                title:'',
                link:'',
                myUploadFile:''
            })
        }

        vm.removeClientManager = function(item) {
            var index = vm.clientManagersArr.indexOf(item);
            vm.clientManagersArr.splice(index, 1);
        }

        function getTenantItem() {

            var myid = vm.userInfo.id;
            console.log(myid);
            console.log(username);


            NetworkService.get(vm.reqPath +'/' +  '/'+ username,null,function (response) {
                vm.user = response.data;
                console.log(vm.user);
                if(vm.user.items){
                    vm.clientManagersArr = vm.user.items;

                }
                $rootScope.userNamePlacedTop = vm.user.nickName;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED'));
            });
        }


        function addItem() {
            var myid = vm.userInfo.id;

            if(vm.clientManagersArr.length > 0) {
                vm.user.items =  vm.clientManagersArr;
            }


           // vm.user.items = [{title:'item1', image:'img1', link:'lnk1'}];

            NetworkService.post(vm.reqPath,vm.user,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }





        vm.uploadFile = function (){
            console.log(vm.myUploadFile);
            NetworkService.postForm(constant.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));

                console.log(response.data);
                vm.user.image = response.data.url;
                //vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }













        function editItem() {
            var myid = vm.userInfo.id;
            if(vm.clientManagersArr.length > 0) {
                vm.user.items =  vm.clientManagersArr;
            }



            NetworkService.put(vm.reqPath  + '/'+ username,vm.user,function (response) {
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
            }else{
                editItem();
            }
        }


        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }


        vm.userInfo = StorageService.get('iot.hnair.cloud.information');

        if (!vm.isAdd){
            vm.getTenantItem();
        }else{
            vm.user.currencyUnit = 'rmb';
            vm.user.category = 'air_taxi';
        }

        function back() {
            // history.back();
            vm.backAction();
        }



    }

})();