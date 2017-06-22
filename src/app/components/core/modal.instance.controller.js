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





(function () {
    'use strict';

    angular
        .module('iot')
        .controller('ModalInstanceOrderOfferCtrl', ModalInstanceOrderOfferCtrl);

    /** @ngInject */
    function ModalInstanceOrderOfferCtrl($uibModalInstance,$scope,tipsInfo,i18n) {
        /* jshint validthis: true */
        // var vm = this;
        $scope.orderStatus = [
            {
                title:'已报价',
                value:'offered'
            },
            {
                title:'未报价',
                value:'candidate'
            }
        ];
        $scope.changeFleetCandidate = function(){
            console.log('ddd'+$scope.selItem.id);
            if(tipsInfo.order.fleetCandidates && tipsInfo.order.fleetCandidates.length > 0) {
                for(var i = 0; i < tipsInfo.order.fleetCandidates.length; i ++){
                    if($scope.selItem.id == tipsInfo.order.fleetCandidates[i].id){
                        //$scope.selItem = tipsInfo.order.fleetCandidates[i];
                        $scope.selItem.id = tipsInfo.order.fleetCandidates[i].id;
                        $scope.selItem.status = tipsInfo.order.fleetCandidates[i].status;
                        $scope.selItem.totalCount = tipsInfo.order.fleetCandidates[i].totalCount;
                        console.log('ok' + $scope.selItem.id);
                        break;
                    }
                }

            }
        }
        $scope.selItem = {};
        if(tipsInfo.order.fleetCandidates && tipsInfo.order.fleetCandidates.length > 0) {
            //$scope.selItem = tipsInfo.order.fleetCandidates[0];
            $scope.selItem.id = tipsInfo.order.fleetCandidates[0].id;
            $scope.selItem.status = tipsInfo.order.fleetCandidates[0].status;
            $scope.selItem.totalCount = tipsInfo.order.fleetCandidates[0].totalCount;
        }
        $scope.tipsInfo = tipsInfo;
        $scope.rejectReason = '';
        $scope.ok = function () {
            //$scope.rejectReason = document.getElementById('reject_id').value;
            //console.log($scope.rejectReason);
            $uibModalInstance.close($scope.selItem);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss(i18n.t('u.CANCEL'));
        };

    }

})();