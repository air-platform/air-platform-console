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






(function () {
    'use strict';

    angular
        .module('iot')
        .controller('ModalInstanceInputCtrl', ModalInstanceInputCtrl);

    /** @ngInject */
    function ModalInstanceInputCtrl($uibModalInstance,$scope,tipsInfo,i18n) {
        /* jshint validthis: true */
        // var vm = this;

        $scope.tipsInfo = tipsInfo;
        $scope.rejectReason = '';
        $scope.ok = function () {
            $scope.rejectReason = document.getElementById('reject_id').value;
            console.log($scope.rejectReason);
            $uibModalInstance.close($scope.rejectReason);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss(i18n.t('u.CANCEL'));
        };

    }

})();






(function () {
    'use strict';

    angular
        .module('iot')
        .controller('ModalInstanceOrderCtrl', ModalInstanceOrderCtrl);

    /** @ngInject */
    function ModalInstanceOrderCtrl($uibModalInstance,$scope,tipsInfo,i18n) {
        /* jshint validthis: true */
        // var vm = this;

        $scope.tipsInfo = tipsInfo;
        $scope.rejectReason = '';
        $scope.ok = function () {
            $scope.rejectReason = document.getElementById('reject_id').value;
            console.log($scope.rejectReason);
            $uibModalInstance.close($scope.rejectReason);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss(i18n.t('u.CANCEL'));
        };

    }

})();