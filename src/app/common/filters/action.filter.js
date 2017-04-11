/**
 * Created by Otherplayer on 2016/11/14.
 */

(function() {
	'use strict'

	/**
     * 过滤器:action
     *
     */
    angular
        .module('iot')
        .filter('action', action);
    
    /** @ngInject */
    function action(i18n) {
        return function(input) {
            var out = '';
            if(input == 'source') {
                out = i18n.t('u.SEND');
            } else if(input == 'sink') {
                out = i18n.t('u.REC');
            }else{
                out = i18n.t('u.BOTH');
            }
            return out;
        }
    }
})();