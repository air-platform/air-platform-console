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
        .filter('prdFilter', prdFilter);
    
    /** @ngInject */
    function prdFilter() {
    	return function(input,label) {
            var out = [];
            console.log(input,label);
            if(label == 'none'){
                out = input;
            }else{
                if (input && input != undefined) {
                    for(var i = 0; i < input.length; i ++){
                        if(input[i].category == label){
                            out.push(input[i]);
                        }
                    }
                }

            }
            return out;
        }
    }
})();