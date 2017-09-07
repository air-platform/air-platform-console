/**
 * Created by cqp
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('VenueCategoryEditController', VenueCategoryEditController)
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
    function VenueCategoryEditController($scope, uiCalendarConfig,NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr,$timeout) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.categories = {};
        // vm.categories.venueInfo = "asdfasdfasdfsfdsdf";
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
        // vm.getTenantItem = getTenantItem;
        vm.submitAction = submitAction;
        vm.backAction = backAction;
        vm.back = back;
        // vm.addUser = {};
        // vm.addUser.role='tenant';
        vm.subPath = 'venue-categories';
        vm.venueCategoryProductsArr = [];
        // vm.defaultPrice = 0;

        vm.CategoryType = [
            {
                title:'Air Jet',
                value:'air_jet'
            },
            // {
            //     title:'Air Taxi',
            //     value:'air_taxi'
            // },
            {
                title:'Air Trans',
                value:'air_trans'
            },
            {
                title:'Air Tour',
                value:'air_tour'
            },
            {
                title:'Air Train',
                value:'air_training'
            }
        ];
        // vm.CategoryType[0]["title"]
        // vm.tourPointArr = [];
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

        vm.reqPath =  constdata.api.tenant.jetPath;

        vm.userInfo = StorageService.get('iot.hnair.cloud.information');

        function getCategoryDatas() {

            console.log(username);
            NetworkService.get(vm.reqPath  + '/'+vm.subPath+'/'+username,null,function (response) {
                vm.categories = response.data;
                // vm.venueCategoryProductsArr = vm.categories.venueCategoryProducts;
                // console.log(vm.categories);
                vm.categories.venueInfo = vm.categories.venueInfo.id;

                if(vm.categories.venueCategoryProducts.length>0){

                        vm.categories.venueCategoryProducts.forEach(function (val,index,arr){
                            vm.venueCategoryProductsArr.push({
                                product:val.product,
                                type:val.type
                            });

                        });
                        console.log(vm.venueCategoryProductsArr)

                }
                // console.log(vm.categories.venueInfo);
                // console.log(vm.venueCategoryProductsArr);


            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }

        if(!vm.isAdd){
            getCategoryDatas();
        }

        vm.uploadFile = function (){
            vm.showSpinner = true;
            console.log(vm.myUploadFile);
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                vm.showSpinner = false;
                toastr.success(i18n.t('u.OPERATE_SUC'));

                console.log(response.data);
                vm.categories.picture = response.data.url;
                //vm.backAction();
            },function (response) {
                vm.showSpinner = false;
                vm.authError = response.statusText + '(' + response.status + ')';
                console.log(vm.authError);
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });

            //$rootScope.backPre();
        }


        vm.addNewCategoryProduct = function() {

            vm.venueCategoryProductsArr.push({
                product:'',
                type:''
            })
        }

        vm.removeCategoryProduct = function(item) {
            var index = vm.venueCategoryProductsArr.indexOf(item);
            vm.venueCategoryProductsArr.splice(index, 1);
        }


        function getVenueInfoDatas() {

            NetworkService.get(constdata.api.tenant.jetPath + '/venue-infos',{page:vm.pageCurrent},function (response) {
                vm.infos = response.data.content;
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }

        // if(vm.isAdmin) {
        getVenueInfoDatas();

        // }

        function getProductsDatas() {


            NetworkService.get(constdata.api.admin.platPath  + '/product/summaries',{page:vm.pageCurrent,pageSize:200},function (response) {
                vm.allProduct = response.data;
                console.log(vm.allProduct);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });

        }
        getProductsDatas();


        function addItem() {
            var myid = vm.userInfo.id;

            vm.categories.venueCategoryProducts = vm.venueCategoryProductsArr;
            // console.log(vm.venueCategoryProductsArr);
            // console.log(vm.categories.name);
            //
            // console.log(vm.categories.description);
            console.log(vm.categories);

            var refReq = vm.reqPath  + '/' + vm.subPath;

            NetworkService.post(refReq,vm.categories,function (response) {
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

            NetworkService.put(vm.reqPath   + '/' + vm.subPath + '/'+ username,vm.categories,function (response) {
                toastr.success(i18n.t('u.OPERATE_SUC'));
                vm.backAction();
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
            });
        }
        function submitAction() {
            if (vm.isAdd){
                addItem();
            }else if(vm.isEdit){
                editItem();
            }
        }



        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }

        vm.userInfo = StorageService.get('iot.hnair.cloud.information');


        function back() {
            // history.back();
            vm.backAction();
        }


    }

})();