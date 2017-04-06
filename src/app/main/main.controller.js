/**
 * app main controller
 */

(function () {
    'use strict';

    angular.module('airs').controller('MainController', MainController);

    /** @ngInject */
    function MainController($timeout,$translate,$location,LoginServer, $state, toastr,$scope) {
       /* jshint validthis: true */
       var vm = this;
        var url = $location.absUrl();

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

      // config
        $scope.app = {
        name: 'air cc',
        version: '0.0.1',
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


      // angular translate
        $scope.lang = { isopen: false };
        $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
        $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
        $scope.setLang = function(langKey, $event) {
        // set the current lang
          $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
            $scope.lang.isopen = !$scope.lang.isopen;
      };

        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.creationDate = 1452231070467;
        vm.showToastr = showToastr;


        function showToastr() {
            toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
            vm.classAnimation = '';
        }

        $state.go('app.agents');

        if (LoginServer.isAuthed()){

            if (url.indexOf('bot') == -1){
                $timeout(function () {
                    if (LoginServer.isAdmin()){
                        $state.go('app.user');
                    }else{
                        $state.go('app.agents');
                    }
                },10);
            }

        }else{
            if (url.indexOf('bot') == -1){
                $timeout(function () {
                    $state.go('access.signin');
                },10);
            }
        }


    }
})();
