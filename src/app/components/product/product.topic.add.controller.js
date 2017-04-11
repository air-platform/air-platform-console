(function () {
    'use strict';

    angular.module('iot').controller('AddTopic', AddTopic);

    /** @ngInject */
    function AddTopic($state, $stateParams, NetworkService, constdata, toastr) {
        /* jshint validthis: true */
        var vm = this;
        
        vm.argsProduct = $stateParams.args;
        vm.isMandatory = true;
        vm.options = [
            {val:true, show:'强制订阅'},
            {val:false, show:'可选订阅'}
        ]

        vm.editTopicData = {
            "name" : '',
            "type" : '',
            "description" : ''
        };

        vm.saveAddedTopicData = function() {
            if(vm.isMandatory) {
                vm.editTopicData.type = 'mandatory'
            } else {
                vm.editTopicData.type = 'optional'
            }
            NetworkService.post(constdata.api.product.addTopicPath + '/' + vm.argsProduct.name + '/topics',vm.editTopicData,function (response) {
                // console.log('save success');
                toastr.success('添加成功');
                $state.go('app.productTab.productTopic',{args: vm.argsProduct});
            },function (response) {
                console.log('Error');
                console.log('Status' + response.status);
                toastr.error(response.statusText);
            });
            
        }

        vm.backToTopic = function() {
            $state.go('app.productTab.productTopic',{args: vm.argsProduct});
        }

    }

})();
