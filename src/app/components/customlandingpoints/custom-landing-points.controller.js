/**
 * Created by cqp
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('CustomLandingPointsController', CustomLandingPointsController);


    function CustomLandingPointsController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {

        var vm = this;
        vm.authError = null;

        vm.pageCurrent = 1;
        vm.targetPage = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = [];

        vm.items = [];
        vm.showItems = [];

        vm.goDetail = goDetail;
        vm.curItem = {};
        vm.backAction = backAction;
        vm.userInfo = {};
        vm.subPath = 'custom-landing-points';

        vm.approveColor = {
            'pending':'bg-info',
            'approved':'bg-success',
            'rejected':'bg-warning'
        };

        vm.approveStatus= {
            'pending':'未审批',
            'approved':'审批通过',
            'rejected':'审批拒绝'
        };

        vm.reqPath =  constdata.api.tenant.jetPath;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');


        function getDatas() {
            // console.log(vm.reqPath  + '/' + vm.subPath);
            NetworkService.get( vm.reqPath  + '/' + vm.subPath,{page:vm.pageCurrent},function (response) {
                vm.items = response.data.content;
                updatePagination(response.data);
                vm.displayedCollection = [].concat(vm.items);
                console.log(vm.displayedCollection);

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }
        vm.goComment = function(item) {
            $state.go('app.aircraftcomment',{username:item.id, args:{type:'detail',prd:'aircrafts'}});

        };

        function goDetail(item) {
            $state.go('app.editcustomlandingpoints',{username:item.id, args:{type:'detail'}});
            console.log(item.id);

        }

        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }

        // 分页 Start
        vm.preAction = function () {
            vm.pageCurrent --;
            if (vm.pageCurrent < 1) {vm.pageCurrent = 1;}
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
            return Number(page) === vm.pageCurrent;
        };

        function updatePagination(pageination) {

            if (!pageination.hasContent){
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
                if (stepStart < 1 || toalPages < pageControl) {stepStart = 1;}
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

        vm.OperApp = OperApp;
        function OperApp(index, item) {
            if (index === 1) {

                NetworkService.post(vm.reqPath + '/' + vm.subPath + '/' + item.id + '/approve', null, function () {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();

                }, function (response) {
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText);
                });

            // } else if (index === 2) {
            //     var myreason = {reason: 'invalid params'};
            //     NetworkService.post(vm.reqPath + '/' + vm.subPath + '/' + item.id + '/disapprove', myreason, function () {
            //         toastr.success(i18n.t('u.OPERATE_SUC'));
            //         getDatas();
            //     }, function (response) {
            //         toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText);
            //     });
            // } else {
            //     console.log('error ops:' + index);
            }
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
                    toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText);
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }

})();