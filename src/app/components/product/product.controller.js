(function () {
    'use strict';

    angular.module('iot').controller('MyProductController', MyProductController);

    /** @ngInject */
    function MyProductController($rootScope, $scope, $timeout, StorageService,$state, $uibModal, UserInfoServer, $log, NetworkService, constdata, toastr, i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        
        vm.pageCurrent = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = ['1'];
        vm.infos;
        vm.pagingOptions = {
            pageSizes: [5, 10, 20],
            pageSize: 10,
            currentPage: 1
        };
        vm.tipsInfo = delmodaltip;
        
        getDatas();




       // console.log(vm.infos);

       // console.log(vm.displayedCollection);
        //edit products
        vm.editPros = function(index) {
            var editedProName = vm.infos[index].name;
            $state.go('app.addForm',{proName : editedProName});
        }
        //edit info one by one
        vm.goProTab = function(index) {
            var selectedProduct = index;//vm.infos[index];
            //console.log(index);
            $state.go('app.productTab',{HNATenantName:UserInfoServer.tenantName(),args : selectedProduct});
        };
        //delete info by name
        vm.openAlert = function (size,index) {
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
                var nameOfDelPro = vm.infos[index].name;
                // console.log(nameOfDelPro);
                NetworkService.delete(constdata.api.product.deletePath+'/'+nameOfDelPro,null,function (response) {
                    toastr.success(i18n.t('u.DELETE_SUC'));
                    
                    vm.infos.splice(index, 1);
                    
                },function (response) {
                    toastr.error(response.statusText);
                    console.log('Status' + response.status);
                });

                
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        //add info
        vm.addInfo = function() {
            // console.log('add');
            $state.go('app.addForm',{proName : null});
        }

        function getDatas() {
            NetworkService.get(constdata.api.product.listAllPath,null,function (response) {
                vm.infos = response.data.content;
               // console.log( vm.infos);
                vm.displayedCollection = [].concat(vm.infos);
                $scope.sc = [].concat(vm.infos);
             // console.log(response.data.content);
            },function (response) {
                toastr.error(response.statusText);
                console.log('Error');
                console.log('Status' + response.status);
            });
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
    }

})();
