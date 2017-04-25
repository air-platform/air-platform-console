/**
 * app main controller
 */

(function () {
    'use strict';

    angular.module('iot').controller('MainController', MainController);

    /** @ngInject */
    function MainController($rootScope, NetworkService, $timeout,$translate,$state,StorageService, webDevTec, toastr) {
       /* jshint validthis: true */
       var vm = this;

       var theme_1 = {
          themeID: 1,
          navbarHeaderColor: 'bg-info',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }

       var theme_11 = {
          themeID: 11,
          navbarHeaderColor: 'bg-info',
          navbarCollapseColor: 'bg-white',
          asideColor: 'bg-dark b-r',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
      };
        // var theme_14 = {
        //     themeID: 11,
        //     navbarHeaderColor: 'bg-danger',
        //     navbarCollapseColor: 'bg-danger',
        //     asideColor: 'bg-white b-r',
        //     headerFixed: true,
        //     asideFixed: false,
        //     asideFolded: false,
        //     asideDock: false,
        //     container: false
        // };

      // config
      vm.app = {
        name: 'IoT Platform',
        version: '2.0.1',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: theme_11
      };




      /*
         // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        vm.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = vm.app.settings;
      }

      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);
      */

      // angular translate
      vm.lang = { isopen: false };
      vm.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      vm.selectLang = vm.langs[$translate.proposedLanguage()] || "English";
      vm.setLang = function(langKey, $event) {
        // set the current lang
        vm.selectLang = vm.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        vm.lang.isopen = !vm.lang.isopen;
      };



      /////

        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.creationDate = 1452231070467;
        vm.showToastr = showToastr;



      //  activate();

        function activate() {
            getWebDevTec();
            $timeout(function () {
                vm.classAnimation = 'rubberBand';
            }, 4000);
        }

        function showToastr() {
            toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
            vm.classAnimation = '';
        }

        function getWebDevTec() {
            vm.awesomeThings = webDevTec.getTec();

            angular.forEach(vm.awesomeThings, function (awesomeThing) {
                awesomeThing.rank = Math.random();
            });
        }

        vm.checkToken = function() {
            var info = StorageService.get('iot.hnair.cloud.information');
            var token = StorageService.get('iot.hnair.cloud.access_token');
            if (token && info){
                $timeout(function () {
                    $state.go('app.dashboard');
                },10);
            }else{
                $timeout(function () {
                    $state.go('access.signin');
                },10);
            }
        }

        //快速导航条相关



        function getUserRole() {
            // "ADMIN"; "TENANT"; "USER";
            var infos = StorageService.get('iot.hnair.cloud.information');
            
            if (infos && infos.type.toUpperCase() == 'ADMIN'){
                // console.log('出来吧孙猴子');
                vm.isNavShow = false;
            } else {
              vm.isNavShow = false;
            }
        }
        //getUserRole();
        vm.pageRoutes = $rootScope.pageRoutes;
        vm.goSeperateState = function(index,item) {
            if(index == 1){
                $state.go('app.tenant');
            }else {
                $state.go('app.orderairbook');
            }
        }
        // vm.clearItems = function() {
        //   $rootScope.pageRoutes = [];
        // }
    }
})();
