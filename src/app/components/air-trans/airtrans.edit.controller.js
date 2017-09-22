/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('AirtransEditController', AirtransEditController)
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
    function AirtransEditController($scope, NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr,$timeout) {
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
        vm.defaultPrice = 0;
        vm.addUser.role='tenant';
        vm.subPath = 'airtransports';
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
        vm.pubStatus = [
            {
                title:'已上线',
                value: true
            },
            {
                title:'已下线',
                value: false
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
        var username = $stateParams.username;
        var type = $stateParams.args.type;
        console.log(type);

        vm.approveStatus=[{
            value:'pending',
            title:'未审批'
        },{
            value:'approved',
            title:'审批通过'
        },{
            value:'rejected',
            title:'审批拒绝'
        }];
        vm.reqPath =  constdata.api.tenant.fleetPath;
        vm.reqPath2 = constdata.api.productFamily.basePath;
        vm.reqPath3 = constdata.api.tenant.fleetPath;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.basePath;
            vm.reqPath2 = constdata.api.productFamily.adminPath;
            vm.reqPath3 = constdata.api.admin.platPath;
            vm.isAdmin = true;
        }




        var map = new BMap.Map("map-div-trans",{minZoom:8,maxZoom:8});          // 创建地图实例
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
                $timeout(function () {
                    vm.user.flightRoute.departureLongitude = vm.departureInfo.lng;
                    vm.user.flightRoute.departureLatitude = vm.departureInfo.lat;

                    vm.user.flightRoute.departureLongitudeFlag = true;
                    vm.user.flightRoute.departureLatitudeFlag = true;

                });
                console.log(ll+':'+desc);
            }else if(desc == '目的地'){
                vm.arrivalInfo.lng = pt.lng;
                vm.arrivalInfo.lat = pt.lat;
                $timeout(function () {
                    vm.user.flightRoute.arrivalLongitude = vm.arrivalInfo.lng;
                    vm.user.flightRoute.arrivalLatitude = vm.arrivalInfo.lat;
                    vm.user.flightRoute.arrivalLongitudeFlag = true;
                    vm.user.flightRoute.arrivalLatitudeFlag = true;
                });
                console.log(ll+':'+desc);
            }
            createNewCurveLine();
            console.log(ll+':'+desc);

            geoc.getLocation(pt, function(rs){
                if(vm.isAdd) {
                    var addComp = rs.addressComponents;
                    console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                    if (desc == '出发地') {
                        $timeout(function () {
                            vm.user.flightRoute.departure = addComp.city;
                        });
                    } else if (desc == '目的地') {
                        $timeout(function () {
                            vm.user.flightRoute.arrival = addComp.city;
                        });
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
                    //document.getElementById('depature_loc').value = ll;
                    $timeout(function () {
                        vm.user.flightRoute.departureLongitude = vm.departureInfo.lng;
                        vm.user.flightRoute.departureLatitude = vm.departureInfo.lat;
                    });
                }else if(e.target.getLabel().content == '目的地'){
                    vm.arrivalInfo.lng = e.point.lng;
                    vm.arrivalInfo.lat = e.point.lat;
                    //document.getElementById('arrival_loc').value = ll;
                    $timeout(function () {
                        vm.user.flightRoute.arrivalLongitude = vm.arrivalInfo.lng;
                        vm.user.flightRoute.arrivalLatitude = vm.arrivalInfo.lat;
                    });
                }
                createNewCurveLine();
                geoc.getLocation(e.point, function(rs){
                    if(vm.isAdd) {
                        var addComp = rs.addressComponents;
                        console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                        if (e.target.getLabel().content == '出发地') {
                            $timeout(function () {
                                vm.user.flightRoute.departure = addComp.city;
                            });
                        } else if (e.target.getLabel().content == '目的地') {
                            $timeout(function () {
                                vm.user.flightRoute.arrival = addComp.city;
                            });
                        }
                    }
                });


            });
            finalMarker = marker;
        }


       /* vm.initMap = function()
        {
            map.clearOverlays();
            var dep = new BMap.Point(vm.departureInfo.lng, vm.departureInfo.lat);
            createNewMarker(dep,vm.departureInfo.desc);
            createNewMarker(new BMap.Point(vm.arrivalInfo.lng, vm.arrivalInfo.lat),vm.arrivalInfo.desc);
            map.centerAndZoom(dep, 8);
            // createNewCurveLine();
        }
*/

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
        }









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


        if(type && type=='copy'){
            vm.isCopy = true;
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


        vm.addNewCraftItem = function() {
            var pp = [];
            for(var i = 0; i < 30; i ++){
                pp.push(vm.defaultPrice);
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


        vm.removeCraftItem = function(item) {
            var index = vm.user.salesPackages.indexOf(item);
            vm.user.salesPackages.splice(index, 1);
        }


        function getAircraftsDatas() {


            NetworkService.get(vm.reqPath3  + '/aircrafts',{page:vm.pageCurrent, pageSize:100},function (response) {
                vm.crafts = response.data.content;
                for(var i = 0; i < vm.crafts.length; i ++){
                    vm.crafts[i].selTitle = vm.crafts[i].name + ' ' + vm.crafts[i].flightNo + ' ' +  vm.crafts[i].type;
                }

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }
        getAircraftsDatas();

        function getTenantDatas() {

            NetworkService.get(constdata.api.tenant.listAllPath + '/' + '?type=tenant',{page:vm.pageCurrent},function (response) {
                vm.tenants = response.data.content;
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }
        vm.selTenant = ''
        if(vm.isAdmin) {
            getTenantDatas();

        }

        vm.productfamily = [];


        function getProductFamiliyDatas() {
            NetworkService.get(vm.reqPath2+'?status=approved&category=air_trans',{page:vm.pageCurrent},function (response) {
                vm.productfamily = response.data.content;

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }
        getProductFamiliyDatas();




        function getTenantItem() {

            var myid = vm.userInfo.id;
            console.log(myid);
            console.log(username);
            NetworkService.get(vm.reqPath  + '/' + vm.subPath + '/'+ username,null,function (response) {
                vm.user = response.data;
                console.log(vm.user);
                vm.user.clientManagersArr = [];
                vm.user.aircraftItemsAdd = [];
                if(vm.isAdmin){
                    vm.selTenant = vm.user.vendor.id;
                }
                if(vm.user.salesPackages && vm.user.salesPackages.length > 0){
                    for (var i = 0; i < vm.user.salesPackages.length; i ++){
                        vm.user.salesPackages[i].aircraftId = vm.user.salesPackages[i].aircraft.id;
                        vm.user.salesPackages[i].showPriceCalendar = false;
                        vm.user.salesPackages[i].priceButtonTitle = '详情';



                    }
                }

                if(vm.user.family){
                    vm.user.productfamilyId = vm.user.family.id;
                }

                if(vm.user.aircraftItems && vm.user.aircraftItems.length > 0){
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


                if(vm.user.flightRoute){

                        vm.departureInfo.lng = parseFloat(vm.user.flightRoute.departureLongitude);
                        vm.departureInfo.lat = parseFloat(vm.user.flightRoute.departureLatitude);


                        vm.arrivalInfo.lng = parseFloat(vm.user.flightRoute.arrivalLongitude);
                        vm.arrivalInfo.lat = parseFloat(vm.user.flightRoute.arrivalLatitude);



                    vm.user.flightRoute.departureLongitudeFlag = true;
                    vm.user.flightRoute.departureLatitudeFlag = true;


                    vm.user.flightRoute.arrivalLongitudeFlag = true;
                    vm.user.flightRoute.arrivalLatitudeFlag = true;

                }

                vm.initMap();


                $rootScope.userNamePlacedTop = vm.user.nickName;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED')+vm.authError);
            });
        }


        vm.uploadFile = function (){
            console.log(vm.myUploadFile);
            vm.showSpinner = true;
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.showSpinner = false;
                console.log(response.data);
                vm.user.image = response.data.url;
                //vm.backAction();
            },function (response) {
                vm.showSpinner = false;
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }

        function addItem() {
            var myid = vm.userInfo.id;


            /*vm.user.flightRoute.departureLongitude = document.getElementById('depature_loc_lng_trans').value;
            vm.user.flightRoute.departureLatitude = document.getElementById('depature_loc_lat_trans').value;
            vm.user.flightRoute.departure = document.getElementById('depature_area_trans').value;

            vm.user.flightRoute.arrivalLongitude = document.getElementById('arrival_loc_lng_trans').value;
            vm.user.flightRoute.arrivalLatitude = document.getElementById('arrival_loc_lat_trans').value;
            vm.user.flightRoute.arrival = document.getElementById('arrival_area_trans').value;
*/


            if(vm.user.salesPackages && vm.user.salesPackages.length > 0) {
                for (var i = 0; i < vm.user.salesPackages.length; i++) {
                    var tmp = vm.user.salesPackages[i].aircraftId;
                    vm.user.salesPackages[i].aircraft = tmp;
                    vm.user.salesPackages[i].passengers = parseInt(vm.user.salesPackages[i].passengers);
                    vm.user.salesPackages[i].presalesDays = parseInt(vm.user.salesPackages[i].presalesDays);

                }
            }
            vm.user.timeEstimation = parseInt(vm.user.timeEstimation);

            for(var i = 0; i < vm.productfamily.length; i ++){
                if(vm.productfamily[i].id == vm.user.productfamilyId){
                    vm.user.family = vm.productfamily[i];
                    break;
                }
            }
            //vm.user.family = vm.user.productfamilyId;// = vm.user.family.id;
            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }

            console.log(vm.user.clientManagers);

           // vm.user.salesPackages[0].passengers = parseInt(vm.user.salesPackages[0].passengers);
            //vm.user.salesPackages[0].presalesDays = parseInt(vm.user.salesPackages[0].presalesDays);
            //vm.user.timeEstimation = parseInt(vm.user.timeEstimation)
            var refReq = vm.reqPath  + '/' + vm.subPath;
            if(vm.isAdmin){
                refReq += '?tenant='+vm.selTenant;
            }
            NetworkService.post(refReq,vm.user,function (response) {
           // NetworkService.post(vm.reqPath  + '/' + vm.subPath,vm.user,function (response) {
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

           /* vm.user.flightRoute.departureLongitude = document.getElementById('depature_loc_lng_trans').value;
            vm.user.flightRoute.departureLatitude = document.getElementById('depature_loc_lat_trans').value;
            vm.user.flightRoute.departure = document.getElementById('depature_area_trans').value;

            vm.user.flightRoute.arrivalLongitude = document.getElementById('arrival_loc_lng_trans').value;
            vm.user.flightRoute.arrivalLatitude = document.getElementById('arrival_loc_lat_trans').value;
            vm.user.flightRoute.arrival = document.getElementById('arrival_area_trans').value;
*/


            if(vm.user.salesPackages && vm.user.salesPackages.length > 0) {
                for (var i = 0; i < vm.user.salesPackages.length; i++) {
                    var tmp = vm.user.salesPackages[i].aircraftId;
                    vm.user.salesPackages[i].aircraft = tmp;
                     vm.user.salesPackages[i].passengers = parseInt(vm.user.salesPackages[i].passengers);
                    vm.user.salesPackages[i].presalesDays = parseInt(vm.user.salesPackages[i].presalesDays);

                }
            }
            vm.user.timeEstimation = parseInt(vm.user.timeEstimation);

           // vm.user.family = vm.user.productfamilyId;
            for(var i = 0; i < vm.productfamily.length; i ++){
                if(vm.productfamily[i].id == vm.user.productfamilyId){
                    vm.user.family = vm.productfamily[i];
                    break;
                }
            }

            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr && vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            // console.log(vm.user);

            NetworkService.put(vm.reqPath + '/' + vm.subPath + '/'+ username,vm.user,function (response) {
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
            }else if(vm.isEdit){
                editItem();
            }else if(vm.isCopy){
                addItem();
            }
        }


        vm.togglePriceCalendar = function(item)
        {


            item.showPriceCalendar = !item.showPriceCalendar;
            if(item.showPriceCalendar){
                item.priceButtonTitle = '收起';
            }else{
                item.priceButtonTitle = '详情';
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
        }else{
            vm.user.currencyUnit = 'rmb';
            vm.user.flightRoute = {};
            vm.user.aircraftItems = [];
            vm.user.aircraftItemsAdd = [];
            vm.user.salesPackages = [];
            vm.initMap();

            /*vm.user.flightRoute.departureLongitude = document.getElementById('depature_loc_lng_trans').value;
            vm.user.flightRoute.departureLatitude = document.getElementById('depature_loc_lat_trans').value;
            vm.user.flightRoute.departure = document.getElementById('depature_area_trans').value;

            vm.user.flightRoute.arrivalLongitude = document.getElementById('arrival_loc_lng_trans').value;
            vm.user.flightRoute.arrivalLatitude = document.getElementById('arrival_loc_lat_trans').value;
            vm.user.flightRoute.arrival = document.getElementById('arrival_area_trans').value;*/
            console.log(vm.user.flightRoute.arrivalLatitude);


        }

        function back() {
            // history.back();
            vm.backAction();
        }





    }

})();