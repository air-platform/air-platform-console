
(function () {
    'use strict';

    angular.module('iot').controller('ProductSdkAddCtrl', ProductSdkAddCtrl);

    /** @ngInject */
    function ProductSdkAddCtrl($state, $stateParams, toastr, NetworkService, constdata,UserInfoServer) {
        /* jshint validthis: true */
        var vm = this;

        var argsProduct = $stateParams.args;
        var productName = argsProduct.name;

        //add sdk
        vm.sdkAdd = {
            "name": "",
            "description": ""
        }

        //save
        vm.saveSdk = function() {

            if(vm.sdkAdd.name == '') {
                toastr.error('请填写完整再提交');
            } else {
                var jsonOfAddedSdk = JSON.stringify( vm.sdkAdd );
                // console.log(jsonOfAddedSdk,{args : argsProduct});
                NetworkService.post(constdata.api.product.addSdkPath+'/'+productName+'/profiles',jsonOfAddedSdk,function (response) {
                    
                    toastr.success('添加成功!');
                    $state.go('app.productTab',{HNATenantName:UserInfoServer.tenantName(),args:argsProduct});
                },function (response) {
                    toastr.error('添加失败:' + response.statusText);
                    // console.log('Status' + response.status);
                });
            }
           
        }
        
        // cancel
        vm.cancelSdk = function() {
             $state.go('app.productTab',{HNATenantName:UserInfoServer.tenantName(),args : argsProduct});
        }
    }

})();

