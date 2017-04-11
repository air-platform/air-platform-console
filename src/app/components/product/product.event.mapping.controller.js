(function () {
    'use strict';

    angular.module('iot').controller('productEventMappingCtrl', productEventMappingCtrl);

    /** @ngInject */
    function productEventMappingCtrl($state, $stateParams, NetworkService, constdata, $uibModal, $log, toastr, UserInfoServer, i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;

        vm.emInfos = [];
        vm.tipsInfo = delmodaltip;
        var argsProduct = {};

        isBrowserBackBtn();
        
		getEventMappings();

        vm.displayedCollection = [].concat(vm.emInfos);

        vm.removeEventMappingItem = function (item) {
            NetworkService.delete(constdata.api.product.productPath + '/' + argsProduct.name + '/' + 'eventmappings' + '/' + item.id,null,function success() {
                var index = vm.emInfos.indexOf(item);
                vm.emInfos.splice(index,1);
                toastr.success(i18n.t('u.DELETE_SUC'));
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        };

        vm.gotoDetail = function (item) {
            $state.go('app.editEvent',{evId:vm.emInfos[item].id,args:{fromApplication:false,productName:argsProduct.name}});
        };

        vm.addEventMapping = function() {
            $state.go('app.addMapping4Application',{targetName:argsProduct.name,HNATenantName:UserInfoServer.tenantName(),args:{type:'product',ext:argsProduct}});
        }
        
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
                vm.removeEventMappingItem(model);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        function getEventMappings() {
            NetworkService.get(constdata.api.product.productPath + '/' + argsProduct.name + '/' + 'eventmappings',null,function (response) {
                vm.emInfos = response.data;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        };

        function isBrowserBackBtn() {
            if(isEmpty($stateParams.args)) {
                //浏览器回退按钮加载的本页面
                argsProduct = JSON.parse( sessionStorage.getItem('sessionStoredProduct') ).product
            } else {
                //路由跳转加载的，要本地存储
                argsProduct = $stateParams.args;
            }
        }

        function isEmpty(obj){
            for (var name in obj){
                return false;
            }
            return true;
        }

    }

})();
