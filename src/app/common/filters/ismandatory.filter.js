/**
 * Created by Otherplayer on 2016/11/14.
 */

(function() {
	'use strict'

	/**
     * 过滤器:isMandatory
     *
     */
    angular
        .module('iot')
        .filter('isMandatory', isMandatory);
    
    /** @ngInject */
    function isMandatory(i18n) {
        return function(input) {
            var out = '';
            if(input == 'mandatory') {
                out = i18n.t('u.MANDATORY');
            }
            if(input == 'optional') {
                out = i18n.t('u.OPTIONAL');
            }
            return out;
        }
    }
})();