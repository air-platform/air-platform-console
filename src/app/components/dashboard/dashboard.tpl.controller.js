
/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('iot').controller('DashCtrl', DashCtrl);

    /** @ngInject */
    function DashCtrl($stateParams,$state,StorageService,NetworkService,constdata,toastr,logger,i18n) {
        /* jshint validthis: true */
        var vm = this;



        /*GET platform/account/metrics
         GET /platform/product/metrics
         GET /platform/trade/metrics
         GET /platform/order/metrics

         GET /tenant/product/metrics
         GET /tenant/trade/metrics
         GET /tenant/order/metrics
         */



        vm.accountPath = 'account/metrics';
        vm.productPath = 'product/metrics';
        vm.tradePath = 'trade/metrics';
        vm.orderPath = 'order/metrics';

        vm.reqPath =  constdata.api.tenant.basePath;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.platPath;
            vm.isAdmin = true;
        }


        console.log(123);
        vm.productOption = {};
        vm.orderOption = {};
        function getDatas() {
            console.log(44);

            if(vm.isAdmin) {
                NetworkService.get(vm.reqPath + '/' + vm.accountPath, '', function (response) {
                    vm.accountInfo = response.data;
                    //console.log(vm.accountInfo);


                    // updatePagination(response.data);
                }, function (response) {
                    toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
                });
            }


            NetworkService.get(vm.reqPath + '/' + vm.productPath,'',function (response) {
                vm.productInfo = response.data;
                //console.log(vm.productInfo);

                var onlinePrd = [];
                var offlinePrd = [];
                var approvedPrd = [];
                var rejectedPrd = [];
                var pendingPrd = [];

                onlinePrd.push(vm.productInfo.details.fleet.publishedCount);
                offlinePrd.push(vm.productInfo.details.fleet.unpublishedCount);
                approvedPrd.push(vm.productInfo.details.fleet.reviewApprovedCount);
                rejectedPrd.push(vm.productInfo.details.fleet.reviewRejectedCount);
                pendingPrd.push(vm.productInfo.details.fleet.reviewPendingCount);


                onlinePrd.push(vm.productInfo.details.ferryflight.publishedCount);
                offlinePrd.push(vm.productInfo.details.ferryflight.unpublishedCount);
                approvedPrd.push(vm.productInfo.details.ferryflight.reviewApprovedCount);
                rejectedPrd.push(vm.productInfo.details.ferryflight.reviewRejectedCount);
                pendingPrd.push(vm.productInfo.details.ferryflight.reviewPendingCount);


                onlinePrd.push(vm.productInfo.details.jettravel.publishedCount);
                offlinePrd.push(vm.productInfo.details.jettravel.unpublishedCount);
                approvedPrd.push(vm.productInfo.details.jettravel.reviewApprovedCount);
                rejectedPrd.push(vm.productInfo.details.jettravel.reviewRejectedCount);
                pendingPrd.push(vm.productInfo.details.jettravel.reviewPendingCount);


                onlinePrd.push(vm.productInfo.details.airtour.publishedCount);
                offlinePrd.push(vm.productInfo.details.airtour.unpublishedCount);
                approvedPrd.push(vm.productInfo.details.airtour.reviewApprovedCount);
                rejectedPrd.push(vm.productInfo.details.airtour.reviewRejectedCount);
                pendingPrd.push(vm.productInfo.details.airtour.reviewPendingCount);


                onlinePrd.push(vm.productInfo.details.airtransport.publishedCount);
                offlinePrd.push(vm.productInfo.details.airtransport.unpublishedCount);
                approvedPrd.push(vm.productInfo.details.airtransport.reviewApprovedCount);
                rejectedPrd.push(vm.productInfo.details.airtransport.reviewRejectedCount);
                pendingPrd.push(vm.productInfo.details.airtransport.reviewPendingCount);


                onlinePrd.push(vm.productInfo.details.course.publishedCount);
                offlinePrd.push(vm.productInfo.details.course.unpublishedCount);
                approvedPrd.push(vm.productInfo.details.course.reviewApprovedCount);
                rejectedPrd.push(vm.productInfo.details.course.reviewRejectedCount);
                pendingPrd.push(vm.productInfo.details.course.reviewPendingCount);


                onlinePrd.push(vm.productInfo.details.airtaxi.publishedCount);
                offlinePrd.push(vm.productInfo.details.airtaxi.unpublishedCount);
                approvedPrd.push(vm.productInfo.details.airtaxi.reviewApprovedCount);
                rejectedPrd.push(vm.productInfo.details.airtaxi.reviewRejectedCount);
                pendingPrd.push(vm.productInfo.details.airtaxi.reviewPendingCount);


                /*var mytitle = '产品总数:'+vm.productInfo.totalCount+' 上线:'+vm.productInfo.publishedCount+' 下线:'+vm.productInfo.unpublishedCount+' 审批通过:'+
                    vm.productInfo.reviewApprovedCount+'待审批:'+vm.productInfo.reviewPendingCount+'审批拒绝:'+vm.productInfo.reviewRejectedCount+
                    '航校数:'+vm.productInfo.schoolCount;*/

                var mytitle = '产品总数:'+vm.productInfo.totalCount+' 上线:'+vm.productInfo.publishedCount+' 下线:'+vm.productInfo.unpublishedCount;
                var mysubtitle = '审批通过:'+
                    vm.productInfo.reviewApprovedCount+' 待审批:'+vm.productInfo.reviewPendingCount+' 审批拒绝:'+vm.productInfo.reviewRejectedCount+
                    ' 航校数:'+vm.productInfo.schoolCount;
                var option = {
                    title : {
                        text : mytitle,
                        subtext:mysubtitle,
                        textStyle: {
                            color: '#5ab1ef',
                            fontSize: 14,
                            fontWeight:'bold'
                        },
                        subtextStyle: {
                            color: '#5ab1ef',          // 副标题文字颜色
                            fontSize: 14,
                            fontWeight:'bold'
                        }
                    },
                    tooltip : {
                        trigger : 'axis',
                        showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        x: 'left',               // 水平安放位置，默认为全图居中，可选为：
                        y: 'bottom',
                        data:['上线产品数', '下线产品数','审批通过产品数','待审批产品数','审批拒绝产品数']
                    },
                    xAxis : [{
                        type : 'category',
                        data : ['包机预定', '缘梦飞行','高端出行','观光飞行','通勤航班','航校课程','Air Taxi'],
                        axisLabel:{
                            textStyle:{
                                color:"#222"
                            }
                        }
                    }],
                    yAxis : [{
                        type : 'value'
                    }],
                    series : [
                        {
                            name:'上线产品数',
                            type:'bar',
                            stack: '总量',
                            itemStyle : { normal: {color:'#b6a2de'}},
                            data:onlinePrd
                        },
                        {
                            name:'下线产品数',
                            type:'bar',
                            stack: '总量',
                            itemStyle : { normal: {color:'#2ec7c9'}},
                            data:offlinePrd
                        },
                        {
                            name:'审批通过产品数',
                            type:'bar',
                            stack: '总量2',
                            itemStyle : { normal: {color:'#5ab1ef'}},
                            data:approvedPrd
                        },
                        {
                            name:'待审批产品数',
                            type:'bar',
                            stack: '总量2',
                            itemStyle : { normal: {color:'#ffb980'}},
                            data:pendingPrd
                        },
                        {
                            name:'审批拒绝产品数',
                            type:'bar',
                            stack: '总量2',
                            itemStyle : { normal: {color:'#e5cf0d'}},
                            data:rejectedPrd
                        },


                    ]
                };


                vm.productOption = option;


                // updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });



            NetworkService.get(vm.reqPath + '/' + vm.orderPath,'',function (response) {
                vm.orderInfo = response.data;
               //console.log(vm.orderInfo);

                var allOrder= [];
                var monthOrder = [];
                var dayOrder = [];


                allOrder.push(vm.orderInfo.details.fleet.totalCount);
                monthOrder.push(vm.orderInfo.details.fleet.countThisMonth);
                dayOrder.push(vm.orderInfo.details.fleet.countToday);



                allOrder.push(vm.orderInfo.details.ferryflight.totalCount);
                monthOrder.push(vm.orderInfo.details.ferryflight.countThisMonth);
                dayOrder.push(vm.orderInfo.details.ferryflight.countToday);


                allOrder.push(vm.orderInfo.details.jettravel.totalCount);
                monthOrder.push(vm.orderInfo.details.jettravel.countThisMonth);
                dayOrder.push(vm.orderInfo.details.jettravel.countToday);


                allOrder.push(vm.orderInfo.details.airtour.totalCount);
                monthOrder.push(vm.orderInfo.details.airtour.countThisMonth);
                dayOrder.push(vm.orderInfo.details.airtour.countToday);


                allOrder.push(vm.orderInfo.details.airtransport.totalCount);
                monthOrder.push(vm.orderInfo.details.airtransport.countThisMonth);
                dayOrder.push(vm.orderInfo.details.airtransport.countToday);


                allOrder.push(vm.orderInfo.details.course.totalCount);
                monthOrder.push(vm.orderInfo.details.course.countThisMonth);
                dayOrder.push(vm.orderInfo.details.course.countToday);


                allOrder.push(vm.orderInfo.details.airtaxi.totalCount);
                monthOrder.push(vm.orderInfo.details.airtaxi.countThisMonth);
                dayOrder.push(vm.orderInfo.details.airtaxi.countToday);





                var mytitle = '订单总数:'+vm.orderInfo.totalCount+' 本月订单:'+vm.orderInfo.countThisMonth+' 今日订单:'+vm.orderInfo.countToday;

                var option = {
                    title : {
                        text : mytitle,

                        textStyle: {
                            color: '#5ab1ef',
                            fontSize: 14,
                            fontWeight:'bold'
                        },
                        subtextStyle: {
                            color: '#e61e28',          // 副标题文字颜色
                            fontSize: 14,
                            fontWeight:'bold'
                        }
                    },
                    tooltip : {
                        trigger : 'axis',
                        showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        x: 'left',               // 水平安放位置，默认为全图居中，可选为：
                        y: 'bottom',
                        data:['订单总数', '本月订单数','今日订单数']
                    },
                    xAxis : [{
                        type : 'category',
                        data : ['包机预定', '缘梦飞行','高端出行','观光飞行','通勤航班','航校课程','Air Taxi'],
                        axisLabel:{
                            textStyle:{
                                color:"#222"
                            }
                        }
                    }],
                    yAxis : [{
                        type : 'value'
                    }],
                    series : [
                        {
                            name:'订单总数',
                            type:'line',
                            itemStyle : { normal: {color:'#b6a2de'}},
                            data:allOrder
                        },
                        {
                            name:'本月订单数',
                            type:'bar',
                            itemStyle : { normal: {color:'#2ec7c9'}},
                            data:monthOrder
                        },
                        {
                            name:'今日订单数',
                            type:'bar',
                            itemStyle : { normal: {color:'#5ab1ef'}},
                            data:dayOrder
                        }


                    ]
                };


                vm.orderOption = option;
                //vm.tradeOption = option;
                // updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });




            NetworkService.get(vm.reqPath + '/' + vm.tradePath,'',function (response) {
                vm.tradeInfo = response.data;
                //console.log(vm.orderInfo);

                var revenueYearly= [];
                var revenueQuarterly = [];
                var revenueMonthly = [];

                var expenseYearly= [];
                var expenseQuarterly = [];
                var expenseMonthly = [];


                revenueYearly.push(vm.tradeInfo.details.wechat.revenueYearly);
                revenueQuarterly.push(vm.tradeInfo.details.wechat.revenueQuarterly);
                revenueMonthly.push(vm.tradeInfo.details.wechat.revenueMonthly);
                expenseYearly.push(vm.tradeInfo.details.wechat.expenseYearly);
                expenseQuarterly.push(vm.tradeInfo.details.wechat.expenseQuarterly);
                expenseMonthly.push(vm.tradeInfo.details.wechat.expenseMonthly);



                revenueYearly.push(vm.tradeInfo.details.newpay.revenueYearly);
                revenueQuarterly.push(vm.tradeInfo.details.newpay.revenueQuarterly);
                revenueMonthly.push(vm.tradeInfo.details.newpay.revenueMonthly);
                expenseYearly.push(vm.tradeInfo.details.newpay.expenseYearly);
                expenseQuarterly.push(vm.tradeInfo.details.newpay.expenseQuarterly);
                expenseMonthly.push(vm.tradeInfo.details.newpay.expenseMonthly);



                revenueYearly.push(vm.tradeInfo.details.alipay.revenueYearly);
                revenueQuarterly.push(vm.tradeInfo.details.alipay.revenueQuarterly);
                revenueMonthly.push(vm.tradeInfo.details.alipay.revenueMonthly);
                expenseYearly.push(vm.tradeInfo.details.alipay.expenseYearly);
                expenseQuarterly.push(vm.tradeInfo.details.alipay.expenseQuarterly);
                expenseMonthly.push(vm.tradeInfo.details.alipay.expenseMonthly);





                var mytitle = '本年度总收入:'+vm.tradeInfo.revenueYearly+' 本季度总收入:'+vm.tradeInfo.revenueQuarterly+' 本月总收入:'+vm.tradeInfo.revenueMonthly;
                var mysubtitle = '本年度总支出:'+vm.tradeInfo.expenseYearly+' 本季度总支出:'+vm.tradeInfo.expenseQuarterly+' 本月总支出:'+vm.tradeInfo.expenseMonthly;

                var option = {
                    title : {
                        text : mytitle,
                        subtext:mysubtitle,
                        textStyle: {
                            color: '#5ab1ef',
                            fontSize: 14,
                            fontWeight:'bold'
                        },
                        subtextStyle: {
                            color: '#e61e28',          // 副标题文字颜色
                            fontSize: 14,
                            fontWeight:'bold'
                        }
                    },
                    tooltip : {
                        trigger : 'axis',
                        showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        x: 'left',               // 水平安放位置，默认为全图居中，可选为：
                        y: 'bottom',
                        data:['年度收入', '季度收入','月收入','年度支出','季度支出','月支出']
                    },
                    xAxis : [{
                        type : 'category',
                        data : ['微信支付', '新生支付','支付宝'],
                        axisLabel:{
                            textStyle:{
                                color:"#222"
                            }
                        }
                    }],
                    yAxis : [{
                        type : 'value'
                    }],
                    series : [
                        {
                            name:'年度收入',
                            type:'line',
                            stack: 'year',
                            itemStyle : { normal: {color:'#b6a2de'}},
                            /*itemStyle : { normal: {label : {show: true, position: 'insideTop',textStyle:{color:'#000'}}}},*/
                            data:revenueYearly
                        },
                        {
                            name:'季度收入',
                            type:'bar',
                            stack: 'qurt',
                            itemStyle : { normal: {color:'#2ec7c9'}},
                            data:revenueQuarterly
                        },
                        {
                            name:'月收入',
                            type:'bar',
                            stack: 'month',
                            itemStyle : { normal: {color:'#5ab1ef'}},
                            data:revenueMonthly
                        },
                        {
                            name:'年度支出',
                            type:'line',
                            itemStyle : { normal: {color:'#ffb980'}},
                            data:expenseYearly
                        },
                        {
                            name:'季度支出',
                            type:'bar',
                            itemStyle : { normal: {color:'#e5cf0d'}},
                            data:expenseQuarterly
                        },
                        {
                            name:'月支出',
                            type:'bar',
                            itemStyle : { normal: {color:'#f2f2f2'}},
                            data:expenseMonthly
                        }


                    ]
                };


               // vm.orderOption = option;
                vm.tradeOption = option;
                // updatePagination(response.data);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });



           /* NetworkService.get(vm.reqPath + '/' + vm.tradePath,'',function (response) {
                vm.tradeInfo = response.data;
                console.log(vm.tradeInfo);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });*/




        }
        getDatas();




        if($stateParams){
            vm.hnaInfo = StorageService.get('iot.hnair.cloud.information');

            vm.nickname = vm.hnaInfo.name;
            var params = {tenantId:vm.nickname,args:{showBack:true,CustomTenantController:{args:{nickname:vm.hnaInfo.name},tenantId:$stateParams.tenantId}}};

            vm.gotoSubTenant = function (subTag) {
                if (subTag == 'application'){
                    $state.go('app.application',params);
                }else if (subTag == 'event'){
                    $state.go('app.event',params);
                }else if (subTag == 'devicemanager'){
                    $state.go('app.devicemanager',params);
                }else{
                    $state.go('app.product',params);
                }
            }

            vm.back = function () {
                $state.go('app.tenant');
            }
        }
        //判断是否为移动设备
        vm.isMobile = false;
        if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone | iPad | iPod/i)) {
            vm.isMobile = true;
        }
        //不同设备不同样式
        vm.myPaddingStyle = '';
        if(vm.isMobile) {
            vm.myPaddingStyle = {
                'padding-left': '0px',
                'padding-right': '0px'
            }
        } else {
            vm.myPaddingStyle = {
                'padding-left': '0px'
            }
        }

        vm.options = [{
            animate:{
                duration:0.5,
                enabled:false
            },
            barColor:'#4F83E8',
            scaleColor:false,
            trackColor:'#e8eff0',
            lineWidth:10,
            rotate:90,
            size:115,
            lineCap:'round'
        },{
            animate:{
                duration:0.5,
                enabled:false
            },
            barColor:'#B357D2',
            scaleColor:false,
            trackColor:'#e8eff0',
            lineWidth:10,
            rotate:90,
            size:115,
            lineCap:'round'
        },{
            animate:{
                duration:0.5,
                enabled:false
            },
            barColor:'#F5417E',
            scaleColor:false,
            trackColor:'#e8eff0',
            lineWidth:10,
            rotate:90,
            size:115,
            lineCap:'round'
        }];
        //百分百字体数组
        var $percentTextArr = $('span.text-info');
        if (isAdminer()){
            vm.percent = {cpu:45,'mem':30,'disk':40};
            vm.applicationNum = 90;
            vm.productNum = 24;
            vm.eventNum = 200;
            vm.deviceNum = 300;
            vm.monitorInfos = ['CPU','dashboard.MEM','dashboard.DISK'];

            vm.optionCpu = vm.options[0];
            vm.optionMem = vm.options[1];
            vm.optionDisk = vm.options[2];
            $($percentTextArr[0]).css('color','#4F83E8');
            $($percentTextArr[1]).css('color','#B357D2');
            $($percentTextArr[2]).css('color','#F5417E');

        }else{
            vm.percent = {cpu:45,'mem':30,'disk':40};
            vm.applicationNum = 0;
            vm.productNum = 0;
            vm.eventNum = 0;
            vm.deviceNum = 0;
            vm.monitorInfos = ['dashboard.ACTIVE_DEVICE_NO','dashboard.ACTIVE_EVENT_NO','dashboard.SDK_STA'];

            vm.optionCpu = vm.options[0];
            vm.optionMem = vm.options[0];
            vm.optionDisk = vm.options[0];
            $percentTextArr.each(function() {
                $(this).css('color', '#4F83E8');
            });
        }

        //设置pie字体大小
        $('span.text-info').each(function() {
            $(this).css({
                fontSize: '26px',
                top: '-74px',
                fontWeight: 'bold',
                position: 'relative'
            });
        });
        //把概况div高度和设备情况div高度设置为一样高
        window.setTimeout(function() {
            $('#box1').css({
                height: $('#box2').height()
            });
        }, 10);
        //如果是移动设备，降低高度为1/3
        if(vm.isMobile) {
            window.setTimeout(function() {
                $('#box1').css({
                    height: Number($('#box2').height())/3 + 'px'
                });
            }, 10);
        }


        function isAdminer() {
            // "ADMIN"; "TENANT"; "USER";
            var info = StorageService.get('iot.hnair.cloud.information');
            if (info && info.type.toUpperCase() == 'USER'){
                return true;
            }
            return false;
        }

        // var aData = [];
        // var nData = [];
        // for (var i = 0; i < 7; i++){
        //     aData.push(Math.round(Math.random()*10));
        //     nData.push(Math.round(Math.random()*10));
        // }

        // option = {
        //     tooltip : {
        //         trigger: 'item',
        //         formatter: "{a} <br/>{b} : {c} ({d}%)"
        //     },
        //     legend: {
        //         orient: 'vertical',
        //         left: 'left',
        //         data: ['create','pending','stop','running']
        //     },
        //     series : [
        //         {
        //             name: '服务状态',
        //             type: 'pie',
        //             radius : '55%',
        //             center: ['50%', '40%'],
        //             data:[
        //                 {value:43, name:'create'},
        //                 {value:10, name:'pending'},
        //                 {value:7, name:'stop'},
        //                 {value:40, name:'running'}
        //             ],
        //             itemStyle: {
        //                 emphasis: {
        //                     shadowBlur: 10,
        //                     shadowOffsetX: 0,
        //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 }
        //             }
        //         }
        //     ]
        // };

        //事件情况
        vm.eventOption = {
            title : {
                // text: '事件情况',
                subtext: '',
                left: 'left',
                textStyle: {
                    color: '#3399CC'
                }
            },
            tooltip : {
                trigger: 'axis',
                 formatter: '{a0}:{c0}万次,{a1}:{c1}h,{a2}:{c2}M',
                // backgroundColor: '#27c24c',
                axisPointer: {
                    lineStyle:{
                        type: 'solid',
                        color: '#23b7e5',
                        width: 2
                    }
                },
                textStyle:{
                    color: '#dcf2f8'
                }
            },
            legend: {
                data:['调用次数','平均响应时间','访问流量']
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
                    data : ['周一','周二','周三','周四','周五','周六','周日'],
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#23b7e5',
                            width: 2
                        }
                    },
                    splitLine:{
                        show: true,
                        lineStyle: {
                            color: '#dcf2f8'
                        }
                    }
                }

            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#23b7e5',
                            width: 0.25
                        }
                    },
                    splitLine:{
                        show: true,
                        lineStyle: {
                            color: '#dcf2f8'
                        }
                    }

                }
            ],
            series : [
                {
                    name:'调用次数',
                    type:'line',
                    smooth:true,
                    // symbol:'none',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    itemStyle:{
                        normal:{
                            color:'#4686CD',
                            lineStyle:{
                                color:'#4686CD',
                                width: 4
                            }
                        }
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : '调用次数'}
                        ],
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    color:'#4686CD'
                                }
                            }
                        }
                    }
                },
                {
                    name:'平均响应时间',
                    type:'line',
                    smooth:true,
                    // symbol:'none',
                    data:[2, 0.7, 4, 5, 3, 2, 1],
                    itemStyle:{
                        normal:{
                            color:'#9933CC',
                            lineStyle:{
                                color:'#9933CC',
                                width: 4
                            }
                        }
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : '平均增加'}
                        ],
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    color:'#9933CC'
                                }
                            }
                        }
                    }
                },
                {
                    name:'访问流量',
                    type:'line',
                    smooth:true,
                    // symbol:'none',
                    data:[4, 5, 6, 7, 4, 8, 1],
                    itemStyle:{
                        normal:{
                            color:'#66CC33',
                            lineStyle:{
                                color:'#66CC33',
                                width: 4
                            }
                        }
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : '平均增加'}
                        ],
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    color:'#66CC33'
                                }
                            }
                        }
                    }
                }
            ]
        };

    }

})();
