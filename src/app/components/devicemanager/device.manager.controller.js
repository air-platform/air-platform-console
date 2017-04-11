/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('iot').controller('DeviceManagerController', DeviceManagerController);

    /** @ngInject */
    function DeviceManagerController(NetworkService,constdata,$state,$uibModal,$log,toastr,$stateParams,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.shouldShowBackAction = false;
        vm.shouldShowBackAction = $stateParams.args ? $stateParams.args.showBack : false;
        vm.products = [];
        vm.productOption = {};
        vm.user = '';


        vm.pageCurrent = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.totalPages = 12;
        vm.pages = ['1'];


        vm.items = [];
        vm.showItems = [];
        
        vm.searchAction = function () {
            // console.log(vm.productOption.name);
            // console.log(vm.user);
            vm.pageCurrent = 1;
            getDatas(vm.productOption.name,vm.user);
        }

        function getDatas(pName,uName) {

            var params = {};
            if (pName && pName != i18n.t('u.ALL') && pName.length > 0 && uName && uName.length > 0){
                params = {product:pName,sn:uName,page:vm.pageCurrent};
            }else if (pName && pName.length > 0 && pName != i18n.t('u.ALL')){
                params = {product:pName,page:vm.pageCurrent};
            }else if (uName && uName.length > 0){
                params = {sn:uName,page:vm.pageCurrent};
            }else{
                params = {page:vm.pageCurrent};
            }


            vm.displayedCollection = [];
            NetworkService.get(constdata.api.device.listAllPath,params,function (response) {
                for(var i=0; i<response.data.content.length; i++) {
                    var item1 = response.data.content[i];
                    var clientProfileBody = JSON.parse( item1.clientProfileBody );
                    if(item1.subscriptions) {
                        if(item1.subscriptions.length==0) {
                            clientProfileBody.subscriptions = i18n.t('u.ALL')
                        } else {
                            clientProfileBody.subscriptions = (item1.subscriptions).join();
                        }
                    } else {
                        clientProfileBody.subscriptions = i18n.t('u.ALL');
                    }

                    vm.displayedCollection.push(clientProfileBody);
                    
                }
                // if (vm.items.length <= 0){
                //     toastr.success('还没有想着数据');
                // }
//                console.log(vm.displayedCollection);
                updatePagination(response.data);
            },function (response) {
                if(response.status == '404') {
                    toastr.error(i18n.t('device.NO_DATA'));
                } else {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
                }
            });

        }

        function getProductList() {
            NetworkService.get(constdata.api.product.listAllPath,{page:1,pageSize:1000},function (response) {
                vm.products = response.data.content;
                vm.products.splice(0,0,{'name':i18n.t('u.ALL')});
                vm.productOption = vm.products[0];
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }


        vm.productSelectedChanged = function () {

        }


        vm.goAddItem = function () {
            $state.go('app.editDeviceManager',{args:{showBack:vm.shouldShowBackAction}});
        };

        vm.goEditItem = function (item) {
            $state.go('app.editDeviceManager',{'deviceId':item.name,args:{showBack:vm.shouldShowBackAction}});
        };

        vm.goDetail = function (item) {
            //$state.go('app.customTenantDashboard',{'tenantId':item.name,args:{'name':item.name}});
            // vm.goEditItem(item);
        };

        vm.removeItem = function (item) {
            NetworkService.delete(constdata.api.device.deletePath,function (response) {
                var index = vm.items.indexOf(item);
                vm.items.splice(index,1);
                toastr.success(i18n.t('u.DELETE_SUC'),'success');
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });

            // //这里还需要操作
            // // 当当前数据减到0时处理
        };



        vm.displayedCollectionArr = [].concat(vm.displayedCollection);


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
