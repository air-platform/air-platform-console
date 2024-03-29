/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('TraingClassEditController', TraingClassEditController)
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
    function TraingClassEditController($scope, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        vm.subPath = 'ferryflights';
        vm.schools = {};
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
        vm.user.clientManagersArr = [];

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

        vm.classFleet = [
            '直升机',
            '固定翼'
        ];
        vm.licenseType=[
            '私照',
            '商照'
        ];
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
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        vm.reqPath =  constdata.api.tenant.fleetPath;
        vm.reqPath2 = constdata.api.tenant.fleetPath;
        vm.isAdmin = false;
        vm.subPath = 'courses';
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.basePath;
            vm.reqPath2 = constdata.api.admin.platPath;
            vm.isAdmin = true;
        }
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

        vm.uploadFile = function (){
            vm.showSpinner = true;
            console.log(vm.myUploadFile);
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.showSpinner = false;
                console.log(response.data);
                vm.user.image = response.data.url;
                //vm.backAction();
            },function (response) {
                vm.showSpinner = false;
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }


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
            NetworkService.get(vm.reqPath + '/'+ vm.subPath + '/'+ username,null,function (response) {
                vm.user = response.data;
                $rootScope.userNamePlacedTop = vm.user.nickName;
                vm.sdt   =   new Date((vm.user.startDate));
                vm.edt   =   new Date((vm.user.endDate));
                vm.user.school = vm.user.school.id;
                if(vm.isAdmin){
                    vm.selTenant = vm.user.vendor.id;
                }
                vm.user.clientManagersArr = [];
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




            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED') + vm.authError);
            });
        }

        function padStr(i) {
            return (i < 10) ? "0" + i : "" + i;
        }
        function dateToString(temp) {
            //var temp = new Date();
            var dateStr = padStr(temp.getFullYear()) + '-' +
                padStr(1 + temp.getMonth()) + '-' +
                padStr(temp.getDate());// +
            //padStr(temp.getHours()) +
            //padStr(temp.getMinutes()) +
            //padStr(temp.getSeconds());
            console.log(dateStr);
            return dateStr;
        }


        function addItem() {
            var myid = vm.userInfo.id;
            vm.user.startDate = dateToString(vm.sdt);
            vm.user.endDate = dateToString(vm.edt);

            vm.user.description = getMarkDownAction().markdown;
            console.log(vm.user.description);


            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);

            vm.user.enrollNum = parseInt(vm.user.enrollNum);
            vm.user.price = parseInt(vm.user.price);
            vm.user.totalNum = parseInt(vm.user.totalNum);

            var refReq = vm.reqPath  + '/' + vm.subPath+'?school='+vm.user.school;
            if(vm.isAdmin){
                refReq += '&tenant='+vm.selTenant;
            }
            NetworkService.post(refReq,vm.user,function (response) {

          //  NetworkService.post(vm.reqPath + '/'+ vm.subPath+'?school='+vm.user.school,vm.user,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }
       vm.changeClassSite = function(){
           console.log(vm.user.school.id);
           if(vm.schools.length > 0){
               for(var i = 0; i < vm.schools.length;  i++){
                   if(vm.schools[i].id == vm.user.school){
                       vm.user.location = vm.schools[i].address;
                       return;
                   }
               }

           }
       }
        function editItem() {
            var myid = vm.userInfo.id;
            vm.user.startDate = dateToString(vm.sdt);
            vm.user.endDate = dateToString(vm.edt);

            vm.user.description = getMarkDownAction().markdown;


            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);


            console.log(vm.user.description);



            vm.user.enrollNum = parseInt(vm.user.enrollNum);

            vm.user.price = parseInt(vm.user.price);
            vm.user.totalNum = parseInt(vm.user.totalNum);



            NetworkService.put(vm.reqPath + '/'+ vm.subPath+'/'+vm.user.id,vm.user,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
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
            vm.user.school = {};
            vm.user.airType = '直升机';
            vm.user.license = '私照';

        }

        vm.sdt = new Date();
        vm.edt = new Date();
        function getSchoolDatas() {


            NetworkService.get(vm.reqPath2+'/schools',{page:vm.pageCurrent},function (response) {
                vm.schools = response.data.content;
                console.log(vm.schools);
                if(vm.schools.length > 0){
                    if(vm.isAdd) {
                        if (!vm.user) {
                            vm.user = {};
                        }

                        vm.user.school = vm.schools[0].id;
                        vm.user.location = vm.schools[0].address;
                    }
                }
                //updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }




        getSchoolDatas();



        function back() {
            // history.back();
            vm.backAction();
        }


        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };
        vm.initDate = new Date('2017-1-20');

        vm.format = 'yyyy-MM-dd';

        //每次选择不同版本请求不同数据
        vm.change = function() {
            vm.notificationDatas = [];
            getNotiData(vm.selectedOption);
        }


        // vm.dt = new Date();
        // vm.user.date = new Date();
        vm.clear1 = function () {
            vm.sdt = null;

            //vm.user.date = null;
        };
        vm.clear2 = function () {

            vm.edt = null;
            //vm.user.date = null;
        };
        // Disable weekend selection
        vm.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        vm.toggleMin = function() {
            vm.minDate = new Date();
        };
        vm.toggleMin();

        vm.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened1 = true;
        };

        vm.open2 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened2 = true;
        };








    }

})();