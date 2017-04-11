(function () {
    'use strict';

    angular.module('iot').controller('EditTopic', EditTopic);

    /** @ngInject */
    function EditTopic($scope, $state, $stateParams, NetworkService, constdata, $uibModal, toastr) {
        /* jshint validthis: true */
        var vm = this;

        var product = $stateParams.args.product;
        
        vm.editTopicData = $stateParams.args.topic;
        //按钮是否可用
        vm.originDes = $stateParams.args.topic.description;

        vm.des = {
            "description": vm.editTopicData.description
        }

        vm.saveTopicData = function() {
            NetworkService.put(constdata.api.product.topicUpdatePath+'/'+product.name+'/topics/'+vm.editTopicData.name,vm.des,function (response) {
                
                toastr.success('修改成功!');
                $state.go('app.productTab.productTopic', {args : product});
            },function (response) {
                toastr.error('修改失败!' + response.statusText);
                console.log('Status' + response.status);
            });
        }
        vm.backToTopic = function() {
            $state.go('app.productTab.productTopic', {args:product});
        }

    }

})();
