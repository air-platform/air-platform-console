/**
 * Created by cqp
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('ActivityMessagesController', ActivityMessagesController);

    /** @ngInject */
    function ActivityMessagesController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
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
        vm.removeItem = removeItem;
        vm.curItem = {};
        vm.backAction = backAction;
        vm.userInfo = {};
        vm.subPath = 'activity-messages';


        vm.approveStatus=[{
            value:'pending',
            title:'未审批'
        },{
            value:'approved',
            title:'审批通过'
        },{
            value:'rejected',
            title:'审批拒绝'
        }];

        vm.pubStatus = [
            {
                title:'已上线',
                value: true
            },
            {
                title:'已下线',
                value: false
            }
        ];

        vm.labelColor = {
            true:'bg-success',
            false:'bg-warning',
            'pending':'bg-info',
            'approved':'bg-success',
            'rejected':'bg-warning'

        };
        vm.labelContent={
            true:'已上线',
            false:'已下线',
            'pending':'未审批',
            'approved':'审批通过',
            'rejected':'审批拒绝'
        };
        vm.reqPath = constdata.api.tenant.jetPath;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role !== 'tenant'){
            vm.isAdmin = true;
        }
        vm.displayedCollection = [];
        vm.OperApp = OperApp;
        function OperApp(index, item) {
            if(index === 3){

                NetworkService.post(vm.reqPath + '/'+ vm.subPath + '/' +item.id +'/approve',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();

                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                });

            }else if(index === 4){
                var myreason={reason:'invalid params'};
                NetworkService.post(vm.reqPath + '/'+ vm.subPath + '/' +item.id +'/disapprove',myreason,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                });
            }else if(index === 11){
                var myreason={reason:'invalid params'};
                NetworkService.post(vm.reqPath + '/'+ vm.subPath + '/' +item.id +'/publish',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                });
            }else if(index === 12){
                var myreason={reason:'invalid params'};
                NetworkService.post(vm.reqPath + '/'+ vm.subPath + '/' +item.id +'/unpublish',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                });
            }else{
                console.log('error ops:'+index);
            }

        }




        function getDatas() {


            NetworkService.get(vm.reqPath  + '/' + vm.subPath,{page:vm.pageCurrent},function (response) {
                vm.items = response.data.content;
                console.log(vm.items);
                vm.displayedCollection = [].concat(vm.items);
                if(vm.displayedCollection) {
                    for (var i = 0; i < vm.displayedCollection.length; i++) {
                        if (vm.displayedCollection[i].reviewStatus === 'pending') {
                            vm.displayedCollection[i].isAgreeEnable = true;
                            vm.displayedCollection[i].isRejectEnable = true;

                            vm.displayedCollection[i].isPubilsh = false;
                            vm.displayedCollection[i].isUnPublish = false;

                        } else if (vm.displayedCollection[i].reviewStatus === 'rejected') {
                            vm.displayedCollection[i].isAgreeEnable = true;
                            vm.displayedCollection[i].isRejectEnable = false;

                            vm.displayedCollection[i].isPubilsh = false;
                            vm.displayedCollection[i].isUnPublish = false;

                        } else {
                            vm.displayedCollection[i].isAgreeEnable = false;
                            vm.displayedCollection[i].isRejectEnable = true;


                            if(vm.displayedCollection[i].published){
                                vm.displayedCollection[i].isPubilsh = true;
                                vm.displayedCollection[i].isUnPublish = false;

                            }else{
                                vm.displayedCollection[i].isPubilsh = false;
                                vm.displayedCollection[i].isUnPublish = true;
                            }

                        }
                    }
                }
                updatePagination(response.data);

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }


        function goAddItem() {
            $state.go('app.editactivitymessages',{});
        }

        function goEditItem(item) {
            $state.go('app.editactivitymessages',{username:item.id, args:{type:'edit'}});
        }
        function goDetail(item) {
            $state.go('app.editactivitymessages',{username:item.id, args:{type:'detail'}});
        }


        function removeItem(item) {
            var myid = vm.userInfo.id;
            NetworkService.delete(vm.reqPath + '/' + vm.subPath + '/'+ item.id,null,function success() {
                var index = vm.items.indexOf(item);
                toastr.success(i18n.t('u.DELETE_SUC'));
                getDatas();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

        }
        function backAction() {
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
            vm.totalPages = pageination.totalPages;

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


        //Model

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

        vm.openInput = function (size,item) {
            vm.tipsInfo = {
                title:'审批拒绝',
                content:'请填写拒绝理由'
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContentInput.html',
                size: 'md',
                controller:'ModalInstanceInputCtrl',
                resolve: {
                    tipsInfo: function () {
                        return vm.tipsInfo;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                console.log(param);
                var myreason={reason:param};
                NetworkService.post(vm.reqPath +'/' + vm.subPath +'/'+item.id +'/disapprove',myreason,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                });




            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };



    }

})();
