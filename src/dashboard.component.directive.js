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

                    scope.openExtended = function () {
                        scope.dashboard.isExtended = true;
                        scope.component.isExtended = true;
                    };
                    scope.closeExtended = function () {
                        scope.dashboard.isExtended = false;
                        scope.component.isExtended = false;
                    };
                    scope.openSettings = function () {
                        scope.component.displaySettings = true;
                    };
                    scope.closeSettings = function () {
                        scope.component.displaySettings = false;
                    };
                }
            };
        });

})();
