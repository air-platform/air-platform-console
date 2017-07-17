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
                $scope.mdg = $scope.degree;
                $scope.vm.lngew = '东经';
                $scope.vm.lngDegree = '120';
                $scope.vm.lngMin = '34';
                $scope.vm.lngSec = '29';

                $scope.vm.latns = '北纬';
                $scope.vm.latDegree = '34';
                $scope.vm.latMin = '34';
                $scope.vm.latSec = '29';
                //$scope.degree = '150';









                var floatObj = function() {

                    /*
                     * 判断obj是否为一个整数
                     */
                    function isInteger(obj) {
                        return Math.floor(obj) === obj
                    }

                    /*
                     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
                     * @param floatNum {number} 小数
                     * @return {object}
                     *   {times:100, num: 314}
                     */
                    function toInteger(floatNum) {
                        var ret = {times: 1, num: 0}
                        var isNegative = floatNum < 0
                        if (isInteger(floatNum)) {
                            ret.num = floatNum
                            return ret
                        }
                        var strfi  = floatNum + ''
                        var dotPos = strfi.indexOf('.')
                        var len    = strfi.substr(dotPos+1).length
                        var times  = Math.pow(10, len)
                        var intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10)
                        ret.times  = times
                        if (isNegative) {
                            intNum = -intNum
                        }
                        ret.num = intNum
                        return ret
                    }

                    /*
                     * 核心方法，实现加减乘除运算，确保不丢失精度
                     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
                     *
                     * @param a {number} 运算数1
                     * @param b {number} 运算数2
                     * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
                     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
                     *
                     */
                    function operation(a, b, digits, op) {
                        var o1 = toInteger(a)
                        var o2 = toInteger(b)
                        var n1 = o1.num
                        var n2 = o2.num
                        var t1 = o1.times
                        var t2 = o2.times
                        var max = t1 > t2 ? t1 : t2
                        var result = null
                        switch (op) {
                            case 'add':
                                if (t1 === t2) { // 两个小数位数相同
                                    result = n1 + n2
                                } else if (t1 > t2) { // o1 小数位 大于 o2
                                    result = n1 + n2 * (t1 / t2)
                                } else { // o1 小数位 小于 o2
                                    result = n1 * (t2 / t1) + n2
                                }
                                return result / max
                            case 'subtract':
                                if (t1 === t2) {
                                    result = n1 - n2
                                } else if (t1 > t2) {
                                    result = n1 - n2 * (t1 / t2)
                                } else {
                                    result = n1 * (t2 / t1) - n2
                                }
                                return result / max
                            case 'multiply':
                                result = (n1 * n2) / (t1 * t2)
                                return result
                            case 'divide':
                                result = (n1 / n2) * (t2 / t1)
                                return result
                        }
                    }

                    // 加减乘除的四个接口
                    function add(a, b, digits) {
                        return operation(a, b, digits, 'add')
                    }
                    function subtract(a, b, digits) {
                        return operation(a, b, digits, 'subtract')
                    }
                    function multiply(a, b, digits) {
                        return operation(a, b, digits, 'multiply')
                    }
                    function divide(a, b, digits) {
                        return operation(a, b, digits, 'divide')
                    }

                    // exports
                    return {
                        add: add,
                        subtract: subtract,
                        multiply: multiply,
                        divide: divide
                    }
                }();



                $scope.vm.mydegree = $scope.degree;
                //$scope.vm.mydegree = -110.1010;
                $scope.isNeg = false;
                if($scope.vm.mydegree < 0){
                    $scope.isNeg = true;

                }
                if($scope.type == '1') {


                    var lng = $scope.vm.mydegree;

                    lng = ForDight(lng,6);

                    if(lng < 0){
                        $scope.isNeg = true;
                        lng = -lng;

                    }


                    $scope.vm.lngDegree = parseInt(lng);
                    $scope.vm.lngMin = parseInt(floatObj.subtract(lng, parseInt(lng), 6) * 60);
                    $scope.vm.lngSec = Math.round((floatObj.subtract(lng, parseInt(lng), 6) - parseInt((floatObj.subtract(lng, parseInt(lng), 6)) * 60) / 60) * 3600);
                    if($scope.vm.lngSec == 60){
                        $scope.vm.lngSec = 59;
                    }

                    if($scope.isNeg ){
                        $scope.vm.lngew = '西经';
                    }else{
                        $scope.vm.lngew = '东经';
                    }


                    console.log($scope.vm.lngDegree + ':' + $scope.vm.lngMin + ':' + $scope.vm.lngSec);


                   // console.log(ForDight(-110.1232,2));
                    //if(lng )
                    console.log($scope.vm.lngSec);
                }else{
                    var lat = $scope.vm.mydegree;
                    lat = ForDight(lat,6);


                    if(lat < 0){
                        $scope.isNeg = true;
                        lat = -lat;

                    }
                    //var lat = $scope.degree;
                    $scope.vm.latDegree = parseInt(lat);
                    $scope.vm.latMin = parseInt(floatObj.subtract(lat, parseInt(lat), 6) * 60);
                    $scope.vm.latSec = Math.round((floatObj.subtract(lat, parseInt(lat), 6) - parseInt((floatObj.subtract(lat, parseInt(lat), 6)) * 60) / 60) * 3600);
                    if($scope.vm.latSec == 60){
                        $scope.vm.latSec = 59;
                    }

                    if($scope.isNeg ){
                        $scope.vm.latns = '南纬';
                    }else{
                        $scope.vm.latns = '北纬';
                    }

                }


                console.log($scope.degree);
                $scope.vm.minOpt = [];
                $scope.vm.secOpt = [];
                $scope.vm.latDeg = [];
                $scope.vm.lngDeg = [];
                $scope.vm.latNS = ['北纬', '南纬'];
                $scope.vm.lngEW = ['东经', '西经'];
                for(var i = 0; i < 60; i ++){
                    //$scope.vm.minOpt.push(parseInt(i/10) + '' + i%10);
                    //$scope.vm.secOpt.push(parseInt(i/10) + '' + i%10);

                    $scope.vm.minOpt.push(i);
                    $scope.vm.secOpt.push(i);

                }
                for(var i = 0; i < 90; i ++){
                    //$scope.vm.latDeg.push(parseInt(i/10) + '' + i%10);
                    $scope.vm.latDeg.push(i);
                }

                for(var i = 0; i < 180; i ++){
                    //$scope.vm.lngDeg.push(i + '');
                    $scope.vm.lngDeg.push(i);
                }

                function ForDight(Dight,How){
                    Dight = Math.round(Dight*Math.pow(10,How))/Math.pow(10,How);
                    return Dight;
                }

                $scope.vm.isDegree = true;


                $scope.vm.getDegreeView = function (){
                    console.log('eeeeee');
                    if($scope.type == '1') {
                        var lng = $scope.vm.lngDegree + floatObj.divide($scope.vm.lngMin, 60, 6) + floatObj.divide($scope.vm.lngSec, 3600, 6);
                        lng = ForDight(lng,6);



                        console.log($scope.vm.lngew + ';'+ lng);

                        if($scope.vm.lngew == '西经'){
                            $scope.isNeg = true;
                            $scope.vm.mydegree = -lng;
                            $scope.degree = -lng;

                        }else{
                            $scope.isNeg = false;
                            $scope.vm.mydegree = lng;
                            $scope.degree = lng;
                        }


                    }else{
                        var lat = $scope.vm.latDegree + floatObj.divide($scope.vm.latMin, 60, 6) + floatObj.divide($scope.vm.latSec, 3600, 6);
                        lat = ForDight(lat,6);

                        if($scope.vm.latns == '南纬'){
                            $scope.isNeg = true;
                            $scope.vm.mydegree = -lat;
                            $scope.degree = -lat;

                        }else{
                            $scope.isNeg = false;
                            $scope.vm.mydegree = lat;
                            $scope.degree = lat;

                        }

                    }

                };
                $scope.vm.switchDegreeView = function (){

                    if($scope.type == '1') {
                        if ($scope.vm.isDegree) {
                            // var lng = ForDight(parseInt($scope.vm.lngDegree) + parseFloat($scope.vm.lngMin/60) + parseFloat($scope.vm.lngSec/3600), 8);
                            var lng = $scope.vm.lngDegree + floatObj.divide($scope.vm.lngMin, 60, 6) + floatObj.divide($scope.vm.lngSec, 3600, 6);
                            lng = ForDight(lng,6);
                            $scope.vm.mydegree = lng;
                            $scope.degree = lng;


                            if($scope.vm.lngew == '西经'){
                                $scope.isNeg = true;
                                $scope.vm.mydegree = -lng;
                                $scope.degree = -lng;

                            }else{
                                $scope.isNeg = false;
                                $scope.vm.mydegree = lng;
                                $scope.degree = lng;
                            }




                        } else {
                            var lng = $scope.vm.mydegree;
                            lng = ForDight(lng,6);
                            $scope.degree = lng;


                            if(lng < 0){
                                $scope.isNeg = true;
                                $scope.vm.lngew = '西经';
                                lng = -lng;
                            }else{
                                $scope.isNeg = false;
                                $scope.vm.lngew = '东经';
                            }
                            //var lng = $scope.degree;



                            $scope.vm.lngDegree = parseInt(lng);
                            $scope.vm.lngMin = parseInt(floatObj.subtract(lng, parseInt(lng), 6) * 60);
                            $scope.vm.lngSec = Math.round((floatObj.subtract(lng, parseInt(lng), 6) - parseInt((floatObj.subtract(lng, parseInt(lng), 6)) * 60) / 60) * 3600);
                            if($scope.vm.lngSec == 60){
                                $scope.vm.lngSec = 59;
                            }

                        }
                    }else{

                        if ($scope.vm.isDegree) {
                            // var lng = ForDight(parseInt($scope.vm.lngDegree) + parseFloat($scope.vm.lngMin/60) + parseFloat($scope.vm.lngSec/3600), 8);
                            var lat = $scope.vm.latDegree + floatObj.divide($scope.vm.latMin, 60, 6) + floatObj.divide($scope.vm.latSec, 3600, 6);
                            lat = ForDight(lat,6);
                            if($scope.vm.latns == '南纬'){
                                $scope.isNeg = true;
                                $scope.vm.mydegree = -lat;
                                $scope.degree = -lat;

                            }else{
                                $scope.isNeg = false;
                                $scope.vm.mydegree = lat;
                                $scope.degree = lat;

                            }
                        } else {
                            var lat = $scope.vm.mydegree;
                            lat = ForDight(lat,6);
                            $scope.degree = lat;
                            if(lat < 0){
                                $scope.isNeg = true;
                                $scope.vm.latns = '南纬';
                                lat = -lat;
                            }else{
                                $scope.isNeg = false;
                                $scope.vm.latns = '北纬';
                            }


                            //var lat = $scope.degree;
                            $scope.vm.latDegree = parseInt(lat);
                            $scope.vm.latMin = parseInt(floatObj.subtract(lat, parseInt(lat), 6) * 60);
                            $scope.vm.latSec = Math.round((floatObj.subtract(lat, parseInt(lat), 6) - parseInt((floatObj.subtract(lat, parseInt(lat), 6)) * 60) / 60) * 3600);
                            if($scope.vm.latSec == 60){
                                $scope.vm.latSec = 59;
                            }


                        }


                    }

                    console.log($scope.vm.mydegree)
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



