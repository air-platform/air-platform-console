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
            {title:i18n.t('u.APP_RUN_INFO'),fun:'run'},
            {title:i18n.t('u.APP_MONITOR_INFO'),fun:'monitor'},
            {title:i18n.t('u.APP_LOG_INFO'),fun:'log'}
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

        vm.allService = [];
        vm.allOpenService = [];
        vm.servicesArr = [];
        vm.buttonEnable = i18n.t('product.ENABLE_APP');//'启用云服务'
        vm.imgArr = [];
        vm.imgArrStr = '';

        vm.showOther = true;
        vm.showDeploy = true;

        vm.OperApp = OperApp;
        console.log(vm.selItem);





        //add info
        function OperApp(index) {
            var item = vm.selItem;
            if(index == 1){
                //console.log(item);

                //$('li#imageId').removeAttr('disabled');
                $state.go('app.applicationImage', {applicationName:item.id, args:{selItem:item}});
            }else if(index == 2){
                $state.go('app.applicationDeploy', {applicationName:item.id, args:{selItem:item}});

            }else if(index == 3){
                //$state.go('app.application', {applicationName:item.id, args:{selItem:item}});
                OperK8s(item,3);
            }else if(index == 4){
                OperK8s(item,4);
            }else if(index == 5){
                $state.go('app.application', {applicationName:item.id, args:{selItem:item}});
            }else if(index == 6){
                //console.log('deleted');
                OperK8s(item,6);
                //$state.go('app.application', {applicationName:item.id, args:{selItem:item}});
            }

            //$state.go('app.applicationedit');
        };




        function OperK8s(item, st){
            console.log(item);
            if(st == 3){
                if(item.state == 'Running' || item.state == 'Pending'){
                    toastr.error('应用已经启动');
                }else{
                    NetworkService.post(constdata.api.application.depPath + '/app/' + item.name + '?namespace=' + vm.userName, '', function (response) {
                        var runInfoTmp = response.data;
                        //toastr.success(i18n.t('u.ADD_SUC'));
                        console.log('start app success.');
                    }, function (response) {
                        //vm.authError = response.statusText + '(' + response.status + ')';
                        //console.log(vm.authError);
                        //toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                        console.log('start app fail.');
                    });

                }

            }else if(st == 4){
                if(item.state == 'Stopped' || item.state == 'created'){
                    toastr.error('应用已经停止');
                }else{
                    NetworkService.post(constdata.api.application.depPath + '/app/' + item.name + '?namespace=' + vm.userName, '', function (response) {
                        var runInfoTmp = response.data;
                        //toastr.success(i18n.t('u.ADD_SUC'));
                        console.log('stop app success.');
                    }, function (response) {
                        //vm.authError = response.statusText + '(' + response.status + ')';
                        //console.log(vm.authError);
                        //toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                        console.log('start app fail.');
                    });

                }

            }else if(st == 6){
                if(item.state == 'created'){
                    toastr.error('应用已经删除');
                }else{
                    NetworkService.delete(constdata.api.application.depPath + '/app/' + item.name + '?namespace=' + vm.userName, '', function (response) {
                        var runInfoTmp = response.data;
                        toastr.success('操作成功');
                        //console.log('stop app success.');
                    }, function (response) {
                        //vm.authError = response.statusText + '(' + response.status + ')';
                        //console.log(vm.authError);
                        //toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                        console.log('delete app fail.');
                    });
                }
            }

        }

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
            console.log('.....');
            console.log(vm.tabSelectedIndex);
            if (vm.tabSelectedIndex == 0){
                $state.go('app.applicationDetail.basic',{applicationName:vm.applicationName, applicationId:vm.selItem.id});
            }else if (vm.tabSelectedIndex == 1){
                $state.go('app.applicationDetail.deploy',{applicationName:vm.applicationName, applicationId:vm.selItem.id});
            }else if (vm.tabSelectedIndex == 2){
                $state.go('app.applicationDetail.monitor',{applicationName:vm.applicationName, applicationId:vm.selItem.id});
            }else if (vm.tabSelectedIndex == 3){
                $state.go('app.applicationDetail.log',{applicationName:vm.applicationName, applicationId:vm.selItem.id});
            }else{
               // $state.go('app.applicationDetail.basic',{applicationName:vm.applicationName, applicationId:vm.selItem.id});
                $state.go('app.applicationDetail.basic',{applicationName:vm.applicationName, applicationId:vm.selItem.id});
            }
        }

        //tapAction(vm.tabs[1])

        function tapAction(item) {
            console.log(item);
            if (item == 'basic'){
                vm.tabSelectedIndex = 0;
            }else if (item == 'run'){
                vm.tabSelectedIndex = 1;
            }else if (item == 'monitor'){
                vm.tabSelectedIndex = 2;
            }else if (item == 'log'){
                vm.tabSelectedIndex = 3;
            }else{
                vm.tabSelectedIndex = 0;
            }
            console.log(vm.tabSelectedIndex);
            chooseTab();
        }

        function getBasicDatas() {

           /* NetworkService.get(constdata.api.application.appsPath + '/' + vm.appId,null,function (response) {*/
                vm.info = vm.selItem;//response.data.data;


                if(vm.info.detailRunInfo != null) {

                    vm.info.detailRunInfo.accessUrl = 'http://223.202.32.56:' + vm.info.detailRunInfo.service.spec.ports[0].nodePort;
                }
                vm.originDes = vm.info.description;
                vm.choosedVerify.val = vm.info.verifierToken;
                vm.servicesArr = vm.info.services.split(',');
                console.log(vm.servicesArr);




                NetworkService.post(constdata.api.product.listAllPath,null,function (response) {
                    vm.infos = response.data[0].userServices;
                    vm.infosUser = response.data[1].userServices;
                    // console.log( vm.infos);
                    vm.displayedCollection = [].concat(vm.infos);
                    vm.displayedUserCollection = [].concat(vm.infosUser);
                    //$scope.sc = [].concat(vm.infos);
                    //console.log(vm.infos);

                    console.log(vm.displayedCollection);
                    console.log(vm.displayedUserCollection);
                    for(var i = 0;  i < vm.displayedCollection.length; i ++){
                        if( vm.displayedCollection[i].api_key != '' && vm.servicesArr.indexOf(vm.displayedCollection[i].api_id) > -1){
                            vm.allOpenService.push(vm.displayedCollection[i]);
                        }
                    }
                    for(var i = 0;  i < vm.displayedUserCollection.length; i ++){
                        if( vm.displayedUserCollection[i].api_key != '' && vm.servicesArr.indexOf(vm.displayedUserCollection[i].api_id) > -1){
                            vm.allOpenService.push(vm.displayedUserCollection[i]);
                        }
                    }
                    console.log(vm.allOpenService);

                },function (response) {
                    toastr.error(response.statusText);
                    console.log('Error');
                    console.log('Status' + response.status);
                });
























                
            /*},function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });

            */


            NetworkService.get(constdata.api.application.imgsAppPath + '/' + vm.appId + '/images',null,function (response) {
                vm.info.imgInfo = response.data[0];
               // vm.originDes = vm.info.description;
                //vm.choosedVerify.val = vm.info.verifierToken;

                for(var i = 0; i < response.data.length; i ++)
                {
                    vm.imgArr.push(response.data[i].img);
                }



                vm.imgArrStr = vm.imgArr.toString()
                console.log(vm.info.imgInfo);
                console.log(vm.imgArrStr);
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








        vm.allLogs = [

            'Mar 31 10:03:33 bogon system_installd[349]: PackageKit: Adding client PKInstallDaemonClient pid=536, uid=200 (/System/Library/CoreServices/Software Update.app/Contents/Resources/softwareupdated)',
            'Mar 31 10:03:33 bogon softwareupdated[536]: PackageKit: Enqueuing install with default quality of service (background)',
            'Mar 31 10:03:33 bogon system_installd[349]: PackageKit: Using background priority for staging request',
            'Mar 31 10:03:33 bogon system_installd[349]: PackageKit: ----- Begin stage -----',
            'Mar 31 10:03:33 bogon system_installd[349]: PackageKit: request=PKInstallRequest <5 packages, destination=/>',





        ];




        var xTime = [];
        var xTimeCpuUser = [],xTimeCpuSystem = [],xTimeCpuAll = [], xTimeMem=[], xTimeNetwork=[], xTimeDisk=[];
        for(var i = 0; i < 30; i ++){
            xTime[i] = '10:'+parseInt(i/10) +'' + i%10 + '';
            xTimeCpuUser[i] = parseInt(20 + Math.random()*5);
            xTimeCpuSystem[i] = parseInt(0 + Math.random()*5);
            xTimeCpuAll[i] = xTimeCpuUser[i] + xTimeCpuSystem[i];
            xTimeMem[i] = parseInt(100+Math.random()*10);
            xTimeNetwork[i] = parseInt(40 + Math.random()*10);
            xTimeDisk[i] = parseInt(100 + Math.random()*30);
        }

        console.log(xTime);

        /*vm.eventOption = {
            title : {
                // text: '事件情况',
                subtext: '',
                left: 'left',
                textStyle: {
                    color: '#666'
                }
            },
            tooltip : {
                trigger: 'axis',
                // formatter: '({b})\n{a}: {c} k',
                // backgroundColor: '#27c24c',
                axisPointer: {
                    /!*lineStyle:{
                        type: 'solid',
                        color: '#23b7e5',
                        width: 2
                    }*!/
                },
                textStyle:{
                    color: '#dcf2f8'
                }
            },
            legend: {
                data:['CPU占用']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            // symbol : null,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xTime,//['10:10','10:15','10:20','10:25','10:30','10:35','10:40'],
                    axisLine: {
                        show: true,
      /!*                  lineStyle: {
                            color: '#23b7e5',
                            width: 2
                        }*!/
                    },
                    splitLine:{
                        show: true,
                       /!* lineStyle: {
                            color: '#dcf2f8'
                        }*!/
                    }
                }

            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value} %'
                    },
                    axisLine: {
                        show: true,
                        /!*lineStyle: {
                            color: '#23b7e5',
                            width: 0.25
                        }*!/
                    },
                    splitLine:{
                        show: true,
                        /!*lineStyle: {
                            color: '#dcf2f8'
                        }*!/
                    }

                }
            ],
            series : [
                {
                    name:'CPU占用',
                    type:'line',
                    //smooth:true,
                    // symbol:'none',
                    data:xTimeCpu, //[15, 20, 15, 25, 30, 10, 5],
                    /!*itemStyle:{
                        normal:{
                            color:'#23b7e5',
                            lineStyle:{
                                color:'#4686CD',
                                width: 4
                            }
                        }
                    },*!/
                    /!*markLine : {
                        data : [
                            {type : 'average', name : '日活跃量'}
                        ],
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    color:'#4686CD'
                                }
                            }
                        }
                    }*!/
                },

            ]
        };*/


        vm.cpuOption = {
            title : {
                // text: '事件情况',
                subtext: '',
                left: 'left',
                textStyle: {
                    color: '#666'
                }
            },
            tooltip : {
                trigger: 'axis',
                // formatter: '({b})\n{a}: {c} k',
                // backgroundColor: '#27c24c',
                axisPointer: {
                    /*lineStyle:{
                     type: 'solid',
                     color: '#23b7e5',
                     width: 2
                     }*/
                },
                textStyle:{
                    color: '#dcf2f8'
                }
            },
            legend: {
                data:['用户CPU','系统CPU','总CPU占用']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            // symbol : null,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xTime,//['10:10','10:15','10:20','10:25','10:30','10:35','10:40'],
                    axisLine: {
                        show: true,
                        /*                  lineStyle: {
                         color: '#23b7e5',
                         width: 2
                         }*/
                    },
                    splitLine:{
                        show: true,
                        /* lineStyle: {
                         color: '#dcf2f8'
                         }*/
                    }
                }

            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value} %'
                    },
                    axisLine: {
                        show: true,
                        /*lineStyle: {
                         color: '#23b7e5',
                         width: 0.25
                         }*/
                    },
                    splitLine:{
                        show: true,
                        /*lineStyle: {
                         color: '#dcf2f8'
                         }*/
                    }

                }
            ],
            series : [
                {
                    name:'用户CPU',
                    type:'line',
                    //smooth:true,
                    // symbol:'none',
                    data:xTimeCpuUser, //[15, 20, 15, 25, 30, 10, 5],
                    itemStyle:{
                         normal:{
                             color:'#ff0000',
                             lineStyle:{
                                color:'#ff0000',
                             }
                         }
                     },
                    /*markLine : {
                     data : [
                     {type : 'average', name : '日活跃量'}
                     ],
                     itemStyle:{
                     normal:{
                     lineStyle:{
                     color:'#4686CD'
                     }
                     }
                     }
                     }*/
                },
                {
                    name:'系统CPU',
                    type:'line',
                    //smooth:true,
                    // symbol:'none',
                    data:xTimeCpuSystem, //[15, 20, 15, 25, 30, 10, 5],
                    itemStyle:{
                        normal:{
                            color:'#00ff00',
                            lineStyle:{
                                color:'#00ff00',
                            }
                        }
                    },
                    /*itemStyle:{
                     normal:{
                     color:'#23b7e5',
                     lineStyle:{
                     color:'#4686CD',
                     width: 4
                     }
                     }
                     },*/
                    /*markLine : {
                     data : [
                     {type : 'average', name : '日活跃量'}
                     ],
                     itemStyle:{
                     normal:{
                     lineStyle:{
                     color:'#4686CD'
                     }
                     }
                     }
                     }*/
                },
                {
                    name:'总CPU占用',
                    type:'line',
                    //smooth:true,
                    // symbol:'none',
                    data:xTimeCpuAll, //[15, 20, 15, 25, 30, 10, 5],
                    itemStyle:{
                        normal:{
                            color:'#23B7E5',
                            lineStyle:{
                                color:'#23B7E5',
                            }
                        }
                    },
                    /*itemStyle:{
                     normal:{
                     color:'#23b7e5',
                     lineStyle:{
                     color:'#4686CD',
                     width: 4
                     }
                     }
                     },*/
                    /*markLine : {
                     data : [
                     {type : 'average', name : '日活跃量'}
                     ],
                     itemStyle:{
                     normal:{
                     lineStyle:{
                     color:'#4686CD'
                     }
                     }
                     }
                     }*/
                },

            ]
        };

        vm.memOption = {
            title : {
                // text: '事件情况',
                subtext: '',
                left: 'left',
                textStyle: {
                    color: '#666'
                }
            },
            tooltip : {
                trigger: 'axis',
                // formatter: '({b})\n{a}: {c} k',
                // backgroundColor: '#27c24c',
                axisPointer: {
                    /*lineStyle:{
                     type: 'solid',
                     color: '#23b7e5',
                     width: 2
                     }*/
                },
                textStyle:{
                    color: '#dcf2f8'
                }
            },
            legend: {
                data:['内存占用']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            // symbol : null,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xTime,//['10:10','10:15','10:20','10:25','10:30','10:35','10:40'],
                    axisLine: {
                        show: true,
                        /*                  lineStyle: {
                         color: '#23b7e5',
                         width: 2
                         }*/
                    },
                    splitLine:{
                        show: true,
                        /* lineStyle: {
                         color: '#dcf2f8'
                         }*/
                    }
                }

            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}M'
                    },
                    axisLine: {
                        show: true,
                        /*lineStyle: {
                         color: '#23b7e5',
                         width: 0.25
                         }*/
                    },
                    splitLine:{
                        show: true,
                        /*lineStyle: {
                         color: '#dcf2f8'
                         }*/
                    }

                }
            ],
            series : [
                {
                    name:'内存占用',
                    type:'line',
                    //smooth:true,
                    // symbol:'none',
                    data:xTimeMem, //[15, 20, 15, 25, 30, 10, 5],
                    itemStyle:{
                        normal:{
                            color:'#23B7E5',
                            lineStyle:{
                                color:'#23B7E5',
                            }
                        }
                    },
                    /*itemStyle:{
                     normal:{
                     color:'#23b7e5',
                     lineStyle:{
                     color:'#4686CD',
                     width: 4
                     }
                     }
                     },*/
                    /*markLine : {
                     data : [
                     {type : 'average', name : '日活跃量'}
                     ],
                     itemStyle:{
                     normal:{
                     lineStyle:{
                     color:'#4686CD'
                     }
                     }
                     }
                     }*/
                },

            ]
        };

        vm.diskOption = {
            title : {
                // text: '事件情况',
                subtext: '',
                left: 'left',
                textStyle: {
                    color: '#666'
                }
            },
            tooltip : {
                trigger: 'axis',
                // formatter: '({b})\n{a}: {c} k',
                // backgroundColor: '#27c24c',
                axisPointer: {
                    /*lineStyle:{
                     type: 'solid',
                     color: '#23b7e5',
                     width: 2
                     }*/
                },
                textStyle:{
                    color: '#dcf2f8'
                }
            },
            legend: {
                data:['磁盘IO']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            // symbol : null,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xTime,//['10:10','10:15','10:20','10:25','10:30','10:35','10:40'],
                    axisLine: {
                        show: true,
                        /*                  lineStyle: {
                         color: '#23b7e5',
                         width: 2
                         }*/
                    },
                    splitLine:{
                        show: true,
                        /* lineStyle: {
                         color: '#dcf2f8'
                         }*/
                    }
                }

            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}iops'
                    },
                    axisLine: {
                        show: true,
                        /*lineStyle: {
                         color: '#23b7e5',
                         width: 0.25
                         }*/
                    },
                    splitLine:{
                        show: true,
                        /*lineStyle: {
                         color: '#dcf2f8'
                         }*/
                    }

                }
            ],
            series : [
                {
                    name:'磁盘IO',
                    type:'line',
                    //smooth:true,
                    // symbol:'none',
                    data:xTimeDisk, //[15, 20, 15, 25, 30, 10, 5],
                    itemStyle:{
                        normal:{
                            color:'#23B7E5',
                            lineStyle:{
                                color:'#23B7E5',
                            }
                        }
                    },
                    /*itemStyle:{
                     normal:{
                     color:'#23b7e5',
                     lineStyle:{
                     color:'#4686CD',
                     width: 4
                     }
                     }
                     },*/
                    /*markLine : {
                     data : [
                     {type : 'average', name : '日活跃量'}
                     ],
                     itemStyle:{
                     normal:{
                     lineStyle:{
                     color:'#4686CD'
                     }
                     }
                     }
                     }*/
                },

            ]
        };

        vm.networkOption = {
            title : {
                // text: '事件情况',
                subtext: '',
                left: 'left',
                textStyle: {
                    color: '#666'
                }
            },
            tooltip : {
                trigger: 'axis',
                // formatter: '({b})\n{a}: {c} k',
                // backgroundColor: '#27c24c',
                axisPointer: {
                    /*lineStyle:{
                     type: 'solid',
                     color: '#23b7e5',
                     width: 2
                     }*/
                },
                textStyle:{
                    color: '#dcf2f8'
                }
            },
            legend: {
                data:['网络流量']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            // symbol : null,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xTime,//['10:10','10:15','10:20','10:25','10:30','10:35','10:40'],
                    axisLine: {
                        show: true,
                        /*                  lineStyle: {
                         color: '#23b7e5',
                         width: 2
                         }*/
                    },
                    splitLine:{
                        show: true,
                        /* lineStyle: {
                         color: '#dcf2f8'
                         }*/
                    }
                }

            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}mbps'
                    },
                    axisLine: {
                        show: true,
                        /*lineStyle: {
                         color: '#23b7e5',
                         width: 0.25
                         }*/
                    },
                    splitLine:{
                        show: true,
                        /*lineStyle: {
                         color: '#dcf2f8'
                         }*/
                    }

                }
            ],
            series : [
                {
                    name:'网络流量',
                    type:'line',
                    //smooth:true,
                    // symbol:'none',
                    data:xTimeNetwork, //[15, 20, 15, 25, 30, 10, 5],
                    itemStyle:{
                        normal:{
                            color:'#23B7E5',
                            lineStyle:{
                                color:'#23B7E5',
                            }
                        }
                    },
                    /*itemStyle:{
                     normal:{
                     color:'#23b7e5',
                     lineStyle:{
                     color:'#4686CD',
                     width: 4
                     }
                     }
                     },*/
                    /*markLine : {
                     data : [
                     {type : 'average', name : '日活跃量'}
                     ],
                     itemStyle:{
                     normal:{
                     lineStyle:{
                     color:'#4686CD'
                     }
                     }
                     }
                     }*/
                },

            ]
        };





    }

})();