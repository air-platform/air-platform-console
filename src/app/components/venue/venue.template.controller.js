/**
 * Created by cqp
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('VenueTemplateController', VenueTemplateController);

    /** @ngInject */
    function VenueTemplateController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;

        vm.pageCurrent = 1;
        vm.targetPage = 1;
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
        vm.subPath = 'venue-templates'
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        vm.reqPath =  constdata.api.tenant.jetPath;
        // vm.reqPath2 = constdata.api.tenant.jetPath;
        vm.isAdmin = false;
        vm.publishColor = {
          true:"bg-success",
          false:"bg-danger"
        };

        vm.publishType={
            true:'已上线',
            false:'已下线'
        };
        vm.OperApp = OperApp;
        function OperApp(index, item) {
            if(index === 'publish'){

                NetworkService.post(vm.reqPath + '/' + vm.subPath  +'/'+ item.id + '/publish',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(vm.authError);
                });

            }else if(index === "unpublish"){
                NetworkService.post(vm.reqPath + '/' + vm.subPath  +'/'+ item.id + '/unpublish',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(vm.authError);
                });
            }else{
                console.log('error ops:'+index);
            }

            //$state.go('app.applicationedit');
        };
        function getDatas() {

            NetworkService.get(vm.reqPath + '/' + vm.subPath,{page:vm.pageCurrent},function (response) {
                vm.items = response.data.content;
                vm.displayedCollection = [].concat(vm.items);
                if(vm.displayedCollection) {
                    for (var i = 0; i < vm.displayedCollection.length; i++) {
                        if (vm.displayedCollection[i].published === true) {
                            vm.displayedCollection[i].isPublishEnable = false;
                            vm.displayedCollection[i].isUnPublishEnable = true;
                        } else {
                            vm.displayedCollection[i].isPublishEnable = true;
                            vm.displayedCollection[i].isUnPublishEnable = false;
                        }
                    }
                }
                console.log(vm.displayedCollection);
                updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }


        function goAddItem() {
            $state.go('app.editvenuetemplate',{});
        };

        function goEditItem(item) {
            $state.go('app.editvenuetemplate',{username:item.id, args:{type:'edit'}});
        };

        function goDetail(item) {
            $state.go('app.editvenuetemplate',{username:item.id, args:{type:'detail'}});

        };

        function resetPassword(item) {

            toastr.success(i18n.t('u.OPERATE_SUC'));
        }

        function removeItem(item) {
            console.log(item.id);
            NetworkService.delete(vm.reqPath + '/' + vm.subPath + '/'+ item.id,null,function success() {
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
            vm.totalPages = pageination.totalPages;

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
        };



    }

})();
