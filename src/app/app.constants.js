/* global angular:false, malarkey:false, moment:false */
(function () {
    'use strict';

    // Constants used by the entire app
    angular.module('airs')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('constdata', {
            debugMode: false,
            logLevel: 111111,//控制log显示的级别（0不显示,1显示）,从左到右每位分别代表[error,warn,info,debug,log]
            apiHost_ONLINE:'http://223.202.32.52/ai/api/v1/',
            apiHost_OFFLINE:'http://10.71.86.222:8080/api/v1/',
            api:{
                account:{
                    auth:"account/auth",//登录
                    info:"account/profile",//获取账户信息
                    platform:"platform/accounts"//Admin创建/删除/获取
                },
                agent:{
                    agent:"agents"
                },
                query:"query"
            }
        });
})();
