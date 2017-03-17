(function () {
    'use strict';


    angular.module('iot.ui.directives').directive('iotToggleClass', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    element.toggleClass(attrs.toggleClass);
                });
            }
        };
    })
    ;

    // https://gist.github.com/mrosati84/6791964
    // <button id="btn" toggle-class="active">Change Class</button>
    // <div toggle-class="whatever"></div>



})();
