/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('OrderClassController', OrderClassController);

    /** @ngInject */
    function OrderClassController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
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
        vm.labelClass = {
            'pending':'bg-info',
            'finished':'bg-finished',
            'paid':'bg-success',
            'cancelled':'bg-warning',
            'deleted':'bg-dark',
            'created':'bg-created',
            'published':'bg-published',
            'confirmed':'bg-info',
            'contract_signed':'bg-info',
            'partial_paid':'bg-info',
            'ticket_released':'bg-info',
            'refund_requested':'bg-info',
            'refunding':'bg-info',
            'refunded':'bg-info',
            'refund_failed':'bg-info',
            'closed':'bg-info',
            'customer_confirmed':'bg-info',
            'offered':'bg-info',
            'payment_in_process':'bg-info'
        };
        vm.statusMap={
            'pending':'处理中',
            'finished':'已完成',
            'paid':'已付款',
            'cancelled':'已取消',
            'deleted':'已删除',
            'created':'已创建',
            "published":"已发布",
            'confirmed':'已确认',
            'contract_signed':'已签合同',
            'partial_paid':'部分付款',
            'ticket_released':'已出票',
            'refund_requested':'请求退款',
            'refunding':'退款中',
            'refunded':'已退款',
            'refund_failed':'退款失败',
            'closed':'已关闭',
            'customer_confirmed':'客户已选',
            'offered':'已报价',
            'payment_in_process':'付款中'

        };


        vm.editPath = 'app.editorderclass';

        vm.reqPath = constdata.api.order.course;
        vm.reqPath2 = constdata.api.order.course;

        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath  =constdata.api.order.adminBase+'?type=course';
            vm.reqPath2  =constdata.api.order.adminBase;
            vm.isAdmin = true;
        }

        function getDatas() {
            NetworkService.get(vm.reqPath,{page:vm.pageCurrent},function (response) {
                vm.items = response.data.content;


                if(vm.items.length > 0){

                    for(var i = 0; i < vm.items.length; i ++) {
                        vm.items[i].isOfferEnable = false;
                        vm.items[i].isPriceEnable = false;
                        //vm.items[i].isConfirmPriceEnable = false;
                        vm.items[i].isConfirmOrderEnable = false;
                        vm.items[i].isSignEnable = false;
                        vm.items[i].isAcceptRefundEnable = false;
                        vm.items[i].isRejectRefundEnable = false;
                        vm.items[i].isReleaseTicketEnable = false;
                        vm.items[i].isFinishEnable = false;
                        vm.items[i].isCancelEnable = false;
                        vm.items[i].isCloseEnable = false;
                        vm.items[i].isDeleteEnable = false;
                        vm.items[i].isPayEnable = false;


                        if (vm.items[i].status == 'created') {
                            vm.items[i].isCloseEnable = true;
                            // vm.items[i].isPriceEnable = true;
                            //vm.items[i].isConfirmOrderEnable = true;
                            vm.items[i].isSignEnable = true;
                            vm.items[i].isPriceEnable = true;

                        }else if (vm.items[i].status == 'confirmed') {
                            vm.items[i].isSignEnable = true;
                            vm.items[i].isPriceEnable = true;

                        }else if (vm.items[i].status == 'contract_signed') {
                            vm.items[i].isCloseEnable = true;
                            vm.items[i].isPayEnable = true;
                            vm.items[i].isPriceEnable = true;

                        }else if (vm.items[i].status == 'partial_paid') {
                            vm.items[i].isCloseEnable = true;
                            vm.items[i].isFinishEnable = true;

                        }else if (vm.items[i].status == 'paid') {
                            vm.items[i].isFinishEnable = true;
                            // vm.items[i].isAcceptRefundEnable = true;
                            // vm.items[i].isReleaseTicketEnable = true;


                        }else if (vm.items[i].status == 'ticket_released') {
                            vm.items[i].isFinishEnable = true;

                        }else if (vm.items[i].status == 'refund_requested') {
                            vm.items[i].isAcceptRefundEnable = true;
                            vm.items[i].isRejectRefundEnable = true;

                        }else if (vm.items[i].status == 'refunding') {

                        }else if (vm.items[i].status == 'refunded') {
                            //vm.items[i].isCloseEnable = true;

                        }else if (vm.items[i].status == 'refund_failed') {
                            //vm.items[i].isCloseEnable = true;

                        }else if (vm.items[i].status == 'finished') {
                            vm.items[i].isCloseEnable = true;

                        }else if (vm.items[i].status == 'closed') {

                        }else if (vm.items[i].status == 'cancelled') {

                        }else if (vm.items[i].status == 'deleted') {

                        }else{
                            console.log('undefind order status:'+vm.items[i].status);
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


        vm.goOperItem = function (item,oper) {

            if(oper == 'confirm') {
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/confirm', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 'contract_sign'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/sign-contract', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 'pay'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/pay', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 'refund_accept'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/refund/accept ', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 'refund_reject'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/refund/reject', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 'ticket_release'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/release-ticket', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 'finish'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/finish', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 'cancel'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/cancel', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 'close'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/close', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }else if(oper == 'delete'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/delete', null, function success() {
                    toastr.success(i18n.t('u.OPER_SUC'));
                    getDatas();
                }, function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                });
            }
        };


        vm.openAlert = function (size,model, oper) {

            if(oper == 'offer' || oper == 'price' || oper == 'refund_accept' || oper=='refund_reject'){
                vm.openInput(size, model, oper);
                return;
            }
            vm.tipsInfo = {
                title:'修改订单',
                content:'您确定对该订单执行此操作吗？更改后将不可撤销!'
            };
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


        vm.openInput = function (size,item, oper) {
            var subPath = '';

            if(oper == 'offer' ){
                subPath = 'offer';
                vm.tipsInfo = {
                    title:'报价',
                    content:'请选择机型并编辑报价状态',
                    label:'报价',
                    type:'offer',
                    order:item

                };

                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContentOrderOffer.html',
                    size: 'md',
                    controller:'ModalInstanceOrderOfferCtrl',
                    resolve: {
                        tipsInfo: function () {
                            return vm.tipsInfo;
                        }
                    }
                });
                modalInstance.result.then(function (param) {
                    console.log(param);
                    // var fp = parseFloat(param);
                    //var myparam={totalAmount:fp};
                    param.amount = parseFloat(param.amount);
                    NetworkService.post(vm.reqPath2  +'/'+item.id +'/price',param,function (response) {
                        toastr.success(i18n.t('u.OPERATE_SUC'));
                        getDatas();
                    },function (response) {
                        toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                    });
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            }else if(oper == 'price'){
                subPath = 'price';
                vm.tipsInfo = {
                    title:'修改价格',
                    content:'请填写价格',
                    priceLabel:'新价格',
                    isDigit:true,
                    isRefund:false
                };


                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContentOrder.html',
                    size: 'md',
                    controller:'ModalInstanceOrderCtrl',
                    resolve: {
                        tipsInfo: function () {
                            return vm.tipsInfo;
                        }
                    }
                });
                modalInstance.result.then(function (param) {
                    console.log(param);
                    var fp = parseFloat(param.price);

                    var myparam={amount:fp};
                    NetworkService.post(vm.reqPath2  +'/'+item.id +'/price',myparam,function (response) {
                        toastr.success(i18n.t('u.OPERATE_SUC'));
                        getDatas();
                    },function (response) {
                        toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                    });
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });


            }else  if(oper == 'refund_accept'){





                subPath = 'refund/accept';


                if(item.status == 'refund_requested') {
                    vm.tipsInfo = {
                        title: '接收退款',
                        content: '请填写退款金额',
                        priceLabel: '退款金额',
                        isDigit: true,
                        isRefund: true,
                        refStatus: item.status

                    };

                    var modalInstance = $uibModal.open({
                        templateUrl: 'myModalContentOrder.html',
                        size: 'md',
                        controller: 'ModalInstanceOrderCtrl',
                        resolve: {
                            tipsInfo: function () {
                                return vm.tipsInfo;
                            }
                        }
                    });
                    modalInstance.result.then(function (param) {
                        console.log(param);
                        var fp = parseFloat(param.price);
                        var myparam = {amount: fp};
                        if (fp > item.totalPrice) {
                            toastr.error('退款失败，退款金额' + fp + '大于订单价格' + item.totalPrice);
                            return;
                        }
                        NetworkService.post(vm.reqPath2 + '/' + item.id + '/refund/accept', myparam, function (response) {
                            toastr.success(i18n.t('u.OPERATE_SUC'));
                            getDatas();
                        }, function (response) {
                            toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                        });
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }else  if(item.status != 'refund_requested') {
                    vm.tipsInfo = {
                        title:'商户退款',
                        content:'客户没有申请退款，确认是否退款 ？'
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

                        vm.tipsInfo = {
                            title: '商户退款',
                            content: '请填写退款金额',
                            priceLabel: '退款金额',
                            reasonLabel:'退款理由',
                            isDigit: true,
                            isRefund: true,
                            refStatus: item.status

                        };

                        var modalInstance = $uibModal.open({
                            templateUrl: 'myModalContentOrder.html',
                            size: 'md',
                            controller: 'ModalInstanceOrderCtrl',
                            resolve: {
                                tipsInfo: function () {
                                    return vm.tipsInfo;
                                }
                            }
                        });
                        modalInstance.result.then(function (param) {
                            console.log(param);
                            var fp = parseFloat(param.price);
                            var myparam = {amount: fp, reason:param.reason};
                            if (fp > item.totalPrice) {
                                toastr.error('退款失败，退款金额' + fp + '大于订单价格' + item.totalPrice);
                                return;
                            }
                            NetworkService.post(vm.reqPath2 + '/' + item.id + '/refund/initiate', myparam, function (response) {
                                toastr.success(i18n.t('u.OPERATE_SUC'));
                                getDatas();
                            }, function (response) {
                                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                            });
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });



                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });


                }


            }else if (oper=='refund_reject'){
                subPath = 'refund/reject';
                vm.tipsInfo = {
                    title:'拒绝退款',
                    content:'请填写拒绝理由',
                    reasonLabel:'退款理由',
                    isDigit:false,
                    isRefund:true

                };
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContentOrder.html',
                    size: 'md',
                    controller:'ModalInstanceOrderCtrl',
                    resolve: {
                        tipsInfo: function () {
                            return vm.tipsInfo;
                        }
                    }
                });
                modalInstance.result.then(function (param) {
                    console.log(param);
                    var myparam={reason:param.reason};
                    NetworkService.post(vm.reqPath2  +'/'+item.id +'/refund/reject',myparam,function (response) {
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
