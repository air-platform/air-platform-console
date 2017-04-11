/**
 * Created by Otherplayer on 16/7/27.
 */

(function () {
    'use strict';

    angular
        .module('iot')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    /** @ngInject */
    function ModalInstanceCtrl($uibModalInstance,$scope,tipsInfo,i18n) {
        /* jshint validthis: true */
        // var vm = this;

        $scope.tipsInfo = tipsInfo;
        $scope.ok = function () {
            $uibModalInstance.close(i18n.t('u.OK'));
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss(i18n.t('u.CANCEL'));
        };

    }

})();