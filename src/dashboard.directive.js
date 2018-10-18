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

                    // add support to Angular 1.6+ (use lifecycle hook)
                    this.$onInit = onInit;

                    function onInit() {
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

                        // Sortable configuration
                        scope.sortableConfig = {
                            group: {
                                name: scope.dashboard.id,
                                pull: function(to, from, dragEl, evt) {
                                    // for mobile (evt.pointerType == "touch" => in Sortable.js:_triggerDragStart()), evt.type = undefined. Use 'to' and 'from'
                                    if((evt.type === 'dragstart') || (!evt.type && (to === from))) {
                                        return false;
                                    }
                                    return true;
                                }
                            },
                            draggable: '.component',
                            disabled: scope.dashboard.isStateSorting, // No databinding here, need to be updated
                            handle: '.sortable-handle',
                            scroll: true,
                            scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
                            scrollSpeed: 10, // px
                            onAdd: function(evt) {
                                // Event triggered when add in column
                                scope.dashboard.sortAllComponents(evt);
                            },
                            onUpdate: function(evt) {
                                // event triggered when column is changed
                                scope.dashboard.sortAllComponents(evt);
                            }
                        }
                    }
                }]
            };
        }]);
})();
