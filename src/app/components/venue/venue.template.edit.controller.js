/**
 * Created by cqp
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('VenueTemplateEditController', VenueTemplateEditController)
        .filter('userType',function(i18n) {
            return function(input) {
                var out = '';
                if(input=='admin') {
                    out = i18n.t('profile.ADMIN');
                } else if(input=='tenant') {
                    out = i18n.t('profile.TENANT');
                }
                return out;
            }
        });


    /** @ngInject */
    function VenueTemplateEditController($scope, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        vm.subPath = 'venue-templates';
        vm.myUploadFile = {};
        vm.edt = new Date();
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
        // vm.subPath = 'VenueTemplates'
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        // vm.reqPath =  constdata.api.tenant.fleetPath;
        vm.reqPath = constdata.api.tenant.jetPath;
        vm.isAdmin = false;


        function padStr(i) {
            return (i < 10) ? "0" + i : "" + i;
        }
        function dateToString(temp) {
            var dateStr = padStr(temp.getFullYear()) + '-' +
                padStr(1 + temp.getMonth()) + '-' +
                padStr(temp.getDate()) + ' ' +
                padStr(23) + ':' +
                padStr(59) + ":" +
                padStr(59);
            return dateStr;
        }
        vm.uploadFile = function (){
            vm.showSpinner = true;
            console.log(vm.myUploadFile);
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.showSpinner = false;
                console.log(response.data);
                vm.user.backgroundPic = response.data.url;
                //vm.backAction();
            },function (response) {
                vm.showSpinner = false;
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }


        function getTenantItem() {

            NetworkService.get(vm.reqPath + '/' + vm.subPath + '/'+ username,null,function (response) {
                vm.user = response.data;
                var date = vm.user.couponExpiredDate.substr(0,10);
                vm.edt   =   new Date(date);
                console.log(vm.edt);
                $rootScope.userNamePlacedTop = vm.user.nickName;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED')+vm.authError);
            });
        }

        // getTenantItem();

        function addItem() {
            var myid = vm.userInfo.id;


            vm.user.couponRemainNum = vm.user.couponTotalNum;
            vm.user.couponExpiredDate = dateToString(vm.edt);

            var refReq = vm.reqPath  + '/' + vm.subPath;

            NetworkService.post(refReq,vm.user,function (response) {
                //NetworkService.post(vm.reqPath + '/' + vm.subPath,vm.user,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                //return;
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }

        function editItem() {
            var myid = vm.userInfo.id;

            // console.log(vm.user.description);
            vm.user.couponExpiredDate = dateToString(vm.edt);

            console.log(vm.user.couponExpiredDate);
            NetworkService.put(vm.reqPath + '/' + vm.subPath + '/'+ username,vm.user,function (response) {
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

        vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };
        vm.clear = function () {

            vm.edt = null;

        };
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };
        vm.initDate = new Date('2017-1-20');
        vm.format = 'yyyy-MM-dd';






    }

})();