
/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('polly').controller('SignupController', SignupController);

    /** @ngInject */
    function SignupController($state) {
        /* jshint validthis: true */
        var vm = this;
        
        vm.goSignin = goSignin;
        
        function goSignin() {
            $state.go('access.signin');
        }

    }

})();