/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('OrderCardController', OrderCardController);

    /** @ngInject */
    function OrderCardController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;

        vm.pageCurrent = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = [];

        vm.items = [];
        vm.showItems = [];

        vm.goAddItem = goAddItem;
        vm.goEditItem = goEditItem;
        vm.goDetail = goDetail;
        vm.resetPassword = resetPassword;
        vm.removeItem = removeItem;
        vm.curItem = {};
        vm.backAction = backAction;
        vm.userInfo = {};
        vm.subPath = 'airbook';
        vm.statusType = [
            {
                title:'处理中',
                value:'pending'
            },
            {
                title:'已完成',
                value:'finished'
            }
            ,
            {
                title:'已付款',
                value:'paid'
            },
            {
                title:'已取消',
                value:'cancelled'
            },
            {
                title:'已删除',
                value:'deleted'
            },
            {
                title:'已发布',
                value:'published'
            },
            {
                title:'已创建',
                value:'created'
            }
        ];
        vm.statusMap={
            'pending':'处理中',
            'finished':'已完成',
            'paid':'已付款',
            'cancelled':'已取消',
            'deleted':'已删除',
            'created':'已创建',
            "published":"已发布"

        };
        vm.classMap={
            'pending':{'pending':true},
            'finished':{'finished':true},
            'paid':{'paid':true},
            'cancelled':{'cancelled':true},
            'deleted':{'deleted':true},
            "published":{'published':true},
            "created":{'created':true}

        };

        vm.editPath = 'app.editordercard';

        vm.reqPath = constdata.api.order.card;
        vm.reqPath2 = constdata.api.order.card;

        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath  =constdata.api.order.adminBase+'?type=jettravel';
            vm.reqPath2  =constdata.api.order.adminBase;
            vm.isAdmin = true;
        }


        function getDatas() {
            NetworkService.get(vm.reqPath,{page:vm.pageCurrent},function (response) {
                vm.items = response.data.content;

                if(vm.items.length > 0){

                    for(var i = 0; i < vm.items.length; i ++) {

                        if (vm.items[i].status == 'pending') {
                            vm.items[i].isPaidEnable = true;
                            vm.items[i].isFinishEnable = false;
                            vm.items[i].isDeleteEnable = false;

                        } else if (vm.items[i].status == 'finished') {
                            vm.items[i].isPaidEnable = false;
                            vm.items[i].isFinishEnable = false;
                            vm.items[i].isDeleteEnable = false;
                        } else if (vm.items[i].status == 'paid') {
                            vm.items[i].isPaidEnable = false;
                            vm.items[i].isFinishEnable = true;
                            vm.items[i].isDeleteEnable = false;
                        } else if (vm.items[i].status == 'cancelled') {
                            vm.items[i].isPaidEnable = false;
                            vm.items[i].isFinishEnable = false;
                            vm.items[i].isDeleteEnable = false;
                        }else{
                            vm.items[i].isPaidEnable = false;
                            vm.items[i].isFinishEnable = false;
                            vm.items[i].isDeleteEnable = false;
                        }
                    }
                }
                vm.displayedCollection = [].concat(vm.items);





                updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }


        function goAddItem() {
            $state.go(vm.editPath,{});
        };

        function goEditItem(item) {
            $state.go(vm.editPath,{username:item.id, args:{type:'edit'}});
        };


        vm.goOperItem = function (item,oper) {

            if(oper == 1) {
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/pay', null, function success() {
                    var index = vm.items.indexOf(item);
                    //vm.items.splice(index,1);
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 2){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/finish', null, function success() {
                    var index = vm.items.indexOf(item);
                    //vm.items.splice(index,1);
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }
        };


        function goDetail(item) {
            $state.go(vm.editPath,{username:item.id, args:{type:'detail'}});

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
            NetworkService.delete(vm.reqPath2 + '/'+ item.id,null,function success() {
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

        vm.displayedCollection = [].concat(vm.items);


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

        getDatas();


        vm.tipsInfo = {
            title:'修改订单',
            content:'您确定对该订单执行此操作吗？更改后将不可撤销!'
        };
        vm.openAlert = function (size,model, oper) {
            console.log(vm.tipsInfo);
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
                vm.goOperItem(model,oper);
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
