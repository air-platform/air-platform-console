(function () {
    'use strict';

    angular.module('iot').controller('productTopicCtrl', productTopicCtrl);

    /** @ngInject */
    function productTopicCtrl($state, $stateParams, NetworkService, constdata, $uibModal, $log, toastr, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;

        var argsProduct = {};

        vm.tipsInfo = delmodaltip;

        isBrowserBackBtn();

        getTopics();

        vm.addTopic = function(topicId) {
            $state.go('app.addTopic',{args: argsProduct})
        }

        vm.editTopic = function(index) {
            $state.go('app.editTopic',{args: {product : argsProduct,topic : vm.TopicDatas[index]}})
        }

        vm.sendTopicEmail = function(index) {
        	$state.go('app.sendNoification',{args:{product:argsProduct,topic:vm.TopicDatas[index]}})
        }
        
        vm.removeTopic = function (size,index) {
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
                var nameOfDelProduct = argsProduct.name;
                var nameOfDelTopic = vm.TopicDatas[index].name;
                NetworkService.delete(constdata.api.product.topicDeletePath+'/'+nameOfDelProduct+'/topics/'+nameOfDelTopic,null,function (response) { 
                    toastr.success('删除成功!');
                    vm.TopicDatas.splice(index, 1);
                },function (response) {
                    toastr.error('删除失败!:' + response.statusText);
                    console.log('Status' + response.status);
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        function isBrowserBackBtn() {
            if(hasNameAttr($stateParams.args)) {
                //浏览器回退按钮加载的本页面
                argsProduct = JSON.parse( sessionStorage.getItem('sessionStoredProduct') ).product
            } else {
                //路由跳转加载的，要本地存储
                argsProduct = $stateParams.args;
            }
        }

        function getTopics() {
            NetworkService.get(constdata.api.product.topicListAllPath+'/'+argsProduct.name+'/topics',null,function (response) {
                vm.TopicDatas = response.data.content;
            
            },function (response) {
                toastr.error('获取数据失败：' + response.statusText);
                console.log('Error');
                console.log('Status' + response.status);
            });
        }

        function hasNameAttr(obj){
            for (var name in obj){
                return false;
            }
            return true;
        };

    }

})();
