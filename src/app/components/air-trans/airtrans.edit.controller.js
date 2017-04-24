/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('AirtransEditController', AirtransEditController)
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
    function AirtransEditController($scope, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        vm.lockTenant = lockTenant;
        vm.unlockTenant = unlockTenant;
        vm.backAction = backAction;
        vm.back = back;
        vm.addUser = {};
        vm.addUser.role='tenant';
        vm.subPath = 'airtransports';
        vm.user.clientManagersArr = [];
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

            vm.user.clientManagersArr.push({
                name:'',
                email:''
            })
        }

        vm.removeClientManager = function(item) {
            var index = vm.user.clientManagersArr.indexOf(item);
            vm.user.clientManagersArr.splice(index, 1);
        }


        vm.addNewCraftItem = function() {

            vm.user.aircraftItems.push({
                price:'',
                seatPrice:'',
                currencyUnit:'rmb',
                aircraft:''
            })
        }





        vm.realAddNewCraftItem = function(item) {
            console.log('ok');
            var index = vm.user.aircraftItemsAdd.indexOf(item);
            console.log('ok'+index);

            vm.user.aircraftItemsAdd.splice(index, 1);

            vm.user.aircraftItems.push(angular.copy(item));
            console.log(vm.user.aircraftItems);


        }
        vm.removeCraftItem = function(item) {
            var index = vm.user.aircraftItems.indexOf(item);
            vm.user.aircraftItems.splice(index, 1);
        }
        function getAircraftsDatas() {


            NetworkService.get(constdata.api.tenant.fleetPath  + '/aircrafts',{page:vm.pageCurrent},function (response) {
                vm.crafts = response.data.content;

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }
        getAircraftsDatas();




        function getTenantItem() {

            var myid = vm.userInfo.id;
            console.log(myid);
            console.log(username);
            NetworkService.get(constdata.api.tenant.fleetPath  + '/' + vm.subPath + '/'+ username,null,function (response) {
                vm.user = response.data;

                vm.user.clientManagersArr = [];
                vm.user.aircraftItemsAdd = [];
                if(vm.user.aircraftItems.length > 0){
                    for (var i = 0; i < vm.user.aircraftItems.length; i ++){
                        vm.user.aircraftItems[i].aircraftId = vm.user.aircraftItems[i].aircraft.id;
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


        vm.uploadFile = function (){
            console.log(vm.myUploadFile);
            NetworkService.postForm('/api/v1/files',vm.myUploadFile,function (response) {
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

        function addItem() {
            var myid = vm.userInfo.id;
            if(vm.user.aircraftItems.length > 0) {
                for (var i = 0; i < vm.user.aircraftItems.length; i++) {
                    var tmp = vm.user.aircraftItems[i].aircraftId;
                    vm.user.aircraftItems[i].aircraft = tmp;
                }
            }

            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);


            NetworkService.post(constdata.api.tenant.fleetPath  + '/' + vm.subPath,vm.user,function (response) {
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

            if(vm.user.aircraftItems.length > 0) {
                for (var i = 0; i < vm.user.aircraftItems.length; i++) {
                    var tmp = vm.user.aircraftItems[i].aircraftId;
                    vm.user.aircraftItems[i].aircraft = tmp;
                }
            }
            console.log(vm.user.aircraftItems);


            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);



            NetworkService.put(constdata.api.tenant.fleetPath + '/' + vm.subPath + '/'+ username,vm.user,function (response) {
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

        function lockTenant() {
            NetworkService.post(constdata.api.tenant.lockPath +'/'+ username + '/lock',null,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.getTenantItem();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });
        }
        function unlockTenant() {
            NetworkService.post(constdata.api.tenant.lockPath +'/'+ username + '/unlock',null,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.getTenantItem();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });
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
            vm.user.flightRoute = {};
            vm.user.aircraftItems = [];
            vm.user.aircraftItemsAdd = [];
        }

        function back() {
            // history.back();
            vm.backAction();
        }






        $scope.today = function() {
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
        $scope.format = $scope.formats[0];







        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };
        vm.initDate = new Date('2016-15-20');
        vm.formats = ['MM/dd/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[0];

        //每次选择不同版本请求不同数据
        vm.change = function() {
            vm.notificationDatas = [];
            getNotiData(vm.selectedOption);
        }

        // date picker
        vm.today = function() {
            vm.dt = new Date();
        };
        vm.today();

        vm.clear = function () {
            vm.dt = null;
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



    }

})();