/**
 * Created by Otherplayer on 2016/11/16.
 */

(function() {
	'use strict';

    /**
     * 删除弹出框tip: delmodaltip
     *
     */
    angular
        .module('iot')
        .factory('delmodaltip', delmodaltip);

    /** @ngInject */
    function delmodaltip(i18n) {
    	var tip = {
    		title: i18n.t('u.DELETE'),
    		content: i18n.t('u.DELETE_CONFIRM')
    	}

    	return tip;
    }
})();