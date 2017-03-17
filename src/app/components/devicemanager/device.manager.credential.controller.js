/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('iot').controller('CredentialManagerController', CredentialManagerController);

    /** @ngInject */
    function CredentialManagerController(NetworkService,constdata,$state,$uibModal,$log,toastr,$stateParams,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        
        vm.authError = null;
        vm.shouldShowBackAction = false;
        vm.shouldShowBackAction = $stateParams.args ? $stateParams.args.showBack : false;
        vm.products = [];
        vm.canAdd = false;
        vm.productOption = {};

        vm.pageCurrent = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.totalPages = 12;
        vm.pages = ['1'];


        vm.items = [];
        vm.showItems = [];

        function getDatas() {
            
            NetworkService.get(constdata.api.product.listAllPath + '/' + vm.productOption.name + '/credentials',null,function (response) {
                vm.items = response.data.content;
                updatePagination(response.data);
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });

        }

        function getProductList() {
            NetworkService.get(constdata.api.product.listAllPath,{page:1,pageSize:1000},function (response) {
                vm.products = response.data.content;
                //过滤
                var ps = [];
                for (var i = 0 ; i < vm.products.length; i++){
                    var p = vm.products[i];
                    if (p.credentialsProvider != 'trustful'){
                        ps.push(p);
                    }
                }

                vm.products = ps;
                if (vm.products && vm.products.length > 0){
                    vm.productOption = vm.products[0];
                    vm.canAdd = true;
                    // console.log('-----');
                    // console.log(vm.products);
                    getDatas();
                }else{
                    noneProduct();
                }
                updatePagination(response.data);
            },function (response) {
                noneProduct();
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }
        
        
        vm.productSelectedChanged = function () {
            // console.log(vm.productOption.name);
            getDatas();
        }

        function noneProduct() {
            vm.products.splice(0,0,{'name':i18n.t('u.NONE')});
            vm.productOption = vm.products[0];
            vm.canAdd = false;
        }


        vm.goAddItem = function () {
            // console.log(vm.productOption.name);
            $state.go('app.editCredential',{'deviceId':vm.productOption.name,args:{showBack:vm.shouldShowBackAction,isAddModel:true,productChoosed:vm.productOption}});
        };

        vm.goEditItem = function (item) {
            $state.go('app.editCredential',{'deviceId':item.name,args:{showBack:vm.shouldShowBackAction,isAddModel:false}});
        };

        vm.goDetail = function (item) {
            //$state.go('app.customTenantDashboard',{'tenantId':item.name,args:{'name':item.name}});
            // vm.goEditItem(item);
        };

        vm.removeItem = function (item) {
            var itemStr = encodeURIComponent(item.id);
            NetworkService.delete(constdata.api.product.listAllPath + '/' + vm.productOption.name + '/credentials?id=' + itemStr,null,function (response) {
                var index = vm.items.indexOf(item);
                vm.items.splice(index,1);
                toastr.success(i18n.t('u.DELETE_SUC'));
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        };
        vm.revokeItem = function (item) {
            var itemStr = encodeURIComponent(item.id);
            NetworkService.post(constdata.api.product.listAllPath + '/' + vm.productOption.name + '/credentials/'+itemStr+'/revoke',null,function (response) {
                // var index = vm.items.indexOf(item);
                // vm.items.splice(index,1);
                getDatas();
                toastr.success(i18n.t('u.OPERATE_SUC'));
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
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

        getProductList();



        //Model


        vm.openAlert = function (size,model) {
            vm.tipsInfo = delmodaltip;
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: size,
                controller:'ModalInstanceCtrl',
                resolve: {
                    tipsInfo: function () {
                        return tipsInfo;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                vm.removeItem(model);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        vm.revokeAlert = function (size,model) {
            var tipsInfo = {title:i18n.t('device.REVOKE_CONFIRM'),content:i18n.t('device.REVOKE_CONFIRM')};
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: size,
                controller:'ModalInstanceCtrl',
                resolve: {
                    tipsInfo: function () {
                        return tipsInfo;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                vm.revokeItem(model);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


        vm.back = function () {
            $state.go('app.customTenantDashboard',$stateParams.args.CustomTenantController);
        }

    }

})();
