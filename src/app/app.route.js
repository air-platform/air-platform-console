(function () {
    'use strict';

    /** @ngInject */
    angular
        .module('airs')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {

        // $locationProvider.html5Mode(true);
        $urlRouterProvider
            .otherwise('agents');
        $stateProvider

            /** LOGIN **/
            .state('access', {
                url: '/access',
                templateUrl: 'signin.html',
                controller: 'SigninController',
                controllerAs: 'vm'
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: 'app/components/signin/signin.html'
            })
            .state('access.signup',{
                url: '/signup',
                templateUrl: 'app/components/signin/signup.html'
            })


            /** ACCOUNT **/

            /** AGENTS **/
            .state('app.agents', {
                url: 'agents',
                templateUrl: 'app/components/user/user.html'
            })
            .state('app.agent', {
                url: 'agentuser',
                templateUrl: 'app/components/user/user.html',
                params:{args:{}}
            })

            .state('app', {
                //abstract: true,
                url: '/',
                controller: 'MainController',
                controllerAs: 'main',
                templateUrl: 'app/main/main.html'
            })

        ;
    }

})();
