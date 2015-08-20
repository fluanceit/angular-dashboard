/**
 * Mycockpit Directive
 */
(function() {
    'use strict';

    angular
        .module('dashboard')
        .directive('displayComponent', function() {
            return {
                restrict: 'E',
                scope: {
                    'component': '='
                },
                templateUrl: 'src/dashboard.component.directive.html',
                link: function(scope, element, attrs) {

                    scope.data = scope.component;

                    scope.openSettings = function () {
                        alert('Open Settings ' + scope.component.id);
                    };
                }
            };
        });

})();
