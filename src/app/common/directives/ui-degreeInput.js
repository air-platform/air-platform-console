(function () {
    'use strict';

    angular.module('iot').directive( "degreeInput", [ "$parse", function( $parse ){
        return {
            restrict: "E",
            scope: {
                degree: "=",
                type: "=",
                tips: "="
            },
            controller: function($scope,$element){
                var date = new Date();
                var d = date.getDate();
                var m = date.getMonth();
                var y = date.getFullYear();
                $scope.vm = {};
                console.log($scope.degree);
                $scope.vm.mydegree = $scope.degree;
                console.log($scope.degree);
                $scope.vm.minOpt = [];
                $scope.vm.secOpt = [];
                $scope.vm.latDeg = [];
                $scope.vm.lngDeg = [];
                $scope.vm.latNS = ['北纬', '南纬'];
                $scope.vm.lngEW = ['东经', '西经'];
                for(var i = 0; i < 60; i ++){
                    $scope.vm.minOpt.push(parseInt(i/10) + '' + i%10);
                    $scope.vm.secOpt.push(parseInt(i/10) + '' + i%10);
                }
                for(var i = 0; i < 90; i ++){
                    $scope.vm.latDeg.push(parseInt(i/10) + '' + i%10);
                }

                for(var i = 0; i < 180; i ++){
                    $scope.vm.lngDeg.push(i + '');
                }


                $scope.vm.isDegree = false;
                $scope.vm.switchDegreeView = function (){
                    $scope.vm.isDegree = !$scope.vm.isDegree;
                }


            },
            link: function($scope, $element, $attr) {
                //angular.element($element).append("Hello "+$scope.prices);
                //angular.element($element).append($scope.modelValue);
            },

            templateUrl: 'app/common/directives/degreeInput.html',
        }
    }])

})();



