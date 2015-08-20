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
                templateUrl: 'src/dashboard.directive.html',
                link: function(scope, element, attrs) {
                    scope.dashboard = dashboardFactory.get(scope.id);
                    scope.columns = dashboardFactory.get(scope.id).columns;
                }
            };
        }]);

})();
