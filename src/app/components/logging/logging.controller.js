/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('iot').controller('LoggingController', LoggingController);

    /** @ngInject */
    function LoggingController() {
        /* jshint validthis: true */
        var vm = this;
        vm.pages = [true,true,true,true];



        vm.changePage = function (index) {

            for (var i = 0; i < 4 ; i ++){
                if(index >= i){
                    vm.pages[i] = true;
                }else{
                    vm.pages[i] = false;
                }
            }
        }







    }

})();
