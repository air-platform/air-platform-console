/**
 *
 * Run blocks - get executed after the injector is created and are used to kickstart the application.
 * Only instances and constants can be injected into run blocks. This is to prevent further
 * system configuration during application run time.
 *
 */

(function () {

    // 'use strict';

    angular.module('polly').run(runBlock);

    /** @ngInject */
    function runBlock($log,$rootScope) {
        $log.debug('IoT app started.');
        $rootScope.conversationIndex = 1; //控制training 弹出框那个显示左边框和背景颜色
        $rootScope.selectParmeterIsShow = false; //控制 点击intent 边框弹出的显示隐藏
        $rootScope.parmeterActiveIsShow = false; // 控制 输入框选中后的时间显示隐藏
        $rootScope.trainingList = []; //数据列表
    }


})();
