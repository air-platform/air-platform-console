/**
 * Created by Otherplayer on 2016/11/16.
 */

(function() {
	'use strict'

	/**
     * 过滤器:checkWay --验证方式
     *
     */
    angular
        .module('iot')
        .filter('checkWay', checkWay);
    
    /** @ngInject */
    function checkWay(i18n) {
        return function(input) {
            var out = '';
            if(input == 'trustful') {
                out = i18n.t('application.TRUSTFUL');
            } else if (input == 'rest') {
                out = i18n.t('application.REST');
            }
            return out;
        }
    }
})();