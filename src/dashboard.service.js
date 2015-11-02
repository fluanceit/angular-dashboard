(function() {
    'use strict';

    angular
        .module('dashboard')
        .service('dashboardObject', DashboardObjectFunction);

    DashboardObjectFunction.$inject = ['$injector'];

    /**
     * @ngdoc service
     * @module dashboard
     * @name dashboardObject
     * @description
     *
     * This is a dashboard object. Allow you to create an object.
     *
     */
    function DashboardObjectFunction($injector) {

        // Return a function to be used as new User();
        return function(params) {
            var DEFAULT_DASHBOARD = {
                id: null,

                nbComponent: 0,

                isExtended: false,

                grid: [],
                tmpGrid: [],

                isSorted: false,
                sortComponents: false,
                sortable: [],
                sortableDisabled: true,

                // Here are stored option to manage our dashboard.
                options: {
                    // Full width of entiere dashboard
                    'width': 'auto',
                    // Number of columns in dashboard
                    'columns': '2',
                    // Min widht of columns.
                    'columnsMinWidth': null,
                    // Algorithm to define where to put component if no column
                    'algo': 'shorter'
                },

                /**
                 * List of function to add
                 */
                add: add,
                set: set,
                saveAsString: saveAsString,
                createFromString: createFromString,
                changeSortableState: changeSortableState
            };

            var dashboardObject = DEFAULT_DASHBOARD;

            return dashboardObject;

            /**
             * Add a component in array
             * @param {Object} component    Dashboard component
             * @param {integer} column      Column number, starting at zero
             */
            function add(component, column) {
                if (!column) {
                    if (dashboardObject.options['algo'] === 'shorter') {
                        var i, shorterColumn = 0;
                        for (i = dashboardObject.options['columns']; i >= 0; i--) {
                            if (dashboardObject.grid[i]) {
                                if (dashboardObject.grid[shorterColumn] &&
                                    dashboardObject.grid[i].length > dashboardObject.grid[shorterColumn].length) {
                                    column = i;
                                    shorterColumn = i;
                                }
                            } else {
                                column = i;
                                shorterColumn = i;
                            }
                        }
                    } else {
                        column = 0;
                    }
                }

                // create id to select easily
                component.id = dashboardObject.id + '-' + dashboardObject.nbComponent;
                dashboardObject.nbComponent++;
                // If nocolumn yet, create one.
                if (!dashboardObject.grid[column]) {
                    dashboardObject.grid[column] = [];
                }
                // Add in column
                dashboardObject.grid[column].push(component);
            }

            /**
             * Set dashboard options.
             */
            function set(newOptions) {
                // For each new option we override current one.
                Object.keys(newOptions).forEach(function(key) {
                    if (newOptions[key]) {
                        dashboardObject.options[key] = newOptions[key];
                    }
                });
            }


            /**************************************************************************************************************
             SUSPICIOS CODE NEEDS TO BE REFACTORED
            **************************************************************************************************************/
            function sortAllComponents(evt) {
                var oldColumn = evt.from.id.replace('column', '');
                var newColumn = evt.to.id.replace('column', '');
                var oldPosition = evt.oldIndex;
                var newPosition = evt.newIndex;
                var component = dashboardObject.tmpGrid[oldColumn][oldPosition];

                dashboardObject.tmpGrid[oldColumn].splice(oldPosition, 1);
                if (oldColumn === newColumn && oldPosition < newPosition) {
                    newPosition = newPosition - 1;
                }
                dashboardObject.tmpGrid[newColumn].splice(newPosition, 0, component);
                dashboardObject.grid = dashboardObject.tmpGrid;
            }

            function makeItSortable() {
                if (!dashboardObject.sortComponents) {
                    dashboardObject.sortComponents = true;
                    var actIndex = 0;
                    dashboardObject.grid.forEach(function(column) {
                        dashboardObject.tmpGrid.push([]);
                        column.forEach(function(component) {
                            dashboardObject.tmpGrid[actIndex].push(component);
                        });
                        actIndex = actIndex + 1;
                    });
                    for (var i = 0; i < dashboardObject.grid.length; i++) {
                        dashboardObject.sortable.push(Sortable.create(document.getElementById('column' + i), {
                            group: dashboardObject.id,
                            draggable: '.component',
                            disabled: dashboardObject.sortableDisabled,
                            handle: ".sortable-handle",
                            onAdd: function(evt) {
                                sortAllComponents(evt);
                            },
                            onUpdate: function(evt) {
                                sortAllComponents(evt);
                            }
                        }));
                    }
                }
            }

            function changeSortableState() {
                if (!dashboardObject.isSorted) {
                    makeItSortable();
                }
                dashboardObject.sortableDisabled = !dashboardObject.sortableDisabled;
                dashboardObject.sortable.forEach(function(sort) {
                    sort.option('disabled', dashboardObject.sortableDisabled);
                });
            }
            /**************************************************************************************************************/




            /**
             * Convert the dashboard to a String
             * @return {String} Dashboard as a String
             */
            function saveAsString() {
                var tmpColumns = [];
                var tmpColumn = [];

                dashboardObject.grid.forEach(function(column) {
                    tmpColumn = [];
                    column.forEach(function(component) {
                        tmpColumn.push({
                            name: component.name,
                            params: component.params
                        });
                    });
                    tmpColumns.push(tmpColumn);
                });

                return JSON.stringify(tmpColumns);
            }

            /**
             * Create a dashboard from a String
             * @param  {String} dashboardString Dashboard as a String
             */
            function createFromString(dashboardString) {
                var tmpColumns = JSON.parse(dashboardString);
                var nbColumns = 0;

                tmpColumns.forEach(function(column) {
                    column.forEach(function(component) {
                        if ($injector.has(component.name)) {
                            add(new $injector.get(component.name)(component.params), nbColumns);
                        }
                    });
                    nbColumns++;
                });
            }

        };

    }
})();
