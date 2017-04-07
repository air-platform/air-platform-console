/**
 *
 * Run blocks - get executed after the injector is created and are used to kickstart the application.
 * Only instances and constants can be injected into run blocks. This is to prevent further
 * system configuration during application run time.
 *
 */

(function () {

    // 'use strict';

    angular.module('airs').run(runBlock);

    /** @ngInject */
    function runBlock($log) {
        $log.debug('Hold on, Air Start Fly.');
    }


})();
