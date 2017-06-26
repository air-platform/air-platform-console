/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('AirjetFlightController', AirjetFlightController);

    /** @ngInject */
    function AirjetFlightController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
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
        vm.subPath = 'ferryflights';



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


        vm.reqPath =  constdata.api.tenant.fleetPath;
        vm.reqPath2 = constdata.api.tenant.jetPath;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.basePath;
            vm.reqPath2 = constdata.api.tenant.jetPath;
            vm.isAdmin = true;
        }
        vm.displayedCollection = [];
        vm.OperApp = OperApp;
        function OperApp(index, item) {
            if(index == 3){


                //product/families/{productFamilyId}/approve
                //$state.go('app.application', {applicationName:item.id, args:{selItem:item}});
                NetworkService.post(vm.reqPath + '/'+ vm.subPath + '/' +item.id +'/approve',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();

                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                });

            }else if(index == 4){
                var myreason={reason:'invalid params'};
                NetworkService.post(vm.reqPath + '/'+ vm.subPath + '/' +item.id +'/disapprove',myreason,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                });
            }else if(index == 11){
                var myreason={reason:'invalid params'};
                NetworkService.post(vm.reqPath + '/'+ vm.subPath + '/' +item.id +'/publish',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                });
            }else if(index == 12){
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

            //$state.go('app.applicationedit');
        };



        function getAirjetsDatas() {


            NetworkService.get(vm.reqPath2  + '/airjets',{page:vm.pageCurrent},function (response) {
                vm.jets = response.data.content;

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }
        getAirjetsDatas();



        function getDatas() {
            NetworkService.get(vm.reqPath  + '/' + vm.subPath,{page:vm.pageCurrent},function (response) {
                vm.items = response.data.content;
                vm.displayedCollection = [].concat(vm.items);
                if(vm.displayedCollection) {
                    for (var i = 0; i < vm.displayedCollection.length; i++) {
                        if (vm.displayedCollection[i].reviewStatus == 'pending') {
                            vm.displayedCollection[i].isAgreeEnable = true;
                            vm.displayedCollection[i].isRejectEnable = true;

                            vm.displayedCollection[i].isPubilsh = false;
                            vm.displayedCollection[i].isUnPublish = false;

                        } else if (vm.displayedCollection[i].reviewStatus == 'rejected') {
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
            $state.go('app.editairjetflight',{});
        };

        function goEditItem(item) {
            $state.go('app.editairjetflight',{username:item.id, args:{type:'edit'}});
        };

        function goDetail(item) {
            $state.go('app.editairjetflight',{username:item.id, args:{type:'detail'}});

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
            NetworkService.delete(vm.reqPath   + '/' + vm.subPath + '/'+ item.id,null,function success() {
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


        //Model


        vm.goTop = function (size,item) {
            console.log(item.rank);
            vm.tipsInfo = {
                title:'产品置顶',
                content:'请选择置顶级别（值越大产品排序越靠前）',
                topValue:item.rank
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContentPrdTop.html',
                size: 'sm',
                controller:'ModalInstancePrdTopCtrl',
                resolve: {
                    tipsInfo: function () {
                        return vm.tipsInfo;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                console.log(param);
                var myreason={rank:param};
                NetworkService.post(vm.reqPath +'/' + vm.subPath +'/'+item.id +'/rank',myreason,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                });




            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

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


        vm.goComment = function(item) {
            $state.go('app.comment',{username:item.id, args:{type:'detail',prd:'airtaxi'}});

        };


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
        }



    }

})();
