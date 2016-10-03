/**
 * Mycockpit Directive
 */
(function() {
    'use strict';

    angular
        .module('dashboard')
        .directive('dashboard', ['dashboardFactory', function(dashboardFactory) {

            // Width of the dashboard container
            var currentWidth;
            // To detet a change of column
            var lastNumberColumns;
            // Usually currentWidth / minWidth where max is numberMaxOfColumn
            var numberOfColumnPossible;
            // Width of columns in % to use in ng-style
            var columnsWidth;
            // Maximum number of columns
            var numberMaxOfColumn;
            // Thread to avoir too much event trigger during resize
            var timeout;

            return {
                restrict: 'E',
                scope: {
                    'id': '@',
                    'width': '@',
                    'columns': '@',
                    'columnsMinWidth': '@'
                },
                templateUrl: 'dashboard.directive.html',
                controller: ['$scope', function(scope) {
                    currentWidth = $( window ).width();

                    scope.dashboard = dashboardFactory.get(scope.id);

                    scope.dashboard.setOptions({
                        'width': scope['width'],
                        'columns': scope['columns'],
                        'columnsMinWidth': scope['columnsMinWidth']
                    });

                    scope.dashboard.refresh();

                    // On resize we refresh
                    window.addEventListener('resize', function(event) {

                        if ($( window ).width() !== currentWidth) {
                            // update currentWidth with current window width
                            currentWidth = $( window ).width();
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
                                scope.dashboard.refresh();
                                scope.$apply();
                            }, 150);
                        }
                    }, true);
                }]
            };
        }]);
})();
