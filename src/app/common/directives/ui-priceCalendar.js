(function () {
    'use strict';

    angular.module('iot').directive( "priceCalendar", [ "$parse", function( $parse ){
        return {
            restrict: "E",
            scope: {
                prices: "=",
            },
            controller: function($scope, uiCalendarConfig,$element){
                var date = new Date();
                var d = date.getDate();
                var m = date.getMonth();
                var y = date.getFullYear();
                $scope.vm = {};
               // var vm =  $scope.vm;
                $scope.vm.eventSources = [];
                $scope.vm.refDate = '';
                $scope.vm.isModifyPrice = false;
                $scope.vm.priceLeft = '0px';
                $scope.vm.priceTop = '0px';
                $scope.vm.curCalEvent = '';
                $scope.vm.events = [];
                $scope.vm.airPrice = [];
                console.log($scope.prices);

                for(var i = 0; i < 30; i ++){
                    $scope.vm.airPrice.push(($scope.prices-i*30));
                }
                for(var i = 0; i < 30 ; i ++){
                    $scope.vm.events.push({title: $scope.vm.airPrice[i],start: new Date(y,m,d+i), editable:true, id:i});
                }

                $scope.vm.eventSources = [$scope.vm.events];
            //   console.log(vm);
                console.log(  uiCalendarConfig.calendars.taxiPriceCalendar);
                $scope.vm.calendarConfig =
                {
                    /*height: 200,
                     width:200,
                     aspectRatio: 1,*/
                    firstDay:1,
                    monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                    monthNamesShort:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    dayNames:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                    dayNamesShort:['周日','周一','周二','周三','周四','周五','周六'],
                    buttonText: {
                        today:'今天'
                    },
                    editable: true,
                    header:{
                        left: '',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    eventClick: function(calEvent, jsEvent, view) {

                        console.log('Event: ' + calEvent.title);

                        /* console.log($(this).find('.fc-title')[0].innerHTML);
                         console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                         var tt = $(this).find('.fc-title')[0];
                         console.log(tt.offsetLeft);
                         console.log(tt.offsetTop);
                         console.log($("#modifyPricePopup").offset());
                         $('#modifyPricePopup').css("left",1000);
                         $('#modifyPricePopup').css("top",jsEvent.pageY);*/

                        $scope.vm.priceLeft = jsEvent.pageX  + 'px';
                        $scope.vm.priceTop = (jsEvent.pageY - 20) + 'px';
                        $scope.vm.modifyPrice = calEvent.title;
                        $scope.vm.curCalEvent = calEvent;
                        console.log(calEvent.start.format());
                        if(calEvent.start.format() == $scope.vm.refDate){
                            $scope.vm.isModifyPrice = !$scope.vm.isModifyPrice;
                        }else{
                            $scope.vm.isModifyPrice = true;
                        }
                        $scope.vm.refDate = calEvent.start.format();
                    },
                    dayClick:function(date, jsEvent, view) {
                        console.log('Clicked on: ' + date.format());
                    }
                };

                $scope.vm.hideModifyPrice = function()
                {
                    $scope.vm.isModifyPrice = false;
                }
                $scope.vm.updateEventPrice = function()
                {
                    $scope.vm.isModifyPrice = false;
                    //console.log(vm.curCalEvent.title+';;;;'+vm.curCalEvent.id);
                    $scope.vm.curCalEvent.title = $scope.vm.modifyPrice;
                    $scope.vm.airPrice[$scope.vm.curCalEvent.id] = $scope.vm.modifyPrice;
                    console.log($scope.vm.airPrice);
                    uiCalendarConfig.calendars.taxiPriceCalendar.fullCalendar('updateEvent',$scope.vm.curCalEvent);


                }



            },
            link: function($scope, $element, $attr) {
                //angular.element($element).append("Hello "+$scope.prices);
                //angular.element($element).append($scope.modelValue);
            },

            templateUrl: 'app/common/directives/priceCalendar.html',
        }
    }])

})();



