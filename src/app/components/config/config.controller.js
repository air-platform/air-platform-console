/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('ConfigController', ConfigController);

    /** @ngInject */
    function ConfigController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;

        vm.pageCurrent = 1;
        vm.targetPage = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = [];

        vm.items = [];
        vm.showItems = [];
        vm.QFRule = [];

        // vm.QFRule.push({
        //     speed:'',
        //     unitTimePrice:'',
        //     departureTimeInAdvance:''
        //
        // })
        vm.goAddItem = goAddItem;
        vm.goEditItem = goEditItem;
        vm.goDetail = goDetail;
        vm.resetPassword = resetPassword;
        vm.removeItem = removeItem;
        vm.curItem = {};
        vm.backAction = backAction;
        vm.userInfo = {};

        vm.ruleTitle = {
            'order_finished_air_training':'航校课程订单完成获得积分数',
            'order_finished_air_taxi':'空中出租订单完成获得积分数',
            'order_finished_air_tour':'观光飞行订单完成获得积分数',
            'account_registration':'注册时送积分数',
            'daily_signin_20':'连续签到20天获得积分数',
            'daily_signin_5':'连续签到5天获得积分数',
            'daily_signin_15':'连续签到15天获得积分数',
            'daily_signin_25':'连续签到25天获得积分数',
            'order_first_price_off':'首单立减钱数（人民币：元）',
            'order_finished_air_trans':'通勤航旅订单完成获得积分数',
            'daily_signin_1':'连续签到1天获得积分数',
            'order_finished_air_jet':'包机订单完成获得积分数',

        }

        vm.subPath = 'client-managers';
        vm.subPathQuickFlight ='application-params/quickflight';
        vm.subPathPointBasic = 'point/basics';
        vm.subPathPointRule = 'point/rules';
        vm.reqPath =  constdata.api.tenant.platPath+'/settings';

        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.platPath+'/settings';

            vm.isAdmin = true;
        }

        vm.isEdit = false;
        vm.editTitle = '编辑';
        vm.isEditPointBasic = false;
        vm.editTitlePointBasic = '编辑';

        vm.isEditPointRule = false;
        vm.editTitlePointRule = '编辑';

        vm.isEditQFRule = false;
        vm.editQuickFlightRule = '编辑';

        vm.tabItem =
            [{
                title:'平台客户经理',
                active:true,
                id:1

            }, {
                title:'积分规则',
                active:false,
                    id:2
            }, {

                title:'飞的设置',
                active:false,
                id:3

            }/*,
            {
                title:'其他',
                active:false,
                    id:3
            }*/
            ];


        vm.sel = function(oper){
            console.log('hi' + oper);
            for(var i = 0; i < vm.tabItem.length; i ++){
                if(vm.tabItem[i].id == oper){
                    vm.tabItem[i].active = true;
                }else{
                    vm.tabItem[i].active = false;
                }
            }

            if(oper == 1){
                getPlatMgr();
            }else if(oper == 2){
                getPointBasic();
                getPointRule();
            }else if(oper == 3){
                getQuickFlightRule();
            }

        }
        vm.sel(1);


        function getPlatMgr() {

            NetworkService.get(vm.reqPath + '/' + vm.subPath,{page:vm.pageCurrent},function (response) {
               // vm.items = response.data.content;
                //vm.platMgr = [{person:'aa',email:'aa@qq.com', mobile:'13223232321'},{person:'bb',email:'bb@qq.com', mobile:'13323232322'}];
                vm.platMgr = response.data;
               console.log(vm.platMgr);
               // vm.displayedCollection = [].concat(vm.items);
                //updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }


        function addPlatMgr() {
            NetworkService.put(vm.reqPath + '/' + vm.subPath,vm.platMgr,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                getPlatMgr();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }





        function getPointBasic() {

            NetworkService.get(vm.reqPath + '/' + vm.subPathPointBasic,{page:vm.pageCurrent},function (response) {
                // vm.items = response.data.content;
                //vm.platMgr = [{person:'aa',email:'aa@qq.com', mobile:'13223232321'},{person:'bb',email:'bb@qq.com', mobile:'13323232322'}];
                vm.pointBasic = response.data;
                console.log(vm.pointBasic);
                // vm.displayedCollection = [].concat(vm.items);
                //updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }


        function addPointBasic() {
            vm.pointBasic.exchangeRate = parseInt(vm.pointBasic.exchangeRate);
            vm.pointBasic.exchangePercent = parseInt(vm.pointBasic.exchangePercent);
            NetworkService.put(vm.reqPath + '/' + vm.subPathPointBasic,vm.pointBasic,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                getPointBasic();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }




        function getPointRule() {

            NetworkService.get(vm.reqPath + '/' + vm.subPathPointRule,{page:vm.pageCurrent},function (response) {
                // vm.items = response.data.content;
                //vm.platMgr = [{person:'aa',email:'aa@qq.com', mobile:'13223232321'},{person:'bb',email:'bb@qq.com', mobile:'13323232322'}];
                vm.pointRule = response.data;
                console.log(vm.pointRule);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }


        function addPointRule() {
            NetworkService.put(vm.reqPath + '/' + vm.subPathPointRule,vm.pointRule,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                getPointRule();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }


        function getQuickFlightRule() {

            NetworkService.get(constdata.api.tenant.jetPath + '/' + vm.subPathQuickFlight,null,function (response) {
                // vm.items = response.data.content;
                //vm.platMgr = [{person:'aa',email:'aa@qq.com', mobile:'13223232321'},{person:'bb',email:'bb@qq.com', mobile:'13323232322'}];
                vm.QFRule = response.data;
                // console.log(vm.QFRule);
                // vm.displayedCollection = [].concat(vm.items);
                //updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }


        function addQuickFlightRule() {
            // console.log(vm.QFRule);

            vm.QFRule = {'speed': vm.QFRule.speed,'unitTimePrice': vm.QFRule.unitTimePrice,'departureTimeInAdvance': vm.QFRule.departureTimeInAdvance};
            NetworkService.put(constdata.api.tenant.jetPath + '/' + vm.subPathQuickFlight,vm.QFRule,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                getQuickFlightRule();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }

        vm.editOper = function(operId){
            if(operId == 11) {
                if (!vm.isEdit) {
                    vm.isEdit = true;
                    vm.editTitle = '保存';
                } else {
                    vm.isEdit = false;
                    vm.editTitle = '编辑';
                    addPlatMgr();
                }
            }else if(operId == 12){
                if (!vm.isEditPointBasic) {
                    vm.isEditPointBasic = true;
                    vm.editTitlePointBasic = '保存';
                } else {
                    vm.isEditPointBasic = false;
                    vm.editTitlePointBasic = '编辑';
                    addPointBasic();
                }
            }else if(operId == 13){
                if (!vm.isEditPointRule) {
                    vm.isEditPointRule = true;
                    vm.editTitlePointRule = '保存';
                } else {
                    vm.isEditPointRule = false;
                    vm.editTitlePointRule = '编辑';
                    addPointRule();
                }
            }else if(operId == 14){
                if(!vm.isEditQFRule){
                    vm.isEditQFRule = true;
                    vm.editQuickFlightRule = '保存';
                }else{
                    vm.isEditQFRule = false;
                    vm.editQuickFlightRule = '编辑';
                    addQuickFlightRule();
                }
            }

        }
        vm.cancelOper = function(operId){

            if(operId == 11) {
                vm.isEdit = false;
                vm.editTitle = '编辑';
                getPlatMgr();
            }else if(operId == 12){
                vm.isEditPointBasic = false;
                vm.editTitlePointBasic = '编辑';
                getPointBasic();

            }else if(operId == 13){
                vm.isEditPointRule = false;
                vm.editTitlePointRule = '编辑';
                getPointRule();
            }else if(operId == 14){
                vm.isEditQFRule = false;
                vm.editQuickFlightRule = '编辑';
            }


        }


        vm.addNewClientManager = function() {

            vm.platMgr.push({
                person:'',
                mobile:'',
                email:''
            })
        }

        vm.removeClientManager = function(item) {
            var index = vm.platMgr.indexOf(item);
            vm.platMgr.splice(index, 1);
        }



        function goAddItem() {
            $state.go('app.edittrainingroom',{});
        };

        function goEditItem(item) {
            $state.go('app.edittrainingroom',{username:item.id, args:{type:'edit'}});
        };

        function goDetail(item) {
            $state.go('app.edittrainingroom',{username:item.id, args:{type:'detail'}});

        };

        function resetPassword(item) {
            /*NetworkService.post(constdata.api.tenant.listAllPath + '/' + item.username + '/password/reset',null,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
            },function (response) {
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });*/
            toastr.success(i18n.t('u.OPERATE_SUC'));
        }

        function removeItem(item) {
            var myid = vm.userInfo.id;
            NetworkService.delete(vm.reqPath + '/' + vm.subPath + '/'+ item.id,null,function success() {
                var index = vm.items.indexOf(item);
                //vm.items.splice(index,1);
                toastr.success(i18n.t('u.DELETE_SUC'));
                getDatas();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

        };
        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }




        // 分页 Start
        vm.preAction = function () {
            vm.pageCurrent --;
            if (vm.pageCurrent < 1) vm.pageCurrent = 1;
            getDatas();
        };
        vm.nextAction = function () {
            vm.pageCurrent ++;
            getDatas();
        };
        vm.goPage = function (page) {
            vm.pageCurrent = Number(page);
            getDatas();
        };
        vm.pageCurrentState = function (page) {
            if (Number(page) == vm.pageCurrent)
                return true;
            return false;
        };

        function updatePagination(pageination) {

            if (!pageination.hasContent){
                // toastr.error('当前无数据哦~');
                return;
            }

            var page = pageination.page;
            var toalPages = pageination.totalPages;

            vm.pageNextEnabled = pageination.hasNextPage;
            vm.pagePreEnabled = pageination.hasPreviousPage;


            if (toalPages < 2){
                vm.pages = ['1'];
            }else{
                vm.pages = [];
                var pageControl = 5;
                var stepStart = page - (pageControl - 1)/2;
                if (stepStart < 1 || toalPages < pageControl) stepStart = 1;
                var stepEnd = stepStart + pageControl - 1;
                if (stepEnd > toalPages) {
                    stepEnd = toalPages;
                    stepStart = toalPages - pageControl + 1;
                    if (stepStart < 1){
                        stepStart = 1;
                    }
                }

                for (var i=stepStart;i<= (stepEnd > toalPages ? toalPages : stepEnd);i++) {
                    vm.pages.push(i);
                }
            }

        }


        //addItem();

        //Model

        vm.tipsInfo = delmodaltip;
        vm.openAlert = function (size,model) {
            vm.tipsInfo = {
                title:'删除',
                content:'确定删除吗？'
            };
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
                vm.removeItem(model);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


        vm.tipsInfoReset = {title:i18n.t('profile.RESET_PWD'),content:i18n.t('profile.RESET_PWD_CONFIRM')};
        vm.resetAlert = function (size,model) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: size,
                controller:'ModalInstanceCtrl',
                resolve: {
                    tipsInfo: function () {
                        return vm.tipsInfoReset;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                vm.resetPassword(model);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }



    }

})();
