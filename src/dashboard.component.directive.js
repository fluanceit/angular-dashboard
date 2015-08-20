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
                    'component': '=',
                    'dashboard': '='
                },
                templateUrl: 'src/dashboard.component.directive.html',
                link: function(scope, element, attrs) {

                    scope.data = scope.component;

                    scope.openSettings = function () {
                        scope.dashboard.isExtended = true;
                        scope.component.isExtended = true;
                    };
                    scope.closeSettings = function () {
                        scope.dashboard.isExtended = false;
                        scope.component.isExtended = false;
                    };
                }
            };
        });

})();
