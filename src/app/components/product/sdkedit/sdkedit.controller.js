(function () {
    'use strict';

    angular.module('iot').controller('SdkEditCtrl', SdkEditCtrl);

    /** @ngInject */
    function SdkEditCtrl($state, $stateParams, UserInfoServer, constdata, toastr) {
        /* jshint validthis: true */
        var vm = this;
        //接收的参数
        var argsProduct = $stateParams.args.product;
        var argsSdk = $stateParams.args.sdk;
        var $tabList = $('li[sdkedit]');

        //浏览器回退事件
        window.onpopstate = function() {
            var hashString = location.hash;
            var hashArr = hashString.split('/');
            // console.log(hashArr);
            if(hashArr[hashArr.length-1] == 'sdk-edit') {
                addClassActive(0);
            } else if(hashArr[hashArr.length-1] == 'detail') {
                console.log('back to sdk');
            } else if(hashArr[hashArr.length-1] == 'profile') {
                addClassActive(1);
            } else if(hashArr[hashArr.length-1] == 'configuration') {
                addClassActive(2);
            } else if(hashArr[hashArr.length-1] == 'notification') {
                addClassActive(3);
            } else if(hashArr[hashArr.length-1] == 'data') {
                addClassActive(4);
            }
        }
        
        //back
        vm.backToProSdk = function() {
            $state.go('app.productTab', {HNATenantName:UserInfoServer.tenantName(),args : argsProduct});
        }
        vm.goBasic = function() {
            $state.go('app.sdkEdit', {HNATenantName:UserInfoServer.tenantName(),args : {product: argsProduct, sdk: argsSdk}});
        }
        vm.goProfile = function() {
            $state.go('app.sdkEdit.editProfile', {args : {product: argsProduct, sdk: argsSdk}});
        }
        vm.goConfiguration = function() {
            $state.go('app.sdkEdit.editConfiguration', {args : {product: argsProduct, sdk: argsSdk}});
        }
        vm.goNotification = function() {
            $state.go('app.sdkEdit.editNotification', {args : {product: argsProduct, sdk: argsSdk}});
        }
        vm.goData = function() {
            $state.go('app.sdkEdit.editData', {args : {product: argsProduct, sdk: argsSdk}});
        }

        function addClassActive(index) {
             $tabList.eq(index).addClass('active font-bold').siblings().removeClass('active font-bold');
        }
    }

})();
