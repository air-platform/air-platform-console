/**
 * Created by Otherplayer on 16/7/25.
 */


    (function () {
    'use strict';

    angular
        .module('iot')
        .controller('AirtaxiEditController', AirtaxiEditController)
        .filter('userType',function(i18n) {
        return function(input) {
            var out = '';
            if(input=='admin') {
                out = i18n.t('profile.ADMIN')
            } else if(input=='tenant') {
                out = i18n.t('profile.TENANT')
            }
            return out;
        }
    });

    /** @ngInject */
    function AirtaxiEditController($scope, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.user = {};
        vm.title = i18n.t('profile.ADD_T_INFO');
        vm.power = i18n.t('profile.USER');
        vm.options = {
            power: [
                i18n.t('profile.USER'),
                i18n.t('profile.TENANT'),
                i18n.t('profile.ADMIN')
            ]
        };
        vm.isAdd = true;
        vm.isEdit = false;
        vm.isDetail = false;
        vm.getTenantItem = getTenantItem;
        vm.submitAction = submitAction;
        vm.lockTenant = lockTenant;
        vm.unlockTenant = unlockTenant;
        vm.backAction = backAction;
        vm.back = back;
        vm.addUser = {};
        vm.addUser.role='tenant';
        vm.subPath = 'airtaxis';
        vm.user.clientManagersArr = [];
        vm.userType = [
            {
                title:'管理员',
                value:'admin'
            },
            {
                title:'商户',
                value:'tenant'
            },
            {
                title:'用户',
                value:'user'
            }
        ];

        vm.statusType = [
            {
                title:'已启用',
                value:'enabled'
            },
            {
                title:'已禁用',
                value:'disabled'
            }
        ];

        vm.priceType = [
            {
                title:'人民币',
                value:'rmb'
            },
            {
                title:'美元',
                value:'usd'
            }
        ];

         vm.eventSources = [];

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();




        /*$scope.events = [
            {title: 'All Day Event',start: new Date(y, m, 1)},
            {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
            {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
            {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ];*/
        $scope.events = [
            {title: '¥1865',start: new Date(), editable:true, id:'1'},

        ];
        $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
        };


        $scope.eventsF = function (start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
            callback(events);
        };

         vm.eventSources = [$scope.events, , ];
        $scope.alertOnEventClick = function( date, jsEvent, view){
            $scope.alertMessage = (date.title + ' was clicked ');
            console.log($scope.alertMessage);
        };
        $scope.alertOnDrop = function( date, jsEvent, view){
            $scope.alertMessage = (date.title + ' was clicked ');
            console.log($scope.alertMessage);
        };
        $scope.alertOnResize = function( date, jsEvent, view){
            $scope.alertMessage = (date.title + ' was clicked ');
            console.log($scope.alertMessage);
        };
        vm.calendarConfig =
            {
                height: 300,
                editable: true,
                header:{
                    left: 'month',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertEventOnClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                dayClick:function(date, jsEvent, view) {
                    console.log('Clicked on: ' + date.format());
                    console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

                    console.log('Current view: ' + view.name);
                    console.log(view);

                    // change the day's background color just for fun
                    $(this).css('background-color', 'red');

                }
            };



       /* vm.calendarConfig =
        {
            height: 300,
            editable: true,
            header:{
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            eventClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
        };*/


        var map = new BMap.Map("map-div");          // 创建地图实例
        var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
        var geoc = new BMap.Geocoder();
        map.centerAndZoom(point, 10);
        map.enableScrollWheelZoom(false);     //开启鼠标滚轮缩放

        var finalMarker = null;
        vm.departureInfo = {lng:116.404, lat:39.915, desc:'出发地'};
        vm.arrivalInfo = {lng:117.204282,lat:39.134923, desc:'目的地'};
        function deletePoint(){
            /*var allOverlay = map.getOverlays();
            for (var i = 0; i < allOverlay.length-1; i++){
                if(allOverlay[i].getLabel().content == "出发地"){
                    map.removeOverlay(allOverlay[i]);
                }
            }*/
            map.clearOverlays();
        }

        vm.curve = null;

        function createNewCurveLine()
        {


            if(vm.curve != null){
                map.removeOverlay(vm.curve);
            }
            var beijingPosition=new BMap.Point(vm.departureInfo.lng, vm.departureInfo.lat);
            var   hangzhouPosition=new BMap.Point(vm.arrivalInfo.lng, vm.arrivalInfo.lat);
            var points = [beijingPosition,hangzhouPosition];

            vm.curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
            map.addOverlay(vm.curve); //添加到地图中
            vm.curve.disableEditing(); //开启编辑功能
        }
        function createNewMarker(pt, desc){
           // deletePoint();
            var ll = pt.lng+","+pt.lat;
            if(desc == '出发地'){
                vm.departureInfo.lng = pt.lng;
                vm.departureInfo.lat = pt.lat;
                document.getElementById('depature_loc').value = ll;
                console.log(ll+':'+desc);
            }else if(desc == '目的地'){
                vm.arrivalInfo.lng = pt.lng;
                vm.arrivalInfo.lat = pt.lat;
                document.getElementById('arrival_loc').value = ll;
                console.log(ll+':'+desc);
            }
            createNewCurveLine();
            console.log(ll+':'+desc);

            geoc.getLocation(pt, function(rs){
                if(vm.isAdd) {
                    var addComp = rs.addressComponents;
                    console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                    if (desc == '出发地') {
                        document.getElementById('depature_area').value = addComp.city;
                    } else if (desc == '目的地') {
                        document.getElementById('arrival_area').value = addComp.city;
                    }
                }
            });


            var label = new BMap.Label(desc,{ position : pt, offset:new BMap.Size(20,-10)});
            label.setStyle({
                color : "red",
                fontSize : "16px",
                height : "20px",
                fontFamily:"微软雅黑",
                border :"0"
            });
            var marker = new BMap.Marker(pt);

            map.addOverlay(marker);
            marker.setLabel(label);
            marker.enableDragging();








            marker.addEventListener("dragend",function(e){
                var ll = e.point.lng+","+e.point.lat;
                console.log(ll);

                console.log(e.target.getLabel().content);
               // if(e.target.getLabel().content)
                    if(e.target.getLabel().content == '出发地'){
                        vm.departureInfo.lng = e.point.lng;
                        vm.departureInfo.lat = e.point.lat;
                        document.getElementById('depature_loc').value = ll;
                    }else if(e.target.getLabel().content == '目的地'){
                        vm.arrivalInfo.lng = e.point.lng;
                        vm.arrivalInfo.lat = e.point.lat;
                        document.getElementById('arrival_loc').value = ll;
                    }
                    createNewCurveLine();

                geoc.getLocation(e.point, function(rs){

                    if(vm.isAdd) {
                        var addComp = rs.addressComponents;
                        console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                        if (e.target.getLabel().content == '出发地') {
                            document.getElementById('depature_area').value = addComp.city;
                        } else if (e.target.getLabel().content == '目的地') {
                            document.getElementById('arrival_area').value = addComp.city;
                        }
                    }

                });


            });
            finalMarker = marker;
        }


        vm.initMap = function()
        {
            map.clearOverlays();
            var dep = new BMap.Point(vm.departureInfo.lng, vm.departureInfo.lat);
            var arr = new BMap.Point(vm.arrivalInfo.lng, vm.arrivalInfo.lat);
            createNewMarker(dep,vm.departureInfo.desc);
            createNewMarker(arr,vm.arrivalInfo.desc);
           // map.centerAndZoom(dep, 8);

            var vp = map.getViewport([dep, arr]);
            map.centerAndZoom(vp.center, vp.zoom);

            // createNewCurveLine();
        }

        //vm.initMap();

       /* map.addEventListener("click",function (e) {
            var pt = e.point;
            createNewMarker(pt,"出发地");
        });*/



        var username = $stateParams.username;
        var type = $stateParams.args.type;
        console.log(type);
        if (username){
            vm.isAdd = false;
            vm.title = i18n.t('profile.EDIT_T_INFO');
        }

        if(type && type=='edit'){
            vm.isEdit = true;
        }
        if(type && type=='detail'){
            vm.isDetail = true;
        }





        vm.addNewCraftItem = function() {

            vm.user.aircraftItems.push({
                price:'',
                seatPrice:'',
                currencyUnit:'rmb',
                aircraft:''
            })
        }


        vm.addNewClientManager = function() {

            vm.user.clientManagersArr.push({
                name:'',
                email:''
            })
        }

        vm.removeClientManager = function(item) {
            var index = vm.user.clientManagersArr.indexOf(item);
            vm.user.clientManagersArr.splice(index, 1);
        }

        vm.realAddNewCraftItem = function(item) {
            console.log('ok');
            var index = vm.user.aircraftItemsAdd.indexOf(item);
            console.log('ok'+index);

            vm.user.aircraftItemsAdd.splice(index, 1);

            vm.user.aircraftItems.push(angular.copy(item));
            console.log(vm.user.aircraftItems);


        }
        vm.removeCraftItem = function(item) {
            var index = vm.user.aircraftItems.indexOf(item);
            vm.user.aircraftItems.splice(index, 1);
        }
        function getAircraftsDatas() {


            NetworkService.get(constdata.api.tenant.fleetPath  + '/aircrafts',{page:vm.pageCurrent},function (response) {
                vm.crafts = response.data.content;

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }
        getAircraftsDatas();

        function getTenantItem() {

            var myid = vm.userInfo.id;

            console.log(myid);
            console.log(username);
            NetworkService.get(constdata.api.tenant.fleetPath +'/' + vm.subPath + '/'+ username,null,function (response) {
                vm.user = response.data;

                vm.user.aircraftItemsAdd = [];
                vm.user.clientManagersArr = [];
                if(vm.user.aircraftItems.length > 0){
                    for (var i = 0; i < vm.user.aircraftItems.length; i ++){
                        vm.user.aircraftItems[i].aircraftId = vm.user.aircraftItems[i].aircraft.id;
                    }
                }

                if(vm.user.clientManagers){
                    var uInfo = vm.user.clientManagers.split( "," );

                    if(uInfo.length > 0){
                        for(var i = 0; i < uInfo.length; i ++){
                            var uDetailStr = uInfo[i].split(':');
                            if(uDetailStr.length > 0){
                                vm.user.clientManagersArr.push({
                                    name:uDetailStr[0],
                                    email:uDetailStr[1]
                                })
                            }

                        }
                    }


                }


                if(vm.user.departLoc){
                    var depLoc = vm.user.departLoc.split(',');
                    if(depLoc.length == 2){
                        vm.departureInfo.lng = parseFloat(depLoc[0]);
                        vm.departureInfo.lat = parseFloat(depLoc[1]);
                    }
                    var arrLoc = vm.user.arrivalLoc.split(',');
                    if(arrLoc.length == 2){
                        vm.arrivalInfo.lng = parseFloat(arrLoc[0]);
                        vm.arrivalInfo.lat = parseFloat(arrLoc[1]);
                    }
                }

                vm.initMap();
                $rootScope.userNamePlacedTop = vm.user.nickName;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED'));
            });
        }


        function addItem() {
            var myid = vm.userInfo.id;

            if(vm.user.aircraftItems.length > 0) {
                for (var i = 0; i < vm.user.aircraftItems.length; i++) {
                    var tmp = vm.user.aircraftItems[i].aircraftId;
                    vm.user.aircraftItems[i].aircraft = tmp;
                }
            }

            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);

            console.log(vm.user.aircraftItems);
           // return;


            vm.user.departLoc = document.getElementById('depature_loc').value;
            vm.user.departure = document.getElementById('depature_area').value;
            vm.user.arrivalLoc = document.getElementById('arrival_loc').value;
            vm.user.arrival = document.getElementById('arrival_area').value;

            NetworkService.post(constdata.api.tenant.fleetPath  + '/' + vm.subPath,vm.user,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }

        function editItem() {
            var myid = vm.userInfo.id;



            if(vm.user.aircraftItems.length > 0) {
                for (var i = 0; i < vm.user.aircraftItems.length; i++) {
                    var tmp = vm.user.aircraftItems[i].aircraftId;
                    vm.user.aircraftItems[i].aircraft = tmp;
                }
            }



            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);

            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);
            console.log(vm.user.aircraftItems);


            vm.user.departLoc = document.getElementById('depature_loc').value;
            vm.user.departure = document.getElementById('depature_area').value;
            vm.user.arrivalLoc = document.getElementById('arrival_loc').value;
            vm.user.arrival = document.getElementById('arrival_area').value;

            NetworkService.put(constdata.api.tenant.fleetPath  + '/' + vm.subPath + '/'+ username,vm.user,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });
        }
        function submitAction() {
            if (vm.isAdd){
                addItem();
            }else{
                editItem();
            }
        }

        function lockTenant() {
            NetworkService.post(constdata.api.tenant.lockPath +'/'+ username + '/lock',null,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.getTenantItem();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });
        }
        function unlockTenant() {
            NetworkService.post(constdata.api.tenant.lockPath +'/'+ username + '/unlock',null,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.getTenantItem();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status);
            });
        }

        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }


        vm.userInfo = StorageService.get('iot.hnair.cloud.information');

        if (!vm.isAdd){
            vm.getTenantItem();
            //vm.initMap();
        }else{
            vm.user.currencyUnit = 'rmb';
            vm.user.aircraftItems = [];
            vm.user.aircraftItemsAdd = [];
            vm.initMap();

            vm.user.departLoc = document.getElementById('depature_loc').value;
            vm.user.departure = document.getElementById('depature_area').value;
            vm.user.arrivalLoc = document.getElementById('arrival_loc').value;
            vm.user.arrival = document.getElementById('arrival_area').value;

        }

        function back() {
            // history.back();
            vm.backAction();
        }






        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };

        $scope.initDate = new Date('2016-15-20');
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];



        vm.uploadFile = function (){
            console.log(vm.myUploadFile);
            NetworkService.postForm('/api/v1/files',vm.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));

                console.log(response.data);
                vm.user.image = response.data.url;
                //vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }



        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };
        vm.initDate = new Date('2016-15-20');
        vm.formats = ['MM/dd/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[0];

        //每次选择不同版本请求不同数据
        vm.change = function() {
            vm.notificationDatas = [];
            getNotiData(vm.selectedOption);
        }

        // date picker
        vm.today = function() {
            vm.dt = new Date();
        };
        vm.today();

        vm.clear = function () {
            vm.dt = null;
        };

        // Disable weekend selection
        vm.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        vm.toggleMin = function() {
            vm.minDate = new Date();
        };
        vm.toggleMin();

        vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };



    }

})();