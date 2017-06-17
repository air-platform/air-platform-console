/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('AirtourEditController', AirtourEditController)
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
    function AirtourEditController($scope, uiCalendarConfig,NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        vm.backAction = backAction;
        vm.back = back;
        vm.addUser = {};
        vm.addUser.role='tenant';
        vm.subPath = 'airtours';
        vm.user.clientManagersArr = [];
        vm.defaultPrice = 0;
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


        vm.testItems = [
            {
            price:'10',
            seatPrice:'100',
            currencyUnit:'rmb',
            aircraft:'idddddd'
            },
            {
                price:'12',
                seatPrice:'100',
                currencyUnit:'rmb',
                aircraft:'idddddd'
            },
            {
                price:'13',
                seatPrice:'100',
                currencyUnit:'rmb',
                aircraft:'idddddd'
            }

            ]


        vm.tourPointArr = [];
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
        vm.reqPath2 = constdata.api.tenant.jetPath;
        vm.isAdmin = false;
        vm.userInfo = StorageService.get('iot.hnair.cloud.information');
        if(vm.userInfo.role != 'tenant'){
            vm.reqPath = constdata.api.admin.basePath;
            vm.reqPath2 = constdata.api.tenant.jetPath;
            vm.isAdmin = true;
        }




        var map = new BMap.Map("map-div-tour");          // 创建地图实例
        var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
        var geoc = new BMap.Geocoder();
        map.centerAndZoom(point, 10);
        map.enableScrollWheelZoom(false);     //开启鼠标滚轮缩放

        var finalMarker = null;
        vm.tourInfo = [];//{lng:116.404, lat:39.915, desc:'出发地'};
       // vm.arrivalInfo = {lng:117.204282,lat:39.134923, desc:'目的地'};
        function deletePoint(desc){
            var allOverlay = map.getOverlays();
             for (var i = 0; i < allOverlay.length; i++){
                console.log(desc);
                 if (allOverlay[i].toString() == "[object Marker]") {
                     if (allOverlay[i] && allOverlay[i].getLabel() && allOverlay[i].getLabel().content == desc) {
                         map.removeOverlay(allOverlay[i]);
                         console.log('ok');
                         return false;
                     }
                 }
             }
            //map.clearOverlays();
        }
        /*function showInfo(e){
            alert(e.point.lng + ", " + e.point.lat);
        }*/
        vm.curve = null;
        function createNewCurveLine()
        {


            if(vm.curve != null){
                map.removeOverlay(vm.curve);
            }
            //var beijingPosition=new BMap.Point(vm.departureInfo.lng, vm.departureInfo.lat);
            //var   hangzhouPosition=new BMap.Point(vm.arrivalInfo.lng, vm.arrivalInfo.lat);
            var points = [];
            if(vm.tourInfo.length > 1){
                for(var i = 0; i < vm.tourInfo.length; i ++){
                    var p = new BMap.Point(vm.tourInfo[i].lng, vm.tourInfo[i].lat);
                    points.push(p);
                }
                vm.curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
                map.addOverlay(vm.curve); //添加到地图中
                vm.curve.disableEditing(); //开启编辑功能
            }


        }



        function createNewMarker(info){
            var pt = info.point;
            // deletePoint();

            var desc = '';
            if(info.desc){
                desc = info.desc;
            }
           // var ll = pt.lng+","+pt.lat;

                //vm.arrivalInfo.lng = pt.lng;
                //vm.arrivalInfo.lat = pt.lat;
                //document.getElementById('arrival_loc').value = ll;
               // vm.tourInfo.push({lng:pt.lng, lat:pt.lat, desc:'d'});
                //console.log(vm.tourInfo);

            //createNewCurveLine();


            //console.log(ll+':'+desc);

            /*geoc.getLocation(pt, function(rs){
                var addComp = rs.addressComponents;
                console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                if(desc == '出发地'){
                    document.getElementById('depature_area').value = addComp.city;
                }else if(desc == '目的地'){
                    document.getElementById('arrival_area').value = addComp.city;
                }
            });*/


            var label = new BMap.Label(desc,{ position : pt, offset:new BMap.Size(20,-10)});
            label.setStyle({
                color : "red",
                fontSize : "16px",
                height : "20px",
                fontFamily:"微软雅黑",
                border :"0"
            });


           /* var removeMarker = function(e,ee,marker){
                map.removeOverlay(marker);
            }

            var markerMenu=new BMap.ContextMenu();
            markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));*/


            var marker = new BMap.Marker(pt);




            map.addOverlay(marker);
            //marker.addContextMenu(markerMenu);
            marker.setLabel(label);
            marker.enableDragging();








            marker.addEventListener("dragend",function(e){
                var ll = e.point.lng+","+e.point.lat;
                console.log(ll);
                console.log(info.index);
                vm.tourPointArr[info.index].loc = ll;
                console.log(vm.tourPointArr);
                document.getElementById('tour-loc-'+info.index).value = ll;
                /*console.log(e.target.getLabel().content);
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
                    var addComp = rs.addressComponents;
                    console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                    if(e.target.getLabel().content == '出发地') {
                        document.getElementById('depature_area').value = addComp.city;
                    }else if(e.target.getLabel().content == '目的地') {
                        document.getElementById('arrival_area').value = addComp.city;
                    }
                });*/


            });
            finalMarker = marker;
        }





        //map.addEventListener("click", createNewMarker);






      /*



        vm.initMap = function()
        {
            map.clearOverlays();
            var dep = new BMap.Point(vm.departureInfo.lng, vm.departureInfo.lat);
            createNewMarker(dep,vm.departureInfo.desc);
            createNewMarker(new BMap.Point(vm.arrivalInfo.lng, vm.arrivalInfo.lat),vm.arrivalInfo.desc);
            map.centerAndZoom(dep, 8);
            // createNewCurveLine();
        }


*/



















        function getAircraftsDatas() {


            NetworkService.get(vm.reqPath  + '/aircrafts',{page:vm.pageCurrent},function (response) {
                vm.crafts = response.data.content;

            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
            });
        }

        vm.uploadFile = function (){
            vm.showSpinner = true;
            console.log(vm.myUploadFile);
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                vm.showSpinner = false;
                toastr.success(i18n.t('u.OPERATE_SUC'));

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



        vm.togglePriceCalendar = function(item)
        {


            item.showPriceCalendar = !item.showPriceCalendar;
            if(item.showPriceCalendar){
                item.priceButtonTitle = '收起';
            }else{
                item.priceButtonTitle = '详情';
            }

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



        vm.addNewTourPoint = function() {


            var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
            var e = {};
            e.point = point;
            e.desc = '坐标'+(vm.tourPointArr.length+1);
            e.index = vm.tourPointArr.length;
            createNewMarker(e);
            vm.tourPointArr.push({
                name:'景点'+(vm.tourPointArr.length+1),
                loc:point.lng+','+point.lat,
                locName:e.desc
            });

        }


        vm.removeTourPoint = function(item) {
            var index = vm.tourPointArr.indexOf(item);
            vm.tourPointArr.splice(index, 1);
            deletePoint('坐标'+(index+1));
        }


        getAircraftsDatas();


        function getTenantItem() {

            var myid = vm.userInfo.id;
            console.log(myid);
            console.log(username);
            NetworkService.get(vm.reqPath  +'/' + vm.subPath + '/'+ username,null,function (response) {
                vm.user = response.data;
                vm.user.aircraftItemsAdd = [];
                vm.user.clientManagersArr = [];


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




                if(vm.user.salesPackages && vm.user.salesPackages.length > 0){
                    for (var i = 0; i < vm.user.salesPackages.length; i ++){
                        vm.user.salesPackages[i].aircraftId = vm.user.salesPackages[i].aircraft.id;
                        vm.user.salesPackages[i].showPriceCalendar = false;
                        vm.user.salesPackages[i].priceButtonTitle = '详情';



                    }
                }

                if(vm.user.tourPoint && vm.user.tourPoint.length > 0){
                    console.log(vm.user.tourPoint);
                    if(vm.user.tourPoint.charAt(vm.user.tourPoint.length-1) == ';'){
                        vm.user.tourPoint = vm.user.tourPoint.substr(0, vm.user.tourPoint.length-1);
                    }
                    var tourArr  = vm.user.tourPoint.split(';');
                    var allPts = [];
                    for(var i = 0; i < tourArr.length; i ++){
                        var detailArr = tourArr[i].split(',');
                        if(detailArr.length > 0){
                            var name = detailArr[0];
                            var loc = detailArr[1]+','+detailArr[2];









                            var point = new BMap.Point(parseFloat(detailArr[1]), parseFloat(detailArr[2]));  // 创建点坐标
                            allPts.push(point);

                            var e = {};
                            e.point = point;
                            e.desc = '坐标'+(vm.tourPointArr.length+1);
                            e.index = vm.tourPointArr.length;
                            createNewMarker(e);
                            vm.tourPointArr.push({
                                name:name,
                                loc:loc,
                                locName:e.desc
                            });
                            //map.centerAndZoom(point, 8);



                        }


                    }
                    if(allPts.length > 0){
                        var vp = map.getViewport(allPts);
                        map.centerAndZoom(vp.center, vp.zoom);
                    }








                }



                $rootScope.userNamePlacedTop = vm.user.nickName;
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.GET_DATA_FAILED'));
            });
        }


        function addItem() {
            var myid = vm.userInfo.id;
            vm.user.tourShow = getMarkDownAction().markdown;
            console.log(vm.user.tourShow);

            if(vm.user.salesPackages && vm.user.salesPackages.length > 0) {
                for (var i = 0; i < vm.user.salesPackages.length; i++) {
                    var tmp = vm.user.salesPackages[i].aircraftId;
                    vm.user.salesPackages[i].aircraft = tmp;
                    vm.user.salesPackages[i].passengers = parseInt(vm.user.salesPackages[i].passengers);
                    vm.user.salesPackages[i].presalesDays = parseInt(vm.user.salesPackages[i].presalesDays);

                }
            }
            vm.user.tourDistance = parseInt(vm.user.tourDistance);
            vm.user.tourTime = parseInt(vm.user.tourTime);


            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);

            if(vm.tourPointArr.length > 0){
                vm.user.tourPoint  = '';
                for(var i = 0; i < vm.tourPointArr.length; i ++){
                    vm.user.tourPoint += vm.tourPointArr[i].name+','+ vm.tourPointArr[i].loc+';'
                }
                vm.user.tourPoint = vm.user.tourPoint.substr(0, vm.user.tourPoint.length-1);
            }





            NetworkService.post(vm.reqPath   + '/' + vm.subPath,vm.user,function (response) {
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
            vm.user.tourShow = getMarkDownAction().markdown;


            if(vm.user.salesPackages && vm.user.salesPackages.length > 0) {
                for (var i = 0; i < vm.user.salesPackages.length; i++) {
                    var tmp = vm.user.salesPackages[i].aircraftId;
                    vm.user.salesPackages[i].aircraft = tmp;
                    vm.user.salesPackages[i].passengers = parseInt(vm.user.salesPackages[i].passengers);
                    vm.user.salesPackages[i].presalesDays = parseInt(vm.user.salesPackages[i].presalesDays);

                }
            }
            vm.user.tourDistance = parseInt(vm.user.tourDistance);
            vm.user.tourTime = parseInt(vm.user.tourTime);


            vm.user.clientManagers = '';//JSON.stringify(vm.user.clientManagersArr);
            if(vm.user.clientManagersArr && vm.user.clientManagersArr.length > 0) {
                vm.user.clientManagers  = vm.user.clientManagersArr[0].name + ':'+vm.user.clientManagersArr[0].email;
                for (var i = 1; i < vm.user.clientManagersArr.length; i ++) {
                    vm.user.clientManagers  += ',' + vm.user.clientManagersArr[i].name + ':'+vm.user.clientManagersArr[i].email;
                }
            }
            console.log(vm.user.clientManagers);

            console.log(vm.user.aircraftItems);

            if(vm.tourPointArr){
                vm.user.tourPoint  = '';
                for(var i = 0; i < vm.tourPointArr.length; i ++){
                    vm.user.tourPoint += vm.tourPointArr[i].name+','+ vm.tourPointArr[i].loc+';'
                }
                vm.user.tourPoint = vm.user.tourPoint.substr(0, vm.user.tourPoint.length-1);
            }
            NetworkService.put(vm.reqPath   + '/' + vm.subPath + '/'+ username,vm.user,function (response) {
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



        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }


        vm.userInfo = StorageService.get('iot.hnair.cloud.information');

        if (!vm.isAdd){
            vm.getTenantItem();


        }else{
            vm.user.currencyUnit = 'rmb';

            vm.user.aircraftItemsAdd = [];
            vm.user.salesPackages = [];
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