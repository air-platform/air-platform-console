/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('OrderAirbookController', OrderAirbookController);

    /** @ngInject */
    function OrderAirbookController(NetworkService,StorageService, constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
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
            'offered':'bg-info'
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
            'offered':'已报价'

        };

        vm.editPath = 'app.editorderairbook';

        vm.reqPath = constdata.api.order.airbook;
        vm.reqPath2 = constdata.api.order.airbook;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
             vm.reqPath  =constdata.api.order.adminBase+'?type=fleet';
            vm.reqPath2  =constdata.api.order.adminBase;
            vm.isAdmin = true;
        }



        function getDatas() {
            NetworkService.get(vm.reqPath,{page:vm.pageCurrent,pageSize:10},function (response) {


            /* var monk =    [{
                    "id" : "7f000101-5cca-1c76-815c-cea67a7c00e1",
                    "orderNo" : "C2E865DAD000000",
                    "type" : "airtour",
                    "pointsUsed" : 0,
                    "quantity" : 1,
                    "totalPrice" : 2000.00,
                    "originalTotalPrice" : 2000.00,
                    "currencyUnit" : "usd",
                    "status" : "created",
                    "commented" : false,
                    "creationDate" : "2017-06-22 15:13:55",
                    "lastModifiedDate" : "2017-06-22 15:13:55",
                    "paymentDate" : null,
                    "refundedDate" : null,
                    "finishedDate" : null,
                    "closedDate" : null,
                    "cancelledDate" : null,
                    "deletedDate" : null,
                    fleetCandidates:[
                        {
                           id:'1',
                            name:'bbg',
                            status:'offered',
                            amount:100
                        },
                        {
                            id:'2',
                            name:'bbk',
                            status:'offered',
                            amount:200
                        }

                    ],
                    "contact" : {
                    "person" : "jamesk",
                        "mobile" : "18392880716",
                        "email" : ""
                },
                    "refundReason" : null,
                    "refundFailureCause" : null,
                    "cancelReason" : null,
                    "closedReason" : null,
                    "note" : null,
                    "owner" : "7f000101-5c85-14fc-815c-863ef11c0029",
                    "payment" : null,
                    "refund" : null,
                    "salesPackage" : {
                    "id" : "7f000101-5ca5-1e64-815c-a64cca9d002b",
                        "name" : "两人套餐",
                        "passengers" : 2,
                        "prices" : "2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0",
                        "presalesDays" : 2,
                        "currencyUnit" : "rmb",
                        "description" : "des",
                        "aircraft" : {
                        "id" : "7f000101-5c81-1046-815c-855d1176000a",
                            "flightNo" : "B-7186",
                            "name" : "首航直升机H135 B-7186",
                            "image" : null,
                            "type" : "H135",
                            "category" : "直升机",
                            "seats" : 4,
                            "minPassengers" : 4,
                            "creationDate" : "2017-06-08T01:41:28.000+0000",
                            "description" : null,
                            "vendor" : {
                            "name" : "bjch",
                                "id" : "7f000101-5c80-17f4-815c-809ae1da0005",
                                "avatar" : "http://ool5ftqf4.bkt.clouddn.com/HNA_Helicopter_Icon.png"
                        }
                    },
                    "product" : "7f000101-5c8a-1d71-815c-8b4c4db40029"
                },
                    "salesPackagePrice" : 2000.00,
                    "departureDate" : "2017-06-22",
                    "timeSlot" : "15:00-17:00",
                    "passengers" : [ {
                    "id" : "7f000101-5cca-1c76-815c-cea67a7c00e2",
                    "order" : "7f000101-5cca-1c76-815c-cea67a7c00e1",
                    "passenger" : {
                        "id" : null,
                        "name" : "小三",
                        "mobile" : "13520671119",
                        "identity" : "110108198812081982",
                        "owner" : null
                    }
                } ],
                    "airTour" : {
                    "id" : "7f000101-5c8a-1d71-815c-8b4c4db40029",
                        "reviewStatus" : "approved",
                        "rejectedReason" : null,
                        "name" : "漓江尊享飞行",
                        "category" : "air_tour",
                        "image" : "http://ool5ftqf4.bkt.clouddn.com/guilin-005.png",
                        "score" : 4.8,
                        "totalSales" : 0,
                        "rank" : 100,
                        "published" : true,
                        "creationDate" : "2017-06-09 13:20:52",
                        "clientManagers" : "刘世玺:shix.liu@hnair.com",
                        "description" : "漓江",
                        "vendor" : {
                        "name" : "bjch",
                            "id" : "7f000101-5c80-17f4-815c-809ae1da0005",
                            "avatar" : "http://ool5ftqf4.bkt.clouddn.com/HNA_Helicopter_Icon.png"
                    },
                    "salesPackages" : [ {
                        "id" : "7f000101-5ca5-1e64-815c-a64cca9d002b",
                        "name" : "两人套餐",
                        "passengers" : 2,
                        "prices" : "2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0,2000.0",
                        "presalesDays" : 2,
                        "currencyUnit" : "rmb",
                        "description" : "des",
                        "aircraft" : {
                            "id" : "7f000101-5c81-1046-815c-855d1176000a",
                            "flightNo" : "B-7186",
                            "name" : "首航直升机H135 B-7186",
                            "image" : null,
                            "type" : "H135",
                            "category" : "直升机",
                            "seats" : 4,
                            "minPassengers" : 4,
                            "creationDate" : "2017-06-08T01:41:28.000+0000",
                            "description" : null,
                            "vendor" : {
                                "name" : "bjch",
                                "id" : "7f000101-5c80-17f4-815c-809ae1da0005",
                                "avatar" : "http://ool5ftqf4.bkt.clouddn.com/HNA_Helicopter_Icon.png"
                            }
                        },
                        "product" : "7f000101-5c8a-1d71-815c-8b4c4db40029"
                    } ],
                        "city" : "桂林",
                        "tourDistance" : "40",
                        "tourTime" : 35,
                        "tourPoint" : "芦笛岩,110.273565,25.30411025;桃花江,115.118489,39.047105;南洲大桥,110.32333, 25.316806;古东瀑布景区,110.461771,25.113984",
                        "tourShow" : "###尧山\n尧山位于桂林市东郊，距市中心8公里，主峰海拔909.3米，是桂林市最高的山因周唐时在山上建有尧帝庙而得名。尧山以变幻莫测、绚丽多彩的四时景致闻名于世，乘观光索道可直达尧山之顶，在山顶向东南方望去，您可以看到巨大的天然卧佛，犹如释迦牟尼睡卧在莲蓬之上，这是迄今发现的最大的天然卧佛。\n![](http://ool5ftqf4.bkt.clouddn.com/guilin-001.png)\n###古东瀑布景区\n古东森林瀑群旅游区位于大圩镇古东村蝴蝶山麓——草坪公路8公里处，漓江外事码头对岸，距桂林市25公里。古东瀑布溪水清澈，四季不枯，河水平均含沙量仅 0.1克/立方米，年平均流量5立方米/秒。瀑布共分13级，全程落差90米，平均宽度为20米。古东森林瀑群旅游区森林覆盖率达96%，占地面积约3000亩，其中原始生长林2000亩。林区古木参天，红枫诱人。藤缠树，树缠藤，野趣横生。景色秀丽，鸟语花香，空气清新。是距桂林市区最近、面积最宽、最具特色的一处森林公园，也是登山探险、森林寻幽之佳境。\n![](http://ool5ftqf4.bkt.clouddn.com/GuiLin09.png)\n###穿山景区\n穿山景区内绿草茵茵，苍松翠竹，山花烂漫，环境优雅。穿山隔着漓江与象鼻山相望，与江西岸的龟山，形如两只相斗的公鸡，合称斗鸡山。穿山前有塔山，峻峭的塔山上，明代建筑的一座七层六角实心的“寿佛塔”，巍然矗立，倒映江中，雅致清丽，“塔山清影”为桂林著名老八景之一。小东江自北而南，曲贯穿山与塔山之间，山倒影江中，更是景色尤佳。\n![](http://ool5ftqf4.bkt.clouddn.com/guilin-007.png)\n\n",
                        "boardingLocation" : "宁波市奉化区溪口镇武岭西路39号宁波东海通航飞行基地",
                        "traffic" : "无",
                        "tourRoute" : "芦笛景区-桃花江-南洲大桥-尧山--磨盘山-桃花江-大圩古镇-古东瀑布景区-芦笛景区  （30分钟）"
                }
                }];*/








                vm.items = response.data.content;
               // vm.items = monk;//response.data.content;

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

                        //vm.items[i].isCandidateEnable = false;



                        if (vm.items[i].status == 'created') {
                            vm.items[i].isCloseEnable = true;
                            vm.items[i].isOfferEnable = true;
                             //vm.items[i].isPriceEnable = true;
                            //vm.items[i].isConfirmOrderEnable = true;

                        }else if (vm.items[i].status == 'customer_confirmed') {

                            vm.items[i].isSignEnable = true;
                            vm.items[i].isPriceEnable = true;
                            vm.items[i].isConfirmOrderEnable = true;

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

                        }else if (vm.items[i].status == 'candidate') {
                            vm.items[i].isOfferEnable = true;

                        }else if (vm.items[i].status == 'offered') {
                            vm.items[i].isCandidateEnable = true;
                        }else if (vm.items[i].status == 'selected') {

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



        function removeItem(item) {
            NetworkService.delete(vm.reqPath2  + '/'+ item.id,null,function success() {
                toastr.success(i18n.t('u.DELETE_SUC'));
                getDatas();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

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
            }else if(oper == 'candidate'){
                NetworkService.post(vm.reqPath2 + '/' + item.id + '/candidate', null, function success() {
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
                    NetworkService.post(vm.reqPath2  +'/'+item.id +'/price?candidate='+param.id,param,function (response) {
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
                    label:'价格'
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
                    var fp = parseFloat(param);
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
                vm.tipsInfo = {
                    title:'接收退款',
                    content:'请填写退款金额',
                    label:'金额'
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
                    var fp = parseFloat(param);
                    var myparam={amount:fp};
                    NetworkService.post(vm.reqPath2  +'/'+item.id +'/refund/accept',myparam,function (response) {
                        toastr.success(i18n.t('u.OPERATE_SUC'));
                        getDatas();
                    },function (response) {
                        toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
                    });
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });



            }else if (oper=='refund_reject'){
                subPath = 'refund/reject';
                vm.tipsInfo = {
                    title:'拒绝退款',
                    content:'请填写拒绝理由',
                    label:'理由'
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
                    var myparam={reason:param};
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
