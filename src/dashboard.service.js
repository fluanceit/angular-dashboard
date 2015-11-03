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
     */
    function DashboardObjectFunction($injector) {

        /* jshint maxdepth: 10 */

        // Return a function to be used as new User();
        return function(params) {
            var DEFAULT_DASHBOARD = {
                // ID : string to identify a dashboard
                id: null,
                // auto_increment when add a component. To generate unique ID
                nbComponent: 0,
                // Used in template to know if dashboard is extended or not
                isExtended: false,
                // Array of columns. Contain all component
                grid: [],

                // Define if dashboard is in sortable state
                isSortable: false, // Activate disable shaking state

                // This array contain list of sortable columns
                sortable: [], // Array of columns objects

                // stored option to manage dashboard configuration.
                options: {
                    // Full width of entiere dashboard
                    'width': 'auto',
                    // Number of columns in dashboard
                    'columns': '2',
                    // Min widht of columns.
                    'columnsMinWidth': null,
                    // Enable/disable sorting
                    'sortable': true,
                    // Algorithm to define where to put component if no column
                    // can be shorter, or Random
                    'algo': 'shorter'
                },

                /**
                 * List of function to add
                 */
                add: add,
                set: set,
                toString: toString,
                fromString: fromString,

                toggleSortable: toggleSortable
            };

            var dashboardObject = DEFAULT_DASHBOARD;

            return dashboardObject;

            /**
             * Add a component in array
             * @param {Object} component    Dashboard component
             * @param {integer} column      Column number, starting at zero
             */
            function add(component, column) {
                // If component has a position for this configuration of columns.
                if (component.positions && component.positions[dashboardObject.options['columns']]) {
                    var pos = component.positions[dashboardObject.options['columns']];

                    console.log('Position is ' + component.positions[dashboardObject.options['columns']]);
                } else {

                    // Define columns
                    if (!column) {
                        if (dashboardObject.options['algo'] === 'shorter') {
                            var i, shorterColumn = 0;
                            for (i = dashboardObject.options['columns'] - 1; i >= 0; i--) {
                                if (dashboardObject.grid[i]) {
                                    if (dashboardObject.grid[shorterColumn] &&
                                        dashboardObject.grid[i].length > dashboardObject.grid[shorterColumn].length){
                                        column = i;
                                        shorterColumn = i;
                                    }
                                } else {
                                    column = i;
                                    shorterColumn = i;
                                }
                            }
                        } else if (dashboardObject.options['algo'] === 'random'){
                            column = Math.random() * dashboardObject.options['columns'];
                        } else {
                            column = 0;
                        }
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

            /**
             * Sort elements based on algo or saved configuration.
             */
            function generateGrid() {
                var componentStack = []; // Stack component to repart.

            }

            /**
             * Convert the dashboard to a String
             * @return {String} Dashboard as a String
             */
            function toString() {
                var tmpColumns = [];
                var tmpColumn = [];

                // For each column in grid
                dashboardObject.grid.forEach(function(column) {
                    tmpColumn = [];
                    column.forEach(function(component) {
                        tmpColumn.push({
                            name: component.name,
                            params: component.params,
                            positions: component.positions
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
            function fromString(dashboardString) {
                var tmpColumns = JSON.parse(dashboardString);
                var nbColumns = 0;

                tmpColumns.forEach(function(column) {
                    column.forEach(function(component) {
                        if ($injector.has(component.name)) {
                            add(new $injector.get(component.name)(component.params, component.positions), nbColumns);
                        }
                    });
                    nbColumns++;
                });
            }

            // Apply drag/drop to angular MVC (alias grid object)
            function sortAllComponents(evt) {

                // Identify columns
                var oldColumn = evt.from.id.replace('column', '');
                var newColumn = evt.to.id.replace('column', '');

                // Get component as tmp
                var component = dashboardObject.grid[oldColumn][evt.oldIndex];
                // Remove old component
                dashboardObject.grid[oldColumn].splice(evt.oldIndex, 1);
                // Add component to new location
                dashboardObject.grid[newColumn].splice(evt.newIndex, 0, component);

            }

            /**
             * Apply Sortable to HTML and make it draggable/droppable
             */
            function makeItSortable() {

                // apply sortable on each column.
                for (var i = 0; i < dashboardObject.grid.length; i++) {
                    dashboardObject.sortable.push(
                        Sortable.create(document.getElementById('column' + i), {
                            group: dashboardObject.id,
                            draggable: '.component',
                            disabled: !dashboardObject.isSortable, // No databinding here, need to be updated
                            handle: '.sortable-handle',
                            onAdd: function(evt) {
                                // Event triggered when add in column
                                sortAllComponents(evt);
                            },
                            onUpdate: function(evt) {
                                // event triggered when column is changed
                                sortAllComponents(evt);
                            }
                        })
                    );
                }
            }

            /**
             * This function enable/disable sorting state of dashboard
             */
            function toggleSortable() {
                // If dashboard is sortable by user
                if (!dashboardObject.options['sortable']) {
                    console.log('This dashboard does not allow sorting (see options configuration).');
                } else {
                    makeItSortable();
                    // Toggle sorting state
                    dashboardObject.isSortable = !dashboardObject.isSortable;
                    // Change disable option for each column
                    dashboardObject.sortable.forEach(function(sort) {
                        sort.option('disabled', !dashboardObject.isSortable);
                    });
                }
            }
        };
    }
})();
