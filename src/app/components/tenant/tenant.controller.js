/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('TenantController', TenantController);

    /** @ngInject */
    function TenantController(NetworkService,StorageService,constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
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

        vm.displayedCollection = [];
        vm.subPath = 'accounts';
        vm.reqPath =  constdata.api.tenant.basePath;
        vm.reqPath2 = constdata.api.tenant.jetPath;
        vm.isAdmin = false;

        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.platPath;
            vm.reqPath2 = constdata.api.tenant.jetPath;
            vm.isAdmin = true;
        }

        vm.labelColor = {
            enabled:'bg-success',
            locked:'bg-danger',
            'member':'bg-main',
            'silver':'bg-main',
            'gold':'bg-main',
            'platinum':'bg-main',
            'diamond':'bg-main'
        };
        vm.labelContent={
            enabled:'已启用',
            locked:'已锁定',
            'member':'普通会员',
            'silver':'白银会员',
            'gold':'黄金会员',
            'platinum':'铂金会员',
            'diamond':'钻石会员'
        };
        vm.OperApp = OperApp;
        function OperApp(index, item) {
            if(index == 3){

                NetworkService.post(vm.reqPath + '/' + vm.subPath  +'/'+ item.id + '/lock',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(vm.authError);
                });

            }else if(index == 4){
                NetworkService.post(vm.reqPath + '/' + vm.subPath  +'/'+ item.id + '/unlock',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(vm.authError);
                });
            }else if(index == 5){
                NetworkService.post(vm.reqPath + '/' + vm.subPath  +'/'+ item.id + '/password/reset',null,function (response) {
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
        }





        function getDatas() {

            NetworkService.get(vm.reqPath + '/' + vm.subPath + '/' + '?type=tenant',{page:vm.pageCurrent},function (response) {
                vm.items = response.data.content;

                vm.displayedCollection = (vm.items);
                if(vm.displayedCollection) {
                    for (var i = 0; i < vm.displayedCollection.length; i++) {
                        if (vm.displayedCollection[i].status == 'enabled') {
                            vm.displayedCollection[i].isLockEnable = true;
                            vm.displayedCollection[i].isUnlockEnable = false;
                        } else if (vm.displayedCollection[i].status == 'locked') {
                            vm.displayedCollection[i].isLockEnable = false;
                            vm.displayedCollection[i].isUnlockEnable = true;
                        }
                    }
                }


                updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }


        function goAddItem() {
            $state.go('app.edittenant',{});
        };

        function goEditItem(item) {
            $state.go('app.edittenant',{username:item.id, args:{type:'edit'}});
        };

        function goDetail(item) {
            $state.go('app.edittenant',{username:item.id, args:{type:'detail'}});

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
            NetworkService.delete(vm.reqPath + '/' + vm.subPath + '/' + item.id,null,function success() {
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
