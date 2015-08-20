/**
 * Mycockpit Directive
 */
(function() {
    'use strict';

    angular
        .module('dashboard')
        .directive('dashboard', ['dashboardFactory', function(dashboardFactory) {
            return {
                restrict: 'E',
                scope: {
                    'id': '@'
                },
                templateUrl: 'src/dashboard.template.html',
                link: function(scope, element, attrs) {
                    var dashboard = dashboardFactory.get(scope.id);
                    scope.columns = dashboard.columns;
                }
            };
        }])
        .directive('displayComponent', function() {
            return {
                restrict: 'E',
                scope: {
                    'component': '='
                },
                templateUrl: 'src/dashboard.directive.html',
                link: function(scope, element, attrs) {

                    scope.data = scope.component;

                    scope.openSettings = function () {
                        alert('Open Settings ' + scope.component.id);
                    };
                }
            };
        });

})();
