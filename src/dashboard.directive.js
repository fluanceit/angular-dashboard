/**
 * Mycockpit Directive
 */
(function() {
    'use strict';

    angular
        .module('dashboard')
        .directive('dashboard', ['dashboardFactory', function(dashboardFactory) {

            var currentWidth;
            var lastNumberColumns;
            var columnsWidth;

            // This function calculate column width based on columns number and current width.
            function calculate(columns, minWidth, callback) {

                var numberOfColumnPossible = parseInt(currentWidth / minWidth);

                if (lastNumberColumns !== numberOfColumnPossible) {
                    lastNumberColumns = numberOfColumnPossible;
                    // Case 1, we make them float
                    if (numberOfColumnPossible < columns) {
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
                templateUrl: 'src/dashboard.directive.html',
                controller: ['$scope', function(scope) {

                    currentWidth = $('#' + scope.id).parent().width();

                    // If screen smaller than expected width, we take size
                    if (scope.width !== 'auto' && currentWidth > scope.width) {
                        currentWidth = scope.width;
                    }


                    calculate(scope.columns, scope.columnsMinWidth);

                    scope.columnsWidth = columnsWidth;

                    // This is use during resize, to detect a change of state with previous value
                    lastNumberColumns = scope.columns;

                    // On each resize, we look if columns are smaller than scope.columnsMinWidth and
                    // if it is we trigger a claculate and then a scope.apply()
                    window.addEventListener('resize', function() {
                        currentWidth = document.getElementById(scope.id).offsetWidth;
                        calculate(scope.columns, scope.columnsMinWidth, function() {
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

                    var theElement = document.getElementById(scope['id']);

                    var mylatesttap = 0;
                    var holdTimer = 0;
                    var touchDuration = 500;

                    theElement.addEventListener('touchstart', touchStartHandler, false);
                    theElement.addEventListener('touchend', touchEndHandler, false);
                    theElement.addEventListener('touchmove', touchMoveHandler, false);

                    function touchStartHandler(event) {
                        if (!scope.dashboard.sortableDisabled) {
                            var now = new Date().getTime();
                            var timesince = now - mylatesttap;
                            if ((timesince < 500) && (timesince > 0)) {
                                scope.$apply(function(e) {
                                    scope.dashboard.changeSortableState();
                                });
                            }
                            mylatesttap = new Date().getTime();
                        } else {
                            holdTimer = setTimeout(function() {
                                scope.$apply(function(e) {
                                    scope.dashboard.changeSortableState();
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

                }
            };
        }]);

})();
