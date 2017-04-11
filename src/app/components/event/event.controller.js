/*
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('iot').controller('EventController', EventController);

    /** @ngInject */
    function EventController(NetworkService,constdata,$timeout,$state,$uibModal,$log,toastr,$stateParams,i18n,EventDataShareServer,UserInfoServer, delmodaltip) {
        /* jshint validthis: true */
//		var token = StorageService.get('iot.hnair.cloud.access_token');
//		console.log(token);
        var vm = this;
        vm.authError = null;
        vm.shouldShowBackAction = false;
        vm.shouldShowBackAction = $stateParams.args ? $stateParams.args.showBack : false;

        vm.pageCurrent = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.totalPages = 12;
        vm.pages = [];
        vm.dispear = false;

        //初始化数据

        EventDataShareServer.eventId = '';
        EventDataShareServer.eventClasses = [];
        EventDataShareServer.eventClass = {};
        EventDataShareServer.isEditMode = -1;
        EventDataShareServer.navStepTitles = [{name:i18n.t('event.EVENT_FAMILY'),index:0}];
        EventDataShareServer.navStepIndex = 0;

		
		
        vm.items = [];
        vm.showItems = [];

        function getDatas() {
            // NetworkService.get(constdata.api.event.eventPath,{page:vm.pageCurrent},function (response) {
            //     vm.items = response.data.content;
            //     updatePagination(response.data);
            // },function (response) {
            //     vm.authError = response.statusText + '(' + response.status + ')';
            //     toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            // });
        }

        function checkTime (){
            var timer=$timeout(function(){
                vm.dispear = true;
            },3000);
        }

        vm.save = function () {
            vm.dispear = false;
            vm.saveButton = true;
            checkTime();
        }

        vm.goAddItem = function () {
            $state.go('app.addEvent');
        };

        vm.goEditItem = function (item) {
            $state.go('app.eventclassfamily',{eventId:item.id,HNATenantName:UserInfoServer.tenantName(),args:{isAddModel:false}});
            // $state.go('app.editGoForm',{'eventId':item.id});
        };

        vm.goDetail = function (item) {
            //$state.go('app.customTenantDashboard',{'tenantId':item.name,args:{'name':item.name}});
            // vm.goEditItem(item);
        };

        vm.removeItem = function (item) {
            NetworkService.delete(constdata.api.event.eventPath + '/' + item.id,null,function () {
                var index = vm.items.indexOf(item);
                vm.items.splice(index,1);
                toastr.success(i18n.t('u.DELETE_SUC'));
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            // //这里还需要操作
            // // 当当前数据减到0时处理
        };

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

        vm.back = function () {
            $state.go('app.customTenantDashboard',$stateParams.args.CustomTenantController);
        }
    }
})();
