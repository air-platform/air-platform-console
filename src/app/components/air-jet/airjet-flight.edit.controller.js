/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('AirjetFlightEditController', AirjetFlightEditController)
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
    function AirjetFlightEditController($scope, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        vm.selTime = ['0:00','1:00','2:00','3:00','4:00','5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
                      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];


        vm.selHour = ['0','1','2','3','4','5', '6', '7', '8', '9', '10', '11', '12',
            '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        vm.selMin = ['00','05','10','15','20','25', '30', '35', '40', '45', '50', '55'];

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
        vm.imageShow = [];
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
        vm.reqPath =  constdata.api.tenant.fleetPath;
        vm.reqPath2 = constdata.api.tenant.jetPath;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.basePath;
            vm.reqPath2 = constdata.api.tenant.jetPath;
            vm.isAdmin = true;
        }




        vm.richContent="input here";
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
        function getAirjetsDatas() {


            NetworkService.get(vm.reqPath2  + '/airjets',{page:vm.pageCurrent},function (response) {
                vm.jets = response.data.content;

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }
        getAirjetsDatas();

        function getTenantDatas() {

            NetworkService.get(constdata.api.tenant.listAllPath + '/' + '?role=tenant',{page:vm.pageCurrent},function (response) {
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
            NetworkService.get(vm.reqPath  + '/' + vm.subPath + '/'+ username,null,function (response) {
                vm.user = response.data;
                if(vm.isAdmin){
                    vm.selTenant = vm.user.vendor.id;
                }
                var arrTime = vm.user.timeSlot.split("-");
                vm.user.time = {start:arrTime[0],
                                end:arrTime[1],
                                startHour:arrTime[0].split(":")[0],
                                startMin:arrTime[0].split(":")[1],
                                endHour:arrTime[1].split(":")[0],
                                endMin:arrTime[1].split(":")[1]
                                };
                if(vm.user.appearances){
                    var appArr = vm.user.appearances.split(',');
                    if(appArr.length > 0){
                        for(var i = 0; i < appArr.length; i ++){
                            vm.imageShow.push({image:appArr[i],myUploadFile:{}});
                        }
                    }
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



                console.log(vm.user);
                vm.dt   =   new Date((vm.user.departureDate));
                //console.log(vm.dt);
               // vm.dt = new   Date(vm.user.date.replace(/-/g,   "/"));
                //console.log(vm.dt);

                $rootScope.userNamePlacedTop = vm.user.nickName;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED'));
            });
        }
        vm.uploadFileItem = function (item){
            vm.showSpinner = true;
            console.log(item.myUploadFile);
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

        function padStr(i) {
            return (i < 10) ? "0" + i : "" + i;
        }
        function addItem() {
            var myid = vm.userInfo.id;
            //vm.user.timeSlot=vm.user.time.start+'-'+vm.user.time.end;
            vm.user.timeSlot=vm.user.time.startHour + ':' +vm.user.time.startMin +'-'+vm.user.time.endHour+':'+vm.user.time.endMin;
            console.log(vm.user.timeSlot);
            vm.user.departureDate = dateToString(vm.dt);

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
            //NetworkService.post(vm.reqPath + '/' + vm.subPath,vm.user,function (response) {
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
            console.log(vm.user.description);
            //return;
            //vm.user.description = mdContent;
           //vm.user.timeSlot=vm.user.time.start+'-'+vm.user.time.end;
            vm.user.timeSlot=vm.user.time.startHour + ':' +vm.user.time.startMin +'-'+vm.user.time.endHour+':'+vm.user.time.endMin;
            vm.user.departureDate = dateToString(vm.dt);

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
            vm.user.time = {'start':'9:00',
                            'end':'9.00',
                            'startHour':'9',
                            'startMin':'00',
                            'endHour':'10',
                            'endMin':'00'};
            vm.user.time.end = '10:00';
            vm.dt = new Date();
            console.log(vm.user.time);
        }

        function back() {
            // history.back();
            vm.backAction();
        }






       /* $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };

        $scope.initDate = new Date('2016-15-20');
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];*/







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
        vm.clear = function () {
            vm.dt = null;
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

        vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };


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


    }

})();