(function () {
    'use strict';

    angular.module('iot').controller('SdkEditBasicCtrl', SdkEditBasicCtrl);

    /** @ngInject */
    function SdkEditBasicCtrl($scope, $uibModal, $log, $state, $stateParams, NetworkService, constdata, toastr) {
        /* jshint validthis: true */
        var vm = this;
        //接收的参数
        var argsProduct = $stateParams.args.product;
        var argsSdk = $stateParams.args.sdk;
        var ProductName = argsProduct.name;
        var arrAddedEv;

        vm.sdkInfo = argsSdk;
        vm.originDes = $stateParams.args.sdk.description;
        vm.selected1 = '';
        vm.selected2 = '';
        vm.isChanged = false;
        vm.evtFamiliesOptsShowedLeft = [];
        vm.evtFamiliesOptsSended = [];

        //选择了的事件id
        arrAddedEv = vm.sdkInfo.aefMapIds;
        //发送过的事件id数组
        vm.sendedEvsIdArr = vm.sdkInfo.aefMapIds;

        vm.addEvs = function() {
            for(var i=0; i<vm.evtFamiliesOptsShowedLeft.length; i++) {
                if(vm.evtFamiliesOptsShowedLeft[i].id == vm.selected1) {
                    vm.evtFamiliesOptsSended.push(vm.evtFamiliesOptsShowedLeft[i]);
                    vm.evtFamiliesOptsShowedLeft.splice(i,1);
                    arrAddedEv.push(Number( vm.selected1 ));
                }
            }
            vm.selected1 = '';
            vm.selected2 = '';
        }

        //移除事件
        vm.removeEvs = function() {
            for(var i=0; i<vm.evtFamiliesOptsSended.length; i++) {
                if(vm.evtFamiliesOptsSended[i].id == Number(vm.selected2)) {
                    vm.evtFamiliesOptsShowedLeft.push(vm.evtFamiliesOptsSended[i]);
                    vm.evtFamiliesOptsSended.splice(i,1);
                    for(var j=0; j<arrAddedEv.length; j++) {
                        if(arrAddedEv[j] == Number(vm.selected2)) {
                            arrAddedEv.splice(j,1);
                        }
                    }

                }
            }
            vm.selected1 = '';
            vm.selected2 = '';

        }

        getEventMappings();
        
        //提交事件
        vm.addEventClassFamilies = function() {
            //要提交的事件数据
            vm.sendEvData = {  
                "name": vm.sdkInfo.name,
                "description": vm.sdkInfo.description,
                "aefMapIds": arrAddedEv
            }

            NetworkService.put(constdata.api.product.profileUpdatePath+'/'+ProductName+'/profiles/v'+argsSdk.version,vm.sendEvData,function (response) {
                    toastr.success('修改成功!');
                    arrAddedEv = [];
                    vm.isChanged = true;
                    vm.selected1 = '';
                    vm.selected2 = '';
            },
            function (response) {
                 toastr.error('修改失败!');
                console.log('Error');
                console.log('Status' + response.status);
            });        
        }

        function getEventMappings() {
            NetworkService.get(constdata.api.product.productPath + '/' + ProductName + '/' + 'eventmappings',null,function (response) {
                vm.eventMappings = response.data;
                // console.log(vm.eventMappings);
                for(var i=0; i<vm.eventMappings.length; i++) {
                    var version = ' (v' + vm.eventMappings[i].eventSchemaVersion + ')'
                    var evOptSingle = {
                        //id : vm.eventFamilies[i].eventClassFamilyId,
                        id : vm.eventMappings[i].id,
                        displayName : vm.eventMappings[i].eventClassFamilyDisplayName + version
                    }
                    vm.evtFamiliesOptsShowedLeft.push(evOptSingle);
                }
                //循环取出相同和不同元素
                if(vm.sendedEvsIdArr.length == vm.evtFamiliesOptsShowedLeft.length) {
                    var arr1 = [], arr2 = vm.sendedEvsIdArr;
                    for(var i=0; i<vm.evtFamiliesOptsShowedLeft.length; i++) {
                        arr1.push(vm.evtFamiliesOptsShowedLeft[i].id);
                    }
                    arr1.sort();
                    arr2.sort();
                    if(arr1.toString()==arr2.toString()) {
                        vm.evtFamiliesOptsSended = vm.evtFamiliesOptsShowedLeft;
                        vm.evtFamiliesOptsShowedLeft = [];
                    }
                } else if(vm.sendedEvsIdArr.length==0){
                    // vm.evtFamiliesOptsShowedLeft = vm.evtFamiliesOptsShowedLeft;
                    vm.evtFamiliesOptsSended = [];
                } else {

                    var arrDif = [];
                    var arrSame = [];
                    for(var i=0; i<vm.evtFamiliesOptsShowedLeft.length; i++) {
                        var flag = true;
                        for(var j=0; j<vm.sendedEvsIdArr.length; j++) {
                            if(vm.evtFamiliesOptsShowedLeft[i].id == vm.sendedEvsIdArr[j]) {
                                flag = false;
                            }
                        }
                        if(flag) {
                            //没找到
                            arrDif.push(vm.evtFamiliesOptsShowedLeft[i]);
                        } else {
                            arrSame.push(vm.evtFamiliesOptsShowedLeft[i]);
                        }
                    }
                    vm.evtFamiliesOptsShowedLeft = arrDif;
                    vm.evtFamiliesOptsSended = arrSame;
                }
                
                // console.log(arrDif);
                

                //监听是否数据发生了变化
                vm.sendEvData1 = {
                    "obj": vm.sdkInfo,
                    "aefMapIds": arrAddedEv
                }
                var watcher = $scope.$watch('vm.sendEvData1',function(newValue, oldValue) {
                    if(newValue!=oldValue) {
                        vm.isChanged = true;
                        watcher();
                    }
                }, true)

            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });
        };
        
    }

})();
