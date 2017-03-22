(function () {
    'use strict';

    angular.module('iot').controller('ProductSdkListCtrl', ProductSdkListCtrl);

    /** @ngInject */
    function ProductSdkListCtrl($scope, $state, $stateParams, NetworkService, constdata, $uibModal, $log, toastr,StorageService,UserInfoServer, i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        //判断是否为浏览器回退按钮加载的本页面
        isBrowserBackBtn();

        var receivedCheck = vm.argsProduct.credentialsProvider;
        var receivedDesc = vm.argsProduct.description;
        //var benc = i18n.t('product.ENABLE_SERVICE');//'启用云服务';
        //var bdis = i18n.t('product.DISABLE_SERVICE');//'禁用云服务';

        vm.buttonEnable = i18n.t('product.ENABLE_SERVICE');//'启用云服务'
        vm.tipsInfo = delmodaltip;
        vm.userVerifier = [
            {
                title:'验证',
                value:'default'
            },
            {
                title:'信任',
                value:'trustful'
            }
        ];
        vm.platOptions = {
             plat : [
                {val:'android',name:'Android'},
                {val:'objc',name:'iOS'},
                {val:'java',name:'Java'},
                {val:'c',name:'C'}
             ]
        };
        vm.platforms = [];
        vm.isDataChanged = false;
        console.log(vm.argsProduct);
        //更新产品信息
        vm.modifiedProductInfo = {
            name : vm.argsProduct.name,
            displayName : vm.argsProduct.displayName,
            accessUrl:vm.argsProduct.accessUrl,
            accessToken:vm.argsProduct.accessToken,
            credentialsProvider:receivedCheck,
            description : receivedDesc
        }


        //监听模型变化
        var watcherName = $scope.$watch('vm.modifiedProductInfo.name',function(newName, oldName) {
            if(newName!==oldName) {
                vm.isDataChanged = true;
                //解除监听
                // watcherName();
                // watcherDes();
            } else {
                vm.isDataChanged = false;
            }
        });
        //监听展示名称变化
        var watcherDisplayName = $scope.$watch('vm.modifiedProductInfo.displayName',function(newName, oldName) {
            if(newName!==oldName) {
                vm.isDataChanged = true;
                //解除监听
                // watcherName();
                // watcherDes();
            } else {
                vm.isDataChanged = false;
            }
        });
        //监听描述变化
        var watcherDes = $scope.$watch('vm.modifiedProductInfo.description',function(newDes, oldDes) {
            if(newDes!==oldDes) {
                vm.isDataChanged = true;
                //解除监听
                // watcherDes();
                // watcherName();
            } else {
                vm.isDataChanged = false;
            }
        });

        vm.UpdataProduct = function() {

            if(vm.buttonEnable == i18n.t('product.ENABLE_SERVICE')){
                vm.buttonEnable = i18n.t('product.DISABLE_SERVICE');
                toastr.success(i18n.t('product.ENABLE_SERVICE') + ' 成功!');
            }else{
                vm.buttonEnable = i18n.t('product.ENABLE_SERVICE');
                toastr.success(i18n.t('product.DISABLE_SERVICE') + ' 成功!');
            }

           /* if(($stateParams.args.displayName == vm.modifiedProductInfo.displayName)&&($stateParams.args.description == vm.modifiedProductInfo.description)&&(receivedCheck==vm.modifiedProductInfo.credentialsProvider)) {
                toastr.error('内容没发生变化，请修改后再提交!');
                vm.isDataChanged = false;
            } else {
                NetworkService.put(constdata.api.product.updatePath+'/'+vm.argsProduct.name,vm.modifiedProductInfo,function (response) {     
                    toastr.success('更新成功!');
                    receivedCheck = vm.modifiedProductInfo.credentialsProvider;
                    vm.isDataChanged = false;
                },function (response) {
                    toastr.error('更新失败:' + response.statusText);
                    console.log(response.status);
                    // console.log('Status' + response.status);
                });
            } */
        }

        vm.selectedUVChanged = function () {
            vm.isDataChanged = true;
        }

        //getSdks();

        //edit detail
        vm.editDetail = function(index) {
            // $state.go('app.editFormTabs', {args : {tabId : 0, product: vm.argsProduct, sdk: vm.sdks[index]}});
            $state.go('app.sdkEdit', {HNATenantName:UserInfoServer.tenantName(),args : {product: vm.argsProduct, sdk: vm.sdks[index]}});
        }
        
        vm.delSdk = function (size,index) {
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
                var nameOfDelPro = vm.argsProduct.name;
                var versionOfSdk = vm.sdks[index].version;
                // console.log(nameOfDelPro);
                NetworkService.delete(constdata.api.product.deleteSdkPath+'/'+nameOfDelPro+'/profiles/v'+versionOfSdk,null,function (response) {
                    toastr.success('删除成功!');
                    // console.log(vm.infos);
                    vm.sdks.splice(index, 1);
                    
                },function (response) {
                    toastr.error('删除失败!');
                    console.log('Status' + response.status);
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        
        //add sdk
        
        vm.addSdk = function() {
            $state.go('app.addSdk',{args: vm.argsProduct});
        }

        var BASE_API_URL = constdata.apiHost_ONLINE;
        if (constdata.debugMode){
            BASE_API_URL = constdata.apiHost_OFFLINE;
        };
        //dowload Sdk
        vm.downLoadSdk = function(index) {
            // console.log(vm.sdks[index].plat);
            var token = StorageService.get('iot.hnair.cloud.access_token');
            var downloadUrl = BASE_API_URL + 'products/' + vm.argsProduct.name + '/profiles/v' + vm.sdks[index].version + '/sdk?platform=' + vm.sdks[index].plat + '&token=' + token;
            downloadFile(downloadUrl);
        }

        function downloadFile(url) {
            // console.log(url.length);
            window.open(url);
        }

        function hasNameAttr(obj){
            for (var name in obj){
                return false;
            }
            return true;
        };

        function isBrowserBackBtn() {
            if(hasNameAttr($stateParams.args)) {
                //浏览器回退按钮加载的本页面
                vm.argsProduct = JSON.parse( sessionStorage.getItem('sessionStoredProduct') ).product
            } else {
                //路由跳转加载的，要本地存储
                vm.argsProduct = $stateParams.args;
                sessionStorage.setItem('sessionStoredProduct',JSON.stringify({
                    product: $stateParams.args
                }));
            }
        }

        function getSdks() {
            NetworkService.get(constdata.api.product.productInfoPath + '/' + vm.argsProduct.name + '/profiles',null,function (response) {
                // console.log('get success');
                vm.sdks = response.data.content;
                // console.log(vm.sdks);
                for(var i=0; i<vm.sdks.length; i++) {
                    vm.sdks[i].plat = 'android';
                }
            },function (response) {
                toastr.error('SDK error : ' + response.statusText);
                console.log('Error');
                console.log('Status' + response.status);
            });
        }

    }

})();
