(function () {
    'use strict';

    angular.module('iot').controller('productApiCtrl', productApiCtrl);

    /** @ngInject */
    function productApiCtrl($state, $stateParams, NetworkService, constdata, $uibModal, $log, toastr, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;

        var argsProduct = {};
        isBrowserBackBtn();

        function isBrowserBackBtn() {
            if(hasNameAttr($stateParams.args)) {
                //浏览器回退按钮加载的本页面
                argsProduct = JSON.parse( sessionStorage.getItem('sessionStoredProduct') ).product
            } else {
                //路由跳转加载的，要本地存储
                argsProduct = $stateParams.args;
            }
        }

        function hasNameAttr(obj){
            for (var name in obj){
                return false;
            }
            return true;
        };

        if (argsProduct.service_name == '人工智能'){
            vm.pollydata = [
                {
                    "name": "/ai/v1/account/auth", "option": "POST", "parames": {
                    username: "user1",
                    password: "Hna@pwd123"
                }, "description": "认证", "example": ""
                },
                {
                    "name": "/ai/v1/account/apikeys",
                    "option": "GET",
                    "parames": "",
                    "description": "获取api key",
                    "example": ""
                },
                {
                    "name": "/ai/v1/query", "option": "POST", "parames": {
                    "name": "event1",
                    "data": {
                        "k1": "v1",
                        "k2": "v2"
                    }
                },
                    "description": "请求",
                    "example": ""
                },
                {
                    "name": "/ai/v1/action", "option": "POST", "parames": {
                    "source": "agent",
                    "score": 0.65675226,
                    "resolvedQuery": "上海的邮编是多少？"
                },
                    "description": "网络回调",
                    "example": ""
                }
            ];
        }
        if (argsProduct.service_name == '大数据舆情'){
            vm.pollydata = [
                {
                    "name": "/records/news", "option": "GET", "parames": "",
                    "description": "新闻舆情/全网事件/列表集合", "example": ""
                },
                {
                    "name": "/records/news/:rowKey",
                    "option": "GET",
                    "parames": "",
                    "description": "新闻舆情/全网事件/单个详情",
                    "example": ""
                },
                {
                    "name": "/reports/news/overview", "option": "GET", "parames": "",
                    "description": "新闻舆情/统计分析/数据总览",
                    "example": ""
                },
                {
                    "name": "/reports/news/singlePublic", "option": "GET", "parames": "",
                    "description": "新闻舆情/统计分析/（单日）大众走势分析",
                    "example": ""
                },
                {
                    "name": "/reports/news/muchTrend", "option": "GET", "parames": "",
                    "description": "新闻舆情/统计分析/(多日)板块-媒体趋势(柱图)",
                    "example": ""
                },
                {
                    "name": " /reports/news/cloud", "option": "GET", "parames": "",
                    "description": "新闻舆情/统计分析/热点词云图 正的(词云图)",
                    "example": ""
                }
            ];
        }
        if (argsProduct.service_name == '物联网'){
            vm.pollydata = [
                {
                    "name": "/iot/api/v1/account/auth", "option": "POST", "parames": {"username":"admin","password":"p0o9i8u7"},
                    "description": "平台认证", "example": ""
                },
                {
                    "name": "/iot/api/v1/account/profile",
                    "option": "GET",
                    "parames": "",
                    "description": "获取用户信息",
                    "example": ""
                },
                {
                    "name": "/iot/api/v1/apps", "option": "POST", "parames": {
                    "name": "app1",
                    "credentialsProvider": "default",
                    "description": "My App Desc"
                },
                    "description": "添加app",
                    "example": ""
                },
                {
                    "name": "/iot/api/v1/admin/tenants/tenant1/apps", "option": "GET", "parames": "",
                    "description": "获取app信息",
                    "example": ""
                },
                {
                    "name": "/iot/api/v1/account/profile", "option": "PUT", "parames": {"nickName":"Admin Hehe"},
                    "description": "更新用户信息",
                    "example": ""
                },
                {
                    "name": "/iot/api/v1/account/token/refresh", "option": "POST", "parames": "",
                    "description": "更新用户token",
                    "example": ""
                },
                {
                    "name": "/iot/api/v1/apps/app1", "option": "DELETE", "parames": "",
                    "description": "删除 app",
                    "example": ""
                }
            ];
        }
    }
})();
