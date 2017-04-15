/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('OrderAirjetController', OrderAirjetController);

    /** @ngInject */
    function OrderAirjetController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;

        vm.pageCurrent = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = [];

        vm.items = [];
        vm.showItems = [];

        vm.goAddItem = goAddItem;
        vm.goEditItem = goEditItem;
        vm.goDetail = goDetail;
        vm.resetPassword = resetPassword;
        vm.removeItem = removeItem;
        vm.curItem = {};
        vm.backAction = backAction;
        vm.userInfo = {};
        vm.subPath = 'ferryflights';

        vm.selItem = {};
        vm.selItem.id = '111';

        vm.tapAction = tapAction;
        vm.tabs = [
            {title:i18n.t('u.APP_INFO'),fun:'basic'},
            {title:i18n.t('u.APP_RUN_INFO'),fun:'run'},
            {title:i18n.t('u.APP_MONITOR_INFO'),fun:'monitor'},
            {title:i18n.t('u.APP_LOG_INFO'),fun:'log'}
            // {title:i18n.t('u.EVENT_MAP'),fun:'event'},
            //{title:i18n.t('u.USER_V'),fun:'verify'}
        ];
        vm.tabSelectedIndex = 0;//

        function chooseTab() {
            console.log('.....');
            console.log(vm.tabSelectedIndex);
            if (vm.tabSelectedIndex == 0){
                $state.go('app.orderairjet');
            }else if (vm.tabSelectedIndex == 1){
                $state.go('app.orderairjet');
            }else if (vm.tabSelectedIndex == 2){
                $state.go('app.orderairjet');
            }else if (vm.tabSelectedIndex == 3){
                $state.go('app.orderairjet');
            }else{
                // $state.go('app.applicationDetail.basic',{applicationName:vm.applicationName, applicationId:vm.selItem.id});
                $state.go('app.applicationDetail.basic',{applicationName:vm.applicationName, applicationId:vm.selItem.id});
            }
        }

        //tapAction(vm.tabs[1])

        function tapAction(item) {
            console.log(item);
            if (item == 'basic'){
                vm.tabSelectedIndex = 0;
            }else if (item == 'run'){
                vm.tabSelectedIndex = 1;
            }else if (item == 'monitor'){
                vm.tabSelectedIndex = 2;
            }else if (item == 'log'){
                vm.tabSelectedIndex = 3;
            }else{
                vm.tabSelectedIndex = 0;
            }
            console.log(vm.tabSelectedIndex);
            chooseTab();
        }



        function getDatas() {
            vm.userInfo = StorageService.get('iot.hnair.cloud.information');
            var myid = vm.userInfo.id;
            console.log(vm.userInfo);

            NetworkService.get(constdata.api.tenant.fleetPath + '/' + myid + '/' + vm.subPath,{page:vm.pageCurrent},function (response) {
                vm.items = response.data.content;
                updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }


        function goAddItem() {
            $state.go('app.editairjetflight',{});
        };

        function goEditItem(item) {
            $state.go('app.editairjetflight',{username:item.id, args:{type:'edit'}});
        };

        function goDetail(item) {
            $state.go('app.editairjetflight',{username:item.id, args:{type:'detail'}});

        };

        function resetPassword(item) {
            /*NetworkService.post(constdata.api.tenant.listAllPath + '/' + item.username + '/password/reset',null,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
            },function (response) {
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });*/
            toastr.success(i18n.t('u.OPERATE_SUC'));
        }

        function removeItem(item) {
            var myid = vm.userInfo.id;
            NetworkService.delete(constdata.api.tenant.fleetPath + '/' + myid + '/' + vm.subPath + '/'+ item.id,null,function success() {
                var index = vm.items.indexOf(item);
                //vm.items.splice(index,1);
                toastr.success(i18n.t('u.DELETE_SUC'));
                getDatas();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

        };
        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }

        vm.displayedCollection = [].concat(vm.items);


        // 分页 Start
        vm.preAction = function () {
            vm.pageCurrent --;
            if (vm.pageCurrent < 1) vm.pageCurrent = 1;
            getDatas();
        };
        vm.nextAction = function () {
            vm.pageCurrent ++;
            getDatas();
        };
        vm.goPage = function (page) {
            vm.pageCurrent = Number(page);
            getDatas();
        };
        vm.pageCurrentState = function (page) {
            if (Number(page) == vm.pageCurrent)
                return true;
            return false;
        };

        function updatePagination(pageination) {

            if (!pageination.hasContent){
                // toastr.error('当前无数据哦~');
                return;
            }

            var page = pageination.page;
            var toalPages = pageination.totalPages;

            vm.pageNextEnabled = pageination.hasNextPage;
            vm.pagePreEnabled = pageination.hasPreviousPage;


            if (toalPages < 2){
                vm.pages = ['1'];
            }else{
                vm.pages = [];
                var pageControl = 5;
                var stepStart = page - (pageControl - 1)/2;
                if (stepStart < 1 || toalPages < pageControl) stepStart = 1;
                var stepEnd = stepStart + pageControl - 1;
                if (stepEnd > toalPages) {
                    stepEnd = toalPages;
                    stepStart = toalPages - pageControl + 1;
                    if (stepStart < 1){
                        stepStart = 1;
                    }
                }

                for (var i=stepStart;i<= (stepEnd > toalPages ? toalPages : stepEnd);i++) {
                    vm.pages.push(i);
                }
            }

        }

        getDatas();


        //Model

        vm.tipsInfo = delmodaltip;
        vm.openAlert = function (size,model) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: size,
                controller:'ModalInstanceCtrl',
                resolve: {
                    tipsInfo: function () {
                        return vm.tipsInfo;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                vm.removeItem(model);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


        vm.tipsInfoReset = {title:i18n.t('profile.RESET_PWD'),content:i18n.t('profile.RESET_PWD_CONFIRM')};
        vm.resetAlert = function (size,model) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: size,
                controller:'ModalInstanceCtrl',
                resolve: {
                    tipsInfo: function () {
                        return vm.tipsInfoReset;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                vm.resetPassword(model);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }



    }

})();
