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

            // This function calculate column width based on columns number and current width.
            function calculate(columns, minWidth, callback) {

                numberOfColumnPossible = parseInt(currentWidth / minWidth);

                if (numberOfColumnPossible > numberMaxOfColumn) {
                    numberOfColumnPossible = numberMaxOfColumn;
                }

                if (lastNumberColumns !== numberOfColumnPossible) {
                    lastNumberColumns = numberOfColumnPossible;
                    // Case 1, we make them float
                    if (numberOfColumnPossible < columns) {
                        columnsWidth = (100 / numberOfColumnPossible) + '%';
                    } else if (numberOfColumnPossible > columns) {
                        columnsWidth = (100 / numberOfColumnPossible) + '%';
                    } else {
                        columnsWidth = (100 / columns) + '%';
                    }
                }

                if (callback !== undefined) {
                    callback();
                }
            }

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

                    // Get current width of parent
                    currentWidth = $('#' + scope.id).parent().width();

                    // If screen smaller than expected width, we take size
                    if (scope.width !== 'auto' && currentWidth > scope.width) {
                        currentWidth = scope.width;
                    }

                    numberMaxOfColumn = scope.columns;

                    // init claculation for widhtcolumns and number of columns
                    calculate(scope.columns, scope.columnsMinWidth);

                    scope.columnsWidth = columnsWidth;

                    scope.dashboard = dashboardFactory.get(scope.id);

                    scope.dashboard.setOptions({
                        'width': scope['width'],
                        'columns': numberOfColumnPossible,
                        'columnsMinWidth': scope['columnsMinWidth']
                    });

                    scope.dashboard.drawGrid();
                    // This is use during resize, to detect a change of state with previous value
                    lastNumberColumns = scope.columns;

                    // On each resize, we look if columns are smaller than scope.columnsMinWidth and
                    // if it is we trigger a claculate and then a scope.apply()
                    window.addEventListener('resize', function() {

                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            //
                            currentWidth = document.getElementById(scope.id).offsetWidth;
                            calculate(scope.columns, scope.columnsMinWidth, function() {

                                if (numberOfColumnPossible !== scope.dashboard.options['columns']) {
                                    scope.columnsWidth = columnsWidth;
                                    scope.dashboard.setOptions({
                                        'columns': numberOfColumnPossible
                                    });
                                    scope.dashboard.drawGrid();
                                    // scope.$apply() is required since scope is modified in an even.
                                    scope.$apply();
                                }
                            });
                        }, 150);


                    }, true);

                    var theElement = document.getElementById(scope['id']);

                    var mylatesttap = 0;
                    var holdTimer = 0;
                    var touchDuration = 500;

                    theElement.addEventListener('touchstart', touchStartHandler, false);
                    theElement.addEventListener('touchend', touchEndHandler, false);
                    theElement.addEventListener('touchmove', touchMoveHandler, false);

                    function touchStartHandler(event) {
                        if (scope.dashboard.isStateSorting) {
                            var now = new Date().getTime();
                            var timesince = now - mylatesttap;
                            if ((timesince < 500) && (timesince > 0)) {
                                scope.$apply(function(e) {
                                    scope.dashboard.toggleSortable();
                                });
                            }
                            mylatesttap = new Date().getTime();
                        } else {
                            holdTimer = setTimeout(function() {
                                scope.$apply(function(e) {
                                    scope.dashboard.toggleSortable();
                                });
                            }, touchDuration);
                        }
                    }

                    function touchEndHandler(event) {
                        if (holdTimer) {
                            clearTimeout(holdTimer);
                        }
                    }

                    function touchMoveHandler(event) {
                        if (holdTimer) {
                            clearTimeout(holdTimer);
                        }
                    }

                }]
            };
        }]);

})();
