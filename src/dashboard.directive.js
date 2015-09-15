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
                controller: ['$scope', function (scope) {

                    var currentWidth = document.getElementById(scope.id).offsetWidth;
                    // If screen smaller than expected width, we take  size
                    if (scope.width !== 'auto' && currentWidth > scope.width) {
                        currentWidth = scope.width;
                    }

                    // This is use during resize, to detect a change of state with previous value
                    var lastNumberColumns = scope.columns;

                    // This function calculate column width based on columns number and current width.
                    function calculate(callback) {
                        var numberOfColumnPossible = parseInt(currentWidth / scope.columnsMinWidth);

                        if (lastNumberColumns !== numberOfColumnPossible) {
                            lastNumberColumns = numberOfColumnPossible;
                            // Case 1, we make them float
                            if (numberOfColumnPossible < scope.columns) {
                                scope.columnsWidth = (100 / numberOfColumnPossible) + '%';
                            } else {
                                scope.columnsWidth = (100 / scope.columns) + '%';
                            }
                        }
                        if (callback !== undefined) {
                            callback();
                        }
                    }

                    calculate();

                    // On each resize, we look if columns are smaller than scope.columnsMinWidth and
                    // if it is we trigger a claculate and then a scope.apply()
                    window.addEventListener('resize', function() {
                        currentWidth = document.getElementById(scope.id).offsetWidth;
                        calculate(function () {
                            // scope.$apply() is required since scope is modified in an even.
                            scope.$apply();
                        });
                    }, true);

                }],
                link: function(scope, element, attrs) {
                    scope.dashboard = dashboardFactory.get(scope.id);

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
