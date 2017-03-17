(function () {
    'use strict';

    angular.module('iot').controller('EmController', EmController);

    /** @ngInject */
    function EmController($state, $stateParams, NetworkService, constdata, toastr) {
        /* jshint validthis: true */
        var vm = this;

        var eventClassFamilyId = $stateParams.evId;
        var productName = $stateParams.args.productName;

        getDatas();
        
        vm.backToEventMapping = function() {
            $state.go('app.productTab.productEventMapping',{args:{}});
        }

        function getDatas() {
            NetworkService.get(constdata.api.product.listAllPath + '/' + productName + '/' + 'eventmappings' + '/' + eventClassFamilyId,null,function (response) {
                vm.showedEmData = response.data;
                // console.log(vm.showedEmData);
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }

    }

})();
