/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('AirjetBookEditController', AirjetBookEditController)
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
    function AirjetBookEditController(NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        vm.imageShow = [];
        var username = $stateParams.username;
        var type = $stateParams.args.type;
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
        if(type && type=='copy'){
            vm.isCopy = true;
        }
        vm.user.clientManagersArr = [];

        vm.addNewClientManager = function() {

            vm.user.clientManagersArr.push({
                name:'',
                email:''
            })
        }

        vm.removeClientManager = function(item) {
            var index = vm.user.clientManagersArr.indexOf(item);
            vm.user.clientManagersArr.splice(index, 1);
        }

        vm.addImageShow = function() {

            vm.imageShow.push({
                image:'',
                myUploadFile:{}
            })
        }

        vm.removeImageShow = function(item) {
            var index = vm.imageShow.indexOf(item);
            vm.imageShow.splice(index, 1);
        }

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
        vm.subPath = 'fleets';
        vm.reqPath =  constdata.api.tenant.fleetPath;
        vm.reqPath2 = constdata.api.tenant.jetPath;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.basePath;
            vm.reqPath2 = constdata.api.tenant.jetPath;
            vm.isAdmin = true;
        }

        function getAirjetsDatas() {


            NetworkService.get(vm.reqPath2  + '/airjets',{page:vm.pageCurrent},function (response) {
                vm.jets = response.data;

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }
        getAirjetsDatas();

        function getTenantDatas() {

            NetworkService.get(constdata.api.tenant.listAllPath + '/' + '?type=tenant',{page:vm.pageCurrent},function (response) {
                vm.tenants = response.data.content;
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }
        vm.selTenant = ''
        if(vm.isAdmin) {
            getTenantDatas();

        }

        function getTenantItem() {

            var myid = vm.userInfo.id;
            console.log(myid);
            console.log(username);
            NetworkService.get(vm.reqPath + '/' + vm.subPath + '/'+ username,null,function (response) {
                vm.user = response.data;
                if(vm.isAdmin){
                    vm.selTenant = vm.user.vendor.id;
                }

                vm.user.clientManagersArr = [];
                if(vm.user.appearances){
                    var appArr = vm.user.appearances.split(',');
                    if(appArr.length > 0){
                        for(var i = 0; i < appArr.length; i ++){
                            vm.imageShow.push({image:appArr[i],myUploadFile:{}});
                        }
                    }
                }
                if(vm.user.clientManagers){
                    var uInfo = vm.user.clientManagers.split( "," );

                    if(uInfo.length > 0){
                        for(var i = 0; i < uInfo.length; i ++){
                            var uDetailStr = uInfo[i].split(':');
                            if(uDetailStr.length > 0){
                                vm.user.clientManagersArr.push({
                                    name:uDetailStr[0],
                                    email:uDetailStr[1]
                                })
                            }

                        }
                    }
                }




                $rootScope.userNamePlacedTop = vm.user.nickName;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED'));
            });
        }


        vm.uploadFileApp = function (){
            console.log(vm.myUploadFile);
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));

                console.log(response.data);
                if(vm.user.appearances == null || vm.user.appearances == ''){
                    vm.user.appearances = response.data.url;
                }else {
                    vm.user.appearances += ',' + response.data.url;
                }
                //vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }

        vm.uploadFileItem = function (item){
            console.log(item.myUploadFile);
            vm.showSpinner = true;
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,item.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.showSpinner = false;
                console.log(response.data);
                item.image = response.data.url;
                console.log(vm.user.image);
                //vm.backAction();
            },function (response) {
                vm.showSpinner = false;
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }

        vm.uploadFile = function (){
            console.log(vm.myUploadFile);
            vm.showSpinner = true;
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.showSpinner = false;
                console.log(response.data);
                vm.user.image = response.data.url;
                console.log(vm.user.image);
                //vm.backAction();
            },function (response) {
                vm.showSpinner = false;
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }
        function addItem() {
            var myid = vm.userInfo.id;
            vm.user.description = getMarkDownAction().markdown;
            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);


            if(vm.imageShow){
                //var appArr = vm.imageShow.split(',');
                vm.user.appearances = '';
                if(vm.imageShow.length > 0){
                    for(var i = 0; i < vm.imageShow.length; i ++){
                        vm.user.appearances += vm.imageShow[i].image+',';
                    }
                    vm.user.appearances = vm.user.appearances.substr(0, vm.user.appearances.length-1);
                }
            }
            var refReq = vm.reqPath  + '/' + vm.subPath;
            if(vm.isAdmin){
                refReq += '?tenant='+vm.selTenant;
            }
            NetworkService.post(refReq,vm.user,function (response) {
            //NetworkService.post(vm.reqPath + '/' + vm.subPath',vm.user,function (response) {
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
            vm.user.description = getMarkDownAction().markdown;
            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);
            console.log(vm.imageShow);
            if(vm.imageShow){
                //var appArr = vm.imageShow.split(',');
                vm.user.appearances = '';
                if(vm.imageShow.length > 0){
                    for(var i = 0; i < vm.imageShow.length; i ++){
                        vm.user.appearances += vm.imageShow[i].image+',';
                    }
                    vm.user.appearances = vm.user.appearances.substr(0, vm.user.appearances.length-1);
                    console.log(vm.user.appearances);
                }
            }

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
            }else if(vm.isEdit){
                editItem();
            }else if(vm.isCopy){
                addItem();
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
        }

        function back() {
            // history.back();
            vm.backAction();
        }

    }

})();