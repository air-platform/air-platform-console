/**
 * Created by Otherplayer on 2016/11/8.
 */

(function() {
    'use strict';

    /**
     * 日志:logger
     *
     */
    angular
        .module('iot')
        .factory('logger', logger);

    /** @ngInject */
    function logger(constdata) {

        var mod = {
            log  : 1,
            debug: 2,
            info : 4,
            warn : 8,
            error: 16
        };
        var debugMode = constdata.debugMode;
        var logLevel = parseInt(constdata.logLevel,2);


        var service = {
              log: log,
              err: err,
            error: err,
             warn: warn,
             info: info,
            debug: debug
        };

        return service;


        ///////////////////


        function log (args) {
            if (__showLevel('log')) {
                console.log(args);
            }
        }
        function err(args) {
            if (__showLevel('error')) {
                console.error(args);
            }
        }
        function warn(args) {
            if (__showLevel('warn')) {
                console.warn(args);
            }
        }
        function info(args) {
            if (__showLevel('info')) {
                console.info(args);
            }
        }
        function debug(args) {
            if (__showLevel('debug')) {
                console.log(args);
            }
        }

        function __showLevel(name) {
            var isValid = logLevel & mod[name];
            return debugMode && isValid;
        }

    }

})();