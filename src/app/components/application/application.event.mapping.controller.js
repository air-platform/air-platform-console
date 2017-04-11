(function () {
    'use strict';

    angular.module('iot').controller('ApplicationEmController', ApplicationEmController);

    /** @ngInject */
    function ApplicationEmController($state, $stateParams, NetworkService, constdata, toastr,UserInfoServer) {
        /* jshint validthis: true */
        var vm = this;

        var eventClassFamilyId = $stateParams.evId;
        var applicationName = $stateParams.args.applicationName;

        function getDatas() {
            NetworkService.get(constdata.api.application.appsPath + '/' + applicationName + '/' + 'eventmappings' + '/' + eventClassFamilyId,null,function (response) {
                vm.showedEmData = response.data;
                // console.log(vm.showedEmData);
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }

        getDatas();


        
        vm.backToEventMapping = function() {
            $state.go('app.applicationDetail',{args:{tabSelectedIndex : 1},HNATenantName:UserInfoServer.tenantName(),applicationName:$stateParams.args.applicationName});
        }



    }

})();
