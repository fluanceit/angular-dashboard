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
                templateUrl: 'dashboard.component.directive.html',
                link: function(scope, element, attrs) {

                    scope.params = scope.component.params;
                    if (scope.component.scope) {
                        angular.extend(scope, scope.component.scope);
                    }

                    scope.openExtended = function() {
                        if (!scope.dashboard.isStateSorting) {
                            scope.dashboard.isExtended = true;
                            scope.component.isExtended = true;
                        }
                    };
                    scope.closeExtended = function() {
                        if (!scope.dashboard.isStateSorting) {
                            scope.dashboard.isExtended = false;
                            scope.component.isExtended = false;
                        }
                    };
                    scope.openSettings = function() {
                        if (!scope.dashboard.isStateSorting) {
                            scope.component.displaySettings = true;
                        }
                    };
                    scope.closeSettings = function() {
                        if (!scope.dashboard.isStateSorting) {
                            scope.component.displaySettings = false;
                        }
                    };
                }
            };
        });
})();
