/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('CommentController', CommentController);

    /** @ngInject */
    function CommentController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n,$stateParams, delmodaltip) {
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
        vm.goComment = goComment;
        vm.goDetail = goDetail;
        vm.resetPassword = resetPassword;
        vm.removeItem = removeItem;
        vm.curItem = {};
        vm.backAction = backAction;
        vm.userInfo = {};
        vm.subPath = 'airtaxis';
        vm.showCommentInput = false;
        vm.showReplyTo = false;
        vm.replyUserName = 'test';
        vm.showCommentButton = true;

        console.log($stateParams.args);

        vm.subPath = 'comments';
        vm.reqPath =  constdata.api.tenant.basePath;

        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.platPath;

            vm.isAdmin = true;
        }


        var username = $stateParams.username;
        vm.cancelComment = function (){
            vm.showCommentInput=false;

        }
        vm.addComment = function (){
            vm.showCommentInput=true;
            vm.showReplyTo = false;
        }

        vm.replyComment = function (item){
            vm.showCommentInput=true;
            vm.showReplyTo = true;
            vm.replyItem = item;
            vm.replyUserName = vm.replyItem.owner.name;
           // vm.showCommentButton = false;
        }
        function getDatas() {

            NetworkService.get(vm.reqPath + '/'+vm.subPath +'?product='+ username,{page:vm.pageCurrent, pageSize:10},function (response) {
                vm.items = response.data.content;
                updatePagination(response.data);

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }


        vm.sendComment = function() {
            vm.userInfo = StorageService.get('iot.hnair.cloud.information');

            if(vm.showReplyTo){
                var myRole = 'user';
                vm.tuser={
                    content:vm.commentContent,
                    //product:username,
                    //owner:vm.userInfo,
                    //source:myRole,//vm.userInfo.role,
                    //replyTo:vm.userInfo.id,
                    //rate:5

                };
                //user tenant
                NetworkService.post(vm.reqPath + '/'+vm.subPath  +'?sourceId='+ username+'&source='+myRole+'&replyTo='+vm.replyItem.owner.id,vm.tuser,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    vm.showCommentInput = false;
                    vm.commentContent = '';
                    getDatas();
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    console.log(vm.authError);
                    vm.showCommentInput = false;
                    vm.commentContent = '';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else{

                var myRole = 'user';
                vm.tuser={
                    content:vm.commentContent,
                    //product:username,
                    //owner:vm.userInfo,
                    //source:myRole,//vm.userInfo.role,
                    //replyTo:vm.userInfo.id,
                   // rate:5

                };
                //user tenant
                NetworkService.post(vm.reqPath + '/'+vm.subPath  +'?sourceId='+ username+'&source='+myRole,vm.tuser,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    vm.showCommentInput = false;
                    vm.commentContent = '';
                    getDatas();
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    console.log(vm.authError);
                    vm.showCommentInput = false;
                    vm.commentContent = '';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });

            }

        };


        function goAddItem() {

            var myRole = 'user';
            vm.tuser={
                content:'this is a comment',
                product:username,
                //owner:vm.userInfo,
                source:myRole,
                //replyTo:vm.userInfo.id,
                rate:5

            };
            //user tenant
            NetworkService.post(constdata.api.comment.basePath +'?sourceId='+ username+'&source='+myRole+'&replyTo='+vm.userInfo.id,vm.tuser,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

        };


        function goEditItem(item) {
            $state.go('app.editairtaxi',{username:item.id, args:{type:'edit'}});
        };

        function goDetail(item) {
            $state.go('app.editairtaxi',{username:item.id, args:{type:'detail'}});

        };

        function goComment(item) {
            $state.go('app.comment',{username:item.id, args:{type:'detail',prd:'airtaxi'}});

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
            NetworkService.delete(vm.reqPath + '/'+vm.subPath  + '/'+ item.id,null,function success() {
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
