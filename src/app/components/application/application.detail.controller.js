/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('iot').controller('ApplicationDetailController', ApplicationDetailController);

    /** @ngInject */
    function ApplicationDetailController(NetworkService,constdata,$state,$stateParams,toastr,StorageService,$uibModal,$log,UserInfoServer,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;

        vm.info = {};
        vm.emInfos = [];
        vm.applicationName = $stateParams.applicationName;
        vm.tabs = [
            {title:i18n.t('u.APP_INFO'),fun:'basic'},
           // {title:i18n.t('u.EVENT_MAP'),fun:'event'},
            //{title:i18n.t('u.USER_V'),fun:'verify'}
        ];
        vm.tabSelectedIndex = $stateParams.args.tabSelectedIndex;
        vm.selItem = $stateParams.args.selItem;
        vm.tapAction = tapAction;
        vm.appId = vm.selItem.id;
        //vm.info = vm.selItem;

        // var tenant = localStorage.getItem(constdata.tenant);
        // var prefix = '';
        // if (tenant && tenant.length > 0){
        //     prefix = 'tenant-' + tenant;
        // }


        vm.buttonEnable = i18n.t('product.ENABLE_APP');//'启用云服务'
        vm.UpdataProduct = function() {

            if(vm.buttonEnable == i18n.t('product.ENABLE_APP')){
                vm.buttonEnable = i18n.t('product.DISABLE_APP');
                toastr.success(i18n.t('product.ENABLE_APP') + ' 成功!');
            }else{
                vm.buttonEnable = i18n.t('product.ENABLE_APP');
                toastr.success(i18n.t('product.DISABLE_APP') + ' 成功!');
            }

        }



        function chooseTab() {
            if (vm.tabSelectedIndex == 1){
                $state.go('app.applicationDetail.event',{applicationName:vm.applicationName});
            }else if (vm.tabSelectedIndex == 2){
                $state.go('app.applicationDetail.verify',{applicationName:vm.applicationName});
            }else{
                $state.go('app.applicationDetail.basic',{applicationName:vm.applicationName, applicationId:vm.selItem.id});
            }
        }

        chooseTab();

        function tapAction(item) {
            if (item == 'event'){
                vm.tabSelectedIndex = 1;
            }else if (item == 'verify'){
                vm.tabSelectedIndex = 2;
            }else{
                vm.tabSelectedIndex = 0;
            }

            chooseTab();
        }

        function getBasicDatas() {

            NetworkService.get(constdata.api.application.appsPath + '/' + vm.appId,null,function (response) {
                vm.info = response.data.data;
                vm.originDes = vm.info.description;
                vm.choosedVerify.val = vm.info.verifierToken;
                
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }
        //获取验证信息
       vm.choosedVerify =[ {
            val : '',
            displayName : ''
        }];
        //获取所有验证信息
        vm.checkWays = [];
        function getAllVerifyInfo() {
            NetworkService.get(constdata.api.application.appsPath + '/' + vm.applicationName + '/userverifiers',null,function (response) {
                // 被选中的app可修改的验证信息
                vm.verifyDatas = response.data;
                // console.log(response.data[0].displayName);
                for(var i=0; i<vm.verifyDatas.length; i++){
                    if(vm.verifyDatas[i].displayName == null) {
                        ;
                    } else {
                        var obj = {};
                        // obj.displayName = (vm.verifyDatas[i].type == 'trustful' ? '信任验证':'REST验证');
                        obj.displayName = vm.verifyDatas[i].displayName;
                        obj.val = vm.verifyDatas[i].verifierToken;
                        vm.checkWays.push(obj);
                    }
                }
                // console.log(vm.checkWays);
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }
        //getAllVerifyInfo();
        function getEventMappings() {
            NetworkService.get(constdata.api.application.appsPath + '/' + vm.applicationName + '/' + 'eventmappings',null,function (response) {
                vm.emInfos = response.data;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        };
        
        vm.removeEventMappingItem = function (item) {
            NetworkService.delete(constdata.api.application.appsPath + '/' + vm.applicationName + '/' + 'eventmappings' + '/' + item.id,null,function success() {
                var index = vm.emInfos.indexOf(item);
                vm.emInfos.splice(index,1);
                toastr.success(i18n.t('u.DELETE_SUC'));
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        };
        vm.gotoDetail = function (item) {
            // console.log(item);
            $state.go('app.eventMpApplication',{evId:item.id,args:{applicationName:vm.applicationName}});
        };


        vm.displayedCollection = [].concat(vm.emInfos);


        vm.backAction = function () {
            $state.go('app.application');
        };

        getBasicDatas();
       // getEventMappings();

        //add eventMapping
        vm.addEventMapping = function() {
            $state.go('app.addMapping4Application',{targetName:vm.applicationName,HNATenantName:UserInfoServer.tenantName(),args:{type:'application'}});
        }


        //download sdk
        vm.platform = 'android';
        vm.downLoadOptions = [
            {
                name : "Android",
                value : 'android'
            },
            {
                name : "iOS",
                value : "objc"
            },
            {
                name : i18n.t('application.DESKTOP'),
                value : "java"
            }
        ];
        var BASE_API_URL = constdata.apiHost_ONLINE;
        if (constdata.debugMode){
            BASE_API_URL = constdata.apiHost_OFFLINE;
        };
        vm.downloadSDK = function (platform) {
            // console.log(platform);
            var token = StorageService.get('iot.hnair.cloud.access_token');
            var downloadUrl = BASE_API_URL + 'apps' + '/' + vm.applicationName + '/' + 'sdk' + '?' + 'platform=' + platform + '&token=' + token;
            downloadFile(downloadUrl);
        }

        function downloadFile(url) {
            console.log(url.length);
            window.open(url);
        }

        function editItem() {
            vm.editData = {
                "verifierToken": vm.choosedVerify.val,
                "description": vm.info.description,
                "displayName":vm.info.displayName
            }
            // console.log(vm.editData);
            NetworkService.put(constdata.api.application.appsPath + '/' + vm.applicationName,vm.editData,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });
        }
        vm.submitAction = function () {
            editItem();
        }
        //添加用户验证
        vm.addCheck = function() {
            $state.go('app.addVerify',{HNATenantName:UserInfoServer.tenantName(),args : {appName:vm.applicationName,index:0,isAdd:true}});
        }
        //编辑用户验证
        vm.editVerify = function(index) {
            var appId = vm.verifyDatas[index].id;
            var verifyType = vm.verifyDatas[index].type;
            // console.log(verifyType);
            $state.go('app.addVerify',{args : {HNATenantName:UserInfoServer.tenantName(),appName:vm.applicationName,appId:appId,isAdd:false,verifyType:verifyType}});
        }

        //Model
        //删除事件
        vm.tipsInfo = delmodaltip;
        vm.openAlert = function (size,model) {
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
                vm.removeEventMappingItem(model);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        //删除验证
        vm.removeVerifyItem = function (index) {
            var verifyId = vm.verifyDatas[index].id
            NetworkService.delete(constdata.api.application.appsPath + '/' + vm.applicationName + '/' + 'userverifiers' + '/' + verifyId,null,function success() {
                vm.verifyDatas.splice(index,1);
                // vm.emInfos.splice(index,1);
                toastr.success(i18n.t('u.DELETE_SUC'));
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('OPERATE_FAILED') + vm.authError);
            });
        };
        vm.openVerifyDeleteAlert = function (size,index) {
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
                vm.removeVerifyItem(index);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

    }

})();