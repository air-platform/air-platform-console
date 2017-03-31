
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
            getDatas();
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

        function getDatas() {



            vm.applicationNum = 72;//response.data.applicationsCount;
            vm.productNum = 11;//response.data.productsCount;
           /* NetworkService.get(constdata.api.dashboard.metrics,null,function (response) {
                vm.applicationNum = 72;//response.data.applicationsCount;
                vm.productNum = 11;//response.data.productsCount;
                vm.eventNum = response.data.eventClassFamiliesCount;
                vm.deviceNum = response.data.devicesCount;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });*/
        }
        //
        // if(!isAdminer()){
        //
        // }

        getDatas();

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
