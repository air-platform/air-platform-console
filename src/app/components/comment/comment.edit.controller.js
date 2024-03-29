/**
 * Created by Otherplayer on 16/7/25.
 */


    (function () {
    'use strict';

    angular
        .module('iot')
        .controller('CommentEditController', CommentEditController)
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
    function CommentEditController($scope,uiCalendarConfig, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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


















        vm.togglePriceCalendar = function(item)
        {


            item.showPriceCalendar = !item.showPriceCalendar;
            if(item.showPriceCalendar){
                item.priceButtonTitle = '收起';
            }else{
                item.priceButtonTitle = '详情';
            }

        }





        var map = new BMap.Map("map-div",{minZoom:8,maxZoom:8});          // 创建地图实例
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
                document.getElementById('depature_loc_lng_taxi').value = vm.departureInfo.lng;
                document.getElementById('depature_loc_lat_taxi').value = vm.departureInfo.lat;
                console.log(ll+':'+desc);
            }else if(desc == '目的地'){
                vm.arrivalInfo.lng = pt.lng;
                vm.arrivalInfo.lat = pt.lat;
                document.getElementById('arrival_loc_lng_taxi').value = vm.arrivalInfo.lng;
                document.getElementById('arrival_loc_lat_taxi').value =  vm.arrivalInfo.lat;
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
                        document.getElementById('depature_loc_lng_taxi').value = vm.departureInfo.lng;
                        document.getElementById('depature_loc_lat_taxi').value = vm.departureInfo.lat;
                    }else if(e.target.getLabel().content == '目的地'){
                        vm.arrivalInfo.lng = e.point.lng;
                        vm.arrivalInfo.lat = e.point.lat;
                        document.getElementById('arrival_loc_lng_taxi').value = vm.arrivalInfo.lng;
                        document.getElementById('arrival_loc_lat_taxi').value =  vm.arrivalInfo.lat;
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
        console.log($stateParams.args);
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
            var pp = [];
            for(var i = 0; i < 30; i ++){
               pp.push(2000);
            }

            vm.user.salesPackages.push({
                name:'',
                prices:pp.toString(),
                description:'des',
                currencyUnit:'rmb',
                aircraft:'',
                showPriceCalendar:false,
                priceButtonTitle:'详情'
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


        vm.removeCraftItem = function(item) {
            var index = vm.user.salesPackages.indexOf(item);
            vm.user.salesPackages.splice(index, 1);
        }


        function getTenantItem() {

            var myid = vm.userInfo.id;

            console.log(myid);
            console.log(username);
            NetworkService.get(constdata.api.comment.basePath +'?product='+ username,null,function (response) {
                vm.user = response.data;

                console.log(vm.user);
                vm.user.clientManagersArr = [];
                if(vm.user.salesPackages && vm.user.salesPackages.length > 0){
                    for (var i = 0; i < vm.user.salesPackages.length; i ++){
                        vm.user.salesPackages[i].aircraftId = vm.user.salesPackages[i].aircraft.id;
                        vm.user.salesPackages[i].showPriceCalendar = false;
                        vm.user.salesPackages[i].priceButtonTitle = '详情';



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


                if(vm.user.flightRoute){

                    vm.departureInfo.lng = parseFloat(vm.user.flightRoute.departureLongitude);
                    vm.departureInfo.lat = parseFloat(vm.user.flightRoute.departureLatitude);


                    vm.arrivalInfo.lng = parseFloat(vm.user.flightRoute.arrivalLongitude);
                    vm.arrivalInfo.lat = parseFloat(vm.user.flightRoute.arrivalLatitude);

                }

                vm.initMap();
                $rootScope.userNamePlacedTop = vm.user.nickName;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED')+vm.authError);
            });
        }


        function addItem() {
            var myid = vm.userInfo.id;

            if(vm.user.salesPackages.length > 0) {
                for (var i = 0; i < vm.user.salesPackages.length; i++) {
                    var tmp = vm.user.salesPackages[i].aircraftId;
                    vm.user.salesPackages[i].aircraft = tmp;
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

            console.log(vm.user.salesPackages);
           // return;



            vm.user.flightRoute.departureLongitude = document.getElementById('depature_loc_lng_taxi').value;
            vm.user.flightRoute.departureLatitude = document.getElementById('depature_loc_lat_taxi').value;
            vm.user.flightRoute.departure = document.getElementById('depature_area').value;

            vm.user.flightRoute.arrivalLongitude = document.getElementById('arrival_loc_lng_taxi').value;
            vm.user.flightRoute.arrivalLatitude = document.getElementById('arrival_loc_lat_taxi').value;
            vm.user.flightRoute.arrival = document.getElementById('arrival_area').value;




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



            if(vm.user.salesPackages.length > 0) {
                for (var i = 0; i < vm.user.salesPackages.length; i++) {
                    var tmp = vm.user.salesPackages[i].aircraftId;
                    vm.user.salesPackages[i].aircraft = tmp;
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
            console.log(vm.user.salesPackages);


            vm.user.flightRoute.departureLongitude = document.getElementById('depature_loc_lng_taxi').value;
            vm.user.flightRoute.departureLatitude = document.getElementById('depature_loc_lat_taxi').value;
            vm.user.flightRoute.departure = document.getElementById('depature_area').value;

            vm.user.flightRoute.arrivalLongitude = document.getElementById('arrival_loc_lng_taxi').value;
            vm.user.flightRoute.arrivalLatitude = document.getElementById('arrival_loc_lat_taxi').value;
            vm.user.flightRoute.arrival = document.getElementById('arrival_area').value;

            NetworkService.put(constdata.api.tenant.fleetPath  + '/' + vm.subPath + '/'+ username,vm.user,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText);
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
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText);
            });
        }
        function unlockTenant() {
            NetworkService.post(constdata.api.tenant.lockPath +'/'+ username + '/unlock',null,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.getTenantItem();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + response.status + ' ' + response.statusText);
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
            vm.user.flightRoute = {};
            vm.user.currencyUnit = 'rmb';
            vm.user.salesPackages = [];
            vm.initMap();

            vm.user.flightRoute.departureLongitude = document.getElementById('depature_loc_lng_taxi').value;
            vm.user.flightRoute.departureLatitude = document.getElementById('depature_loc_lat_taxi').value;
            vm.user.flightRoute.departure = document.getElementById('depature_area').value;

            vm.user.flightRoute.arrivalLongitude = document.getElementById('arrival_loc_lng_taxi').value;
            vm.user.flightRoute.arrivalLatitude = document.getElementById('arrival_loc_lat_taxi').value;
            vm.user.flightRoute.arrival = document.getElementById('arrival_area').value;

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
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
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