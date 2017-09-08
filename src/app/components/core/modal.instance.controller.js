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
        console.log(tipsInfo);
        $scope.reason = '';
        $scope.price = '';
        var ret = {price:'', reason:''};
        $scope.ok = function () {
            if(document.getElementById('price_id')) {
                ret.price = document.getElementById('price_id').value;
            }

            if(document.getElementById('reason_id')) {
                ret.reason = document.getElementById('reason_id').value;
            }

            console.log(ret);
            $uibModalInstance.close(ret);
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
        console.log(tipsInfo.order.type);

        $scope.selItem = {};
        $scope.tipsInfo = tipsInfo;
        $scope.rejectReason = '';
        if(tipsInfo.order.type == 'quickflight'){
            $scope.candidates = tipsInfo.order.aircraftCandidates;
        }else{
            $scope.candidates = tipsInfo.order.fleetCandidates;
        }
        console.log($scope.candidates);
        $scope.changeFleetCandidate = function(){
            //console.log('ddd'+$scope.selItem.candidate);
            if($scope.candidates && $scope.candidates.length > 0) {
                for(var i = 0; i < $scope.candidates.length; i ++){
                    if($scope.selItem.candidate == $scope.candidates[i].id){
                        $scope.selItem.candidate = $scope.candidates[i].id;
                        $scope.selItem.status = $scope.candidates[i].status;
                        $scope.selItem.amount = $scope.candidates[i].offeredPrice;
                        break;
                    }
                }

            }
        }

        if($scope.candidates && $scope.candidates.length > 0) {
            $scope.selItem.candidate = $scope.candidates[0].id;
            $scope.selItem.status = $scope.candidates[0].status;
            $scope.selItem.amount = $scope.candidates[0].offeredPrice;
        }

        $scope.ok = function () {
            $uibModalInstance.close($scope.selItem);
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
        .controller('ModalInstanceOrderInitiateCtrl', ModalInstanceOrderInitiateCtrl);

    /** @ngInject */
    function ModalInstanceOrderInitiateCtrl($uibModalInstance,$scope,tipsInfo,i18n) {
        /* jshint validthis: true */
        // var vm = this;

        $scope.selItem = new Array();
        $scope.addCandidate = function() {

            $scope.selItem.push({
                aircraft:$scope.tipsInfo.order.crafts[0].id,
                order:tipsInfo.order.id,
                status:'candidate'
                //offeredPrice:,
                //vendor:$scope.tipsInfo.order.crafts[0].vendor.id
            })
        }

        $scope.removeCandidate = function(item) {
            var index = $scope.selItem.indexOf(item);
            $scope.selItem.splice(index, 1);
        }


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
        console.log(tipsInfo.order.aircraftCandidates);
        if(tipsInfo.order.aircraftCandidates && tipsInfo.order.aircraftCandidates.length > 0) {
            //$scope.selItem = tipsInfo.order.fleetCandidates[0];
            for(var i = 0; i < tipsInfo.order.aircraftCandidates.length; i ++) {
                $scope.selItem[i] = {};
                $scope.selItem[i].aircraft = tipsInfo.order.aircraftCandidates[i].aircraft.id;
                $scope.selItem[i].order = tipsInfo.order.id;
                $scope.selItem[i].status = tipsInfo.order.aircraftCandidates[i].status;
                $scope.selItem[i].offeredPrice = tipsInfo.order.aircraftCandidates[i].offeredPrice;
               // $scope.selItem[i].vendor.id = tipsInfo.order.aircraftCandidates[i].vendor;
            }
            // $scope.selItem.name = tipsInfo.order.aircraftCandidates[0].fleet.name;
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















(function () {
    'use strict';

    angular
        .module('iot')
        .controller('ModalInstancePrdTopCtrl', ModalInstancePrdTopCtrl);

    /** @ngInject */
    function ModalInstancePrdTopCtrl($uibModalInstance,$scope,tipsInfo,i18n) {
        $scope.topValue = [];
        for(var i = 0; i < 101; i ++){
            $scope.topValue.push(i);
        }
        /* jshint validthis: true */
        $scope.selValue = 0;
        //$scope.selValue = tipsInfo.topValue;
       // console.log( $scope.selValue);
        $scope.tipsInfo = tipsInfo;
        $scope.selValue = $scope.tipsInfo.topValue;
       /* $scope.changeFleetCandidate = function(){
            console.log('ddd'+$scope.selItem.id);
            if(tipsInfo.order.fleetCandidates && tipsInfo.order.fleetCandidates.length > 0) {
                for(var i = 0; i < tipsInfo.order.fleetCandidates.length; i ++){
                    if($scope.selItem.id == tipsInfo.order.fleetCandidates[i].id){
                        //$scope.selItem = tipsInfo.order.fleetCandidates[i];
                        $scope.selItem.id = tipsInfo.order.fleetCandidates[i].id;
                        $scope.selItem.status = tipsInfo.order.fleetCandidates[i].status;
                        $scope.selItem.amount = tipsInfo.order.fleetCandidates[i].amount;
                        console.log('ok' + $scope.selItem.id);
                        break;
                    }
                }

            }
        }

        if(tipsInfo.order.fleetCandidates && tipsInfo.order.fleetCandidates.length > 0) {
            //$scope.selItem = tipsInfo.order.fleetCandidates[0];
            $scope.selItem.id = tipsInfo.order.fleetCandidates[0].id;
            $scope.selItem.status = tipsInfo.order.fleetCandidates[0].status;
            $scope.selItem.amount = tipsInfo.order.fleetCandidates[0].amount;
        }

        $scope.rejectReason = '';*/
        $scope.ok = function () {
           // console.log(document.getElementById('top-valueee').value);
            //console.log($scope);
            $scope.selValue = parseInt(document.getElementById('top-value').value.split(':')[1]);
            $uibModalInstance.close($scope.selValue);
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
        .controller('ModalInstancePrdPointCtrl', ModalInstancePrdPointCtrl);

    /** @ngInject */
    function ModalInstancePrdPointCtrl($uibModalInstance,$scope,tipsInfo,i18n) {

        /* jshint validthis: true */
        $scope.selValue = 0;
        $scope.tipsInfo = tipsInfo;
        $scope.ok = function () {
            // console.log(document.getElementById('top-valueee').value);
            console.log(document.getElementById('top-value-point').value);
            $scope.selValue = parseInt(document.getElementById('top-value-point').value);
            $uibModalInstance.close($scope.selValue);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss(i18n.t('u.CANCEL'));
        };

    }

})();