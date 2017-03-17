(function () {
    'use strict';

    angular.module('iot').controller('AddFormCtrlPro', AddFormCtrlPro);

    /** @ngInject */
    function AddFormCtrlPro($state, $stateParams, NetworkService, constdata, toastr, i18n, logger) {
        /* jshint validthis: true */
        var vm = this;

        vm.userVerifier = [
            {
                title:i18n.t('product.CHECK'),
                value:'default'
            },
            {
                title:i18n.t('product.TRUSTFUL'),
                value:'trustful'
            }
        ];
        vm.credentialsProviderValue = 'default';

        getData();

        vm.saveInfo = function() {
            if($stateParams.proName == '') {
                if(vm.newProInfo.name == '') {
                    toastr.error(i18n.t('product.NOTCOMPLETE'));
                } else {
                    vm.newProInfo.credentialsProvider = vm.credentialsProviderValue;
                    logger.info(vm.newProInfo);
                    NetworkService.post(constdata.api.product.addPath,vm.newProInfo,function (response) {
                        
                        toastr.success(i18n.t('u.ADD_SUC'));
                        $state.go('app.product');
                    },function (response) {
                        toastr.error(response.statusText);
                    });
                }
                
            } else {
                var jsonOfAddedPro = JSON.stringify( vm.newProInfo );
                NetworkService.put(constdata.api.product.updatePath+'/'+vm.newProInfo.name,vm.newProInfo,function (response) {
                    
                    toastr.success(i18n.t('u.CHANGE_SUC'));
                    $state.go('app.product');
                },function (response) {
                    toastr.error(response.statusText);
                    console.log(response.status);
                });
            }
        }

        vm.backToPro = function() {
            $state.go('app.product');
        }
        
        function getProById() {
            NetworkService.get(constdata.api.product.productInfoPath,$stateParams.proName,function (response) {
               //console.log(response.data);
               //tip: 1. response.data is an array 2. we should send 'null' to the service
               vm.newProInfo = response.data;
            },function (response) {
                console.log('Error');
                toastr.error(response.statusText);
                // console.log('Status' + response.status);
            });
        }

        function getData() {
            if($stateParams.proName == '') {
                vm.title = i18n.t('product.ADDPRODUCT');
                vm.newProInfo = {
                    "name": "",
                    "displayName": "",
                    "allowAutoRegister": false,
                    "active": true,
                    "description": ""
                }
            } else {
                vm.title = i18n.t('product.MODIFYPRODUCT');
                getProById();
            }
        }
        
    }

})();
