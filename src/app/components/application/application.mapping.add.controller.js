/**
 * Created by Otherplayer on 16/8/8.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('iot').controller('AddMappingApplicationController', AddMappingApplicationController);

    /** @ngInject */
    function AddMappingApplicationController($stateParams,toastr,constdata,$uibModal,$log,NetworkService,$state,$translate,UserInfoServer,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        var typeISApp = true;
        var submitPath = constdata.api.application.appsPath;
        //当选择的showName请求回来的版本是“无”时，添加按钮不可用
        vm.isSelectValid = false;

        var targetName = $stateParams.targetName;
        var type = $stateParams.args.type;
        if (type == 'product'){
            typeISApp = false;
            submitPath = constdata.api.product.productPath;
        }

        vm.items = [];
        // vm.itemsOption = ['BOTH','SOURCE','SINK'];
        vm.itemsOption = [{value:'BOTH',title:i18n.t('u.BOTH')},{value:'SOURCE',title:i18n.t('u.SEND')},{value:'SINK',title:i18n.t('u.REC')}];
        vm.infos = [];
        vm.schemaVersions = [];
        vm.selectedValue = null;  //选择的ECF
        vm.selectedVersion = null;//选择的版本


        //获取可选择的ECF列表
        function getECFDatas() {
            NetworkService.get(constdata.api.event.eventPath,null,function (response) {
                vm.infos = response.data.content;
                vm.selectedValue = vm.infos[0];
                vm.schemaVersions = vm.selectedValue.schemaVersions;
                // if(vm.schemaVersions.length == 0){
                //     vm.schemaVersions = [{version : '无'}]
                //     vm.selectedVersion = vm.schemaVersions[0];
                //     // vm.selectedVersion = '无'
                // } else {
                //     vm.selectedVersion = vm.schemaVersions[0];
                //     vm.selectedVersionChanged();
                // }

                vm.selectedVersion = vm.schemaVersions[0];
                vm.selectedVersion ? vm.selectedVersionChanged() : console.log();

            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }


        //获取ECF每一项的内容列表
        function getECFDetailSchema(eventId,version) {
            NetworkService.get(constdata.api.event.eventPath + '/' + eventId + '/' + 'schemas/v' + version,null,function (response) {


                var tempItems = response.data;
                for (var i = 0; i < tempItems.length; i++){
                    tempItems[i].action = 'BOTH';
                    tempItems[i].tmpAction = vm.itemsOption[0];
                }
                vm.items = tempItems;

            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        }

        vm.submitAction = function () {

            var targetItems = [];
            for (var i = 0; i < vm.items.length; i++){
                var tempItem = vm.items[i];
                var p = {eventClassId:tempItem.id,action:tempItem.action};
                targetItems.push(p);
            }

            var params = {eventClassFamilyId:vm.selectedValue.id,eventSchemaVersion:vm.selectedVersion.version,eventMappings:targetItems};

            NetworkService.post(submitPath + '/' + targetName + '/' + 'eventmappings',params,function (response) {
                toastr.success(i18n.t('u.ADD_SUC'));
                vm.cancelAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });

        }
        vm.cancelAction = function () {
            if (typeISApp){
                // $rootScope.backPre();
                $state.go('app.applicationDetail',{applicationName:targetName,HNATenantName:UserInfoServer.tenantName(),args:{tabSelectedIndex:1}});
            }else{
                $state.go('app.productTab.productEventMapping',{args: $stateParams.args.ext});
                // window.history.back();
            }
        }
        
        
        vm.selectedFamilyChanged = function () {
            // console.log(vm.selectedValue);
            vm.schemaVersions = vm.selectedValue.schemaVersions;
            vm.selectedVersion = null;
            vm.items = [];
            if(vm.schemaVersions && vm.schemaVersions.length > 0){
                vm.isSelectValid = true;
                vm.selectedVersion = vm.schemaVersions[0];
                getECFDetailSchema(vm.selectedValue.id,vm.selectedVersion.version);
            } else if(vm.schemaVersions && vm.schemaVersions.length == 0) {
                vm.schemaVersions = [{version: $translate.instant('product.NONE')}];
                // vm.schemaVersions = [{version: '无'}];
                vm.selectedVersion = vm.schemaVersions[0];
                vm.isSelectValid = false;
            }
        }
        vm.selectedVersionChanged = function () {
            vm.isSelectValid = true;
            getECFDetailSchema(vm.selectedValue.id,vm.selectedVersion.version);
        }
        vm.selectedActionChanged = function (index) {
            vm.items[index].action = vm.items[index].tmpAction.value;
        }

        vm.removeEventMappingItem = function (item) {
            var index = vm.items.indexOf(item);
            vm.items.splice(index,1);
            toastr.success(i18n.t('u.DELETE_SUC'));
        }

        getECFDatas();


        //Model

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

        vm.shouldUpperCase = function (v) {
            return v.replace(/(\w)/,function(v){return v.toUpperCase()});
        }

    }

})();
