/**
 * Created by cqp.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('PushNotificationsController', PushNotificationsController);

    /** @ngInject */
    function PushNotificationsController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
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

        vm.goAddItem = goAddItem;
        vm.goEditItem = goEditItem;
        vm.goDetail = goDetail;
        vm.resetPassword = resetPassword;
        vm.removeItem = removeItem;
        vm.curItem = {};
        vm.backAction = backAction;
        vm.userInfo = {};

        vm.subPath = 'pushnotifications';
        vm.reqPath =  constdata.api.admin.platPath;

        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.platPath;

            vm.isAdmin = true;
        }
        vm.labelClass = {
            'push_success':'bg-success',
            'none_push':'bg-created',
            'push_failed':'bg-info'
        };
        vm.statusMap={
            'none_push':'未推送',
            'push_success':'推送成功',
            'push_failed':'推送失败'
        };



        function getDatas() {
            NetworkService.get(vm.reqPath + '/' + vm.subPath,{page:vm.pageCurrent},function (response) {
                vm.items = response.data.content;
                console.log(response.data);

                if(vm.items.length > 0){

                    for(var i = 0; i < vm.items.length; i ++) {
                        vm.items[i].isEditEnable = false;
                        vm.items[i].isSendEnable = false;
                        vm.items[i].isDeleteEnable = false;


                        if (vm.items[i].status === 'none_push') {
                            vm.items[i].isEditEnable = true;
                            vm.items[i].isSendEnable = true;
                            vm.items[i].isDeleteEnable = true;



                        }else if (vm.items[i].status === 'push_success') {
                            // vm.items[i].isSignEnable = true;
                            vm.items[i].isDeleteEnable = true;

                        }else{
                            console.log('undefined order status:'+vm.items[i].status);
                        }
                    }


                }
                vm.displayedCollection = [].concat(vm.items);
                // console.log(vm.displayedCollection);
                updatePagination(response.data);

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }


        function goAddItem() {
            $state.go('app.editnotifications',{});
        }

        function goEditItem(item) {
            $state.go('app.editnotifications',{username:item.id, args:{type:'edit'}});
        }

        function goDetail(item) {
            $state.go('app.editnotifications',{username:item.id, args:{type:'detail'}});
            // console.log(item.id);

        }

        function resetPassword(item) {
            /*NetworkService.post(constdata.api.tenant.listAllPath + '/' + item.username + '/password/reset',null,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
            },function (response) {
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });*/
            toastr.success(i18n.t('u.OPERATE_SUC'));
        }

        function removeItem(item) {
            NetworkService.delete(vm.reqPath + '/' + vm.subPath + '/'+ item.id,null,function success() {
                toastr.success(i18n.t('u.DELETE_SUC'));
                getDatas();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

        }
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
            // vm.tagetPage = Number(page);
            getDatas();
        };
        vm.pageCurrentState = function (page) {
            if (Number(page) === vm.pageCurrent)
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
            vm.totalPages = pageination.totalPages;

            vm.pageNextEnabled = pageination.hasNextPage;
            vm.pagePreEnabled = pageination.hasPreviousPage;


            if (toalPages < 2){
                vm.pages = ['1'];
                // vm.pages.currentPage = 1;
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


        //Model

        vm.tipsInfo = delmodaltip;
        vm.operations = function (item, oper) {

            if(oper === 'Edit' ){
                vm.goEditItem(item);

            }else if(oper === 'Send'){
               NetworkService.post(vm.reqPath + '/' + vm.subPath + '/' + item.id + '/send',null,function success() {
                   toastr.success('推送成功');
                   getDatas();},function (response) {
                   vm.authError = response.statusText + '(' + response.status + ')';
                   toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
               });

            }else  if(oper === 'Delete'){

                NetworkService.delete(vm.reqPath + '/' + vm.subPath + '/' + item.id,null,function success() {
                    toastr.success(i18n.t('u.DELETE_SUC'));
                    getDatas();} ,function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });

            }
        };




    }

})();
