/**
 * Created by Otherplayer on 2016/11/14.
 */

(function() {
	'use strict'

	/**
     * 过滤器:firstUpper
     *
     */
    angular
        .module('iot')
        .filter('firstUpper', firstUpper);
    
    /** @ngInject */
    function firstUpper() {
    	return function(input) {
            var out = '';
            var arr = input.split('');
            var firstLetter = arr[0].toUpperCase();
            arr.splice(0,1);
            out = firstLetter + arr.join('');
            if(out === 'Int') {
                out = 'Integer'
            }
            if(out === 'Enum') {
                out = 'Enumeration'
            }
            return out;
        }
    }
})();