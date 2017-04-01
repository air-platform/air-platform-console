(function () {
    'use strict';

    angular.module('iot').controller('productApiCtrl', productApiCtrl);

    /** @ngInject */
    function productApiCtrl($state, $stateParams, NetworkService, constdata, $uibModal, $log, toastr, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;

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
    ]
    }
})();
