/**
 * Created by cqp
 */
(function () {
    'use strict';

    angular
        .module('iot')
        .controller('CustomLandingPointsEditController', CustomLandingPointsEditController)
        .filter('userType',function(i18n) {
            return function(input) {
                var out = '';
                if(input==='admin') {
                    out = i18n.t('profile.ADMIN');
                } else if(input==='tenant') {
                    out = i18n.t('profile.TENANT');
                }
                return out;
            };
        });

    /** @ngInject */
    function CustomLandingPointsEditController($scope, uiCalendarConfig,NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr,$timeout) {
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

        vm.backAction = backAction;
        vm.back = back;
        // vm.addUser = {};
        // vm.addUser.role='tenant';
        vm.subPath = 'custom-landing-points';

        vm.approveColor = {
            'pending':'bg-info',
            'approved':'bg-success',
            'rejected':'bg-warning'
        };

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
        // vm.CategoryType[0]["title"]
        // vm.tourPointArr = [];
        var username = $stateParams.username;
        var type = $stateParams.args.type;
        console.log(username);
        if (username){
            vm.isAdd = false;
            vm.title = i18n.t('profile.EDIT_T_INFO');
        }

        if(type && type==='detail'){
            vm.isDetail = true;
        }

        vm.reqPath =  constdata.api.tenant.jetPath;

        vm.userInfo = StorageService.get('iot.hnair.cloud.information');

        function getData() {

            NetworkService.get(vm.reqPath  + '/'+vm.subPath+'/'+username,null,function (response) {
                vm.point = response.data;

                vm.point.images = vm.point.images.split(',');

                console.log(vm.point.images);
            },function (response) {
                toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status + ' ' + response.statusText);
            });
        }

        getData();
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