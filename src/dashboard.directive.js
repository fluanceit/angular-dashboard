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
                    'id': '@',
                    'width': '@',
                    'columns': '@',
                    'columnsMinWidth': '@'
                },
                templateUrl: 'src/dashboard.directive.html',
                link: function(scope, element, attrs) {
                    scope.dashboard = dashboardFactory.get(scope.id);

                    console.log(scope);

                    scope.dashboard.set({
                        'width': scope['width'],
                        'columns': scope['columns'],
                        'columnsMinWidth': scope['columnsMinWidth']
                    });

                    scope.grid = dashboardFactory.get(scope.id).grid;
                }
            };
        }]);

})();
