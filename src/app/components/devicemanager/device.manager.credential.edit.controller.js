/**
 * Created by Otherplayer on 16/7/27.
 */
/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('iot').controller('EditCredentialController', EditCredentialController);

    /** @ngInject */
    function EditCredentialController(NetworkService,constdata,$state,$scope,i18n,$stateParams,toastr,StorageService) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.info = {};
        vm.title = i18n.t('device.ADD_BOOK');
        vm.impTip2 = i18n.t('device.ADD_BOOK_TIP');
        vm.isAdd = true;
        vm.shouldShowBackAction = $stateParams.args.showBack;
        vm.fileName = '';
        vm.products = [];
        vm.productOption = {};
        vm.fileTypeError = '';
        vm.showDownLoadCI = false;
        vm.alreadyGeneralCI = false;
        vm.donwloadLink = '';
        vm.productShow = $stateParams.args.productChoosed;

        vm.isnull = false;

        var isAddModel = $stateParams.args;
        if (!isAddModel){
            vm.isAdd = false;
            vm.title = i18n.t('u.EDIT');
        }

        function getDeviceItem() {

            NetworkService.get(constdata.api.device.deviceInfoPath,null,function (response) {
                // console.log(response);
                vm.info=response.data;
                console.log(vm.info);
            },function (response) {
                // console.log('Error');
                // console.log('Status' + response.status);
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }

        function getProductList() {
            NetworkService.get(constdata.api.product.listAllPath,{page:1,pageSize:1000},function (response) {
                vm.products = response.data.content;

                //过滤
                var ps = [];
                for (var i = 0 ; i < vm.products.length; i++){
                    var p = vm.products[i];
                    if (p.credentialsProvider != 'trustful'){
                        ps.push(p);
                    }
                }

                vm.products = ps;

                if (vm.products && vm.products.length > 0){
                    vm.productOption = vm.products[0];
                    vm.isnull = false;
                }else{
                    vm.isnull = true;
                }


            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }

        vm.isDownloadTipShow = false;
        vm.generalCI = function () {
            vm.fileTypeError = vm.impTip2;
            NetworkService.post(constdata.api.product.listAllPath + '/' + vm.productShow.name + '/keypair',null,function (response) {
                // console.log(response);
                vm.showDownLoadCI = true;
                vm.alreadyGeneralCI = true;
                vm.info.body = response.data.publicKey;
                vm.donwloadLink = response.data.donwloadLink;
                vm.isDownloadTipShow = true;
            },function (response) {
                // console.log('Error');
                // console.log('Status' + response.status);
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }
        
        vm.downloadCI = function () {
            vm.isDownloadTipShow = false;
            var token = StorageService.get('iot.hnair.cloud.access_token');
            var downloadUrl = vm.donwloadLink + '&token=' + token;
            window.open(downloadUrl);
        }
        //下面的是新的下载接口
        // vm.downloadCI = function () {
        //     vm.isDownloadTipShow = false;
        //     var token = StorageService.get('iot.hnair.cloud.access_token');
        //     var credentialsId = '替换成证书的ID';
        //     NetworkService.get(constdata.api.product.listAllPath + '/' + vm.productShow.name + '/credentials/' + credentialsId,null,function (response) {
        //         console.log(response.data);
        //         var downloadUrl = vm.donwloadLink + '&token=' + token;
        //         window.open(downloadUrl);
        //     },function (response) {
        //         // console.log('Error');
        //         // console.log('Status' + response.status);
        //         vm.authError = response.statusText + '(' + response.status + ')';
        //         toastr.error(vm.authError);
        //     });
        // }

        function addItem() {
            console.log(vm.info);
            NetworkService.post(constdata.api.product.listAllPath + '/' + vm.productShow.name + '/credentials',vm.info,function (response) {
                // console.log('Add success');
                toastr.success(i18n.t('u.ADD_SUC'));
                vm.backAction();
            },function (response) {
                // console.log('Error');
                // console.log('Status' + response.status);
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }

        function editItem() {
            NetworkService.post(constdata.api.device.updatePath,vm.user,function (response) {
                // console.log('Update success');
                toastr.success(i18n.t('u.UPDATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }
        vm.submitAction = function () {
            if (vm.isAdd){
                addItem();
            }else{
                editItem();
            }
        }
        
        
        
        vm.selectedVersionChanged = function () {
            // vm.isTrustful = (vm.productOption.credentialsProvider == "trustful");
            // console.log(vm.productOption);
            // console.log(vm.isTrustful);
            vm.info.body = '';
            vm.showDownLoadCI = false;
            vm.donwloadLink = '';
        }
        

        vm.backAction = function () {
            // $rootScope.backPre();
            $state.go('app.credential');
        }

        if (!vm.isAdd){
            getDeviceItem();
        }

        getProductList();

        vm.back = function () {
            vm.backAction();
        }

        var handleFileSelect=function(evt) {
            var file=evt.currentTarget.files[0];
                    var ldot = file.name.lastIndexOf(".");
                    var type = file.name.substring(ldot + 1);

            // if (type == 'pub' || !type){
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function($scope){
                        var newResult = evt.target.result.split(" ")
                        vm.info.body = newResult[1];
                        vm.fileTypeError = '';
                    });
                };
                reader.readAsText(file);
            // }else{
            //     $scope.$apply(function($scope){
            //         vm.fileTypeError = '请上传正确的文件（eg:isa_hna.pub）';
            //     });
            // }
        };

        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    }

})();