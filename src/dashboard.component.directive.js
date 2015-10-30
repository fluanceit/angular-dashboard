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

                    scope.openExtended = function() {
                        if (scope.dashboard.sortableDisabled) {
                            scope.dashboard.isExtended = true;
                            scope.component.isExtended = true;
                        }
                    };
                    scope.closeExtended = function() {
                        if (scope.dashboard.sortableDisabled) {
                            scope.dashboard.isExtended = false;
                            scope.component.isExtended = false;
                        }
                    };
                    scope.openSettings = function() {
                        if (scope.dashboard.sortableDisabled) {
                            scope.component.displaySettings = true;
                        }
                    };
                    scope.closeSettings = function() {
                        if (scope.dashboard.sortableDisabled) {
                            scope.component.displaySettings = false;
                        }
                    };
                }
            };
        });

})();
