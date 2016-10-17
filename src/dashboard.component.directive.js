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
                        // angular.extend(scope, scope.component.scope);
                        // Break data binding :( needs to be fixed
                        scope.scope = scope.component.scope;
                    }

                    if (scope.component.states.default && scope.component.states.default.controller) {
                        scope.component.states.default.controller();

                        // update state 'isSorting' for the component
                        if(scope.component.states.default.refreshStateSorting) {
                            scope.component.states.default.refreshStateSorting(scope.dashboard.isStateSorting);
                        }
                    }

                    scope.openExtended = function(event) {
                        if (!scope.dashboard.isStateSorting) {
                            scope.dashboard.enableExtended();
                            scope.component.isExtended = true;
                            // Execute JS
                            if (scope.component.states.extended && scope.component.states.extended.controller) {
                                scope.component.states.extended.controller();
                            }
                        }
                    };
                    scope.closeExtended = function(event) {
                        if (!scope.dashboard.isStateSorting) {
                            scope.dashboard.isExtended = false;
                            scope.component.isExtended = false;
                            if (scope.component.states.default && scope.component.states.default.controller) {
                                scope.component.states.default.controller();
                            }
                        }
                    };
                    scope.openSettings = function(event) {
                        if (!scope.dashboard.isStateSorting) {
                            scope.component.displaySettings = true;
                            if (scope.component.states.settings && scope.component.states.settings.controller) {
                                scope.component.states.settings.controller();
                            }
                        }
                    };
                    scope.closeSettings = function(event) {
                        if (!scope.dashboard.isStateSorting) {
                            scope.component.displaySettings = false;
                            if (scope.component.states.default && scope.component.states.default.controller) {
                                scope.component.states.default.controller();
                            }
                        }
                    };
                }
            };
        });
})();
