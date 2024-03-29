(function () {
    'use strict';

    /*angular.module('iot').directive('fileModel', function () {
        return {
            restrict: "A",
            link: function( scope, element, attrs ){
                var model = $parse( attrs.fileModel );
                var modelSetter = model.assign;

                element.bind( "change", function(){
                    scope.$apply( function(){
                        modelSetter( scope, element[0].files[0] );
                        // console.log( scope );
                    } )
                } )
            }
        }
});*/




    angular.module('iot').directive( "fileModel", [ "$parse", function( $parse ){
        return {
            restrict: "A",
            link: function( scope, element, attrs ){
                var model = $parse( attrs.fileModel );
                var modelSetter = model.assign;

                element.bind( "change", function(){
                    scope.$apply( function(){
                        modelSetter( scope, element[0].files[0] );
                         console.log( element[0].files[0] );

                    } )
                } )
            }
        }
    }])

})();



