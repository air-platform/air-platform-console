(function () {
    'use strict';

    angular.module('iot').controller('productTabCtrl', productTabCtrl);

    /** @ngInject */
    function productTabCtrl($state, $stateParams, UserInfoServer, constdata, $uibModal, $log, toastr) {
        /* jshint validthis: true */
        var vm = this;
        
        var $tabList = $('li[sdk]');
        var argsProduct = $stateParams.args;
        
        //浏览器回退事件
        window.onpopstate = function() {
            var hashString = location.hash;
            var hashArr = hashString.split('/');
            // console.log(hashArr);
            if(hashArr[hashArr.length-1] == 'detail') {
                addClassActive(0);
            } else if (hashArr[hashArr.length-1] == 'topic') {
                addClassActive(1);
            }else if (hashArr[hashArr.length-1] == 'eventmapping') {
                addClassActive(2);
            }else if (hashArr[hashArr.length-1] == 'notification-topic') {
                addClassActive(3);
            }
        }

        vm.backToProductList = function() {
            $state.go('app.product');
        }

        vm.goTopic = function() {
            $state.go('app.productTab.productTopic',{args : argsProduct});
        }

        vm.goSdk = function() {
            $state.go('app.productTab',{HNATenantName:UserInfoServer.tenantName(),args : argsProduct});
        }
        
        vm.goEventMapping = function() {
            $state.go('app.productTab.productEventMapping',{args : argsProduct});
        }

        vm.goNotificationTopic = function() {
            $state.go('app.productTab.productNotificationTopic',{args : argsProduct});
        }

        function addClassActive(index) {
             $tabList.eq(index).addClass('active font-bold').siblings().removeClass('active font-bold');
        }
    }

})();
