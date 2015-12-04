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
                // List of all component
                components: [],
                // Array of columns. Contain all component
                grid: [],

                // Define if dashboard is in sortable state
                isStateSorting: false, // Activate disable shaking state

                // This array contain list of sortable columns
                sortable: null, // Array of columns objects

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
                setOptions: setOptions,
                toString: toString,
                fromString: fromString,
                enableExtended: enableExtended,
                disableExtended: disableExtended,
                drawGrid: drawGrid,
                toggleSortable: toggleSortable
            };

            var dashboardObject = DEFAULT_DASHBOARD;

            return dashboardObject;

            /**
             * Add a component in array
             * @param {Object} component    Dashboard component
             * @param {integer} column      Column number, starting at zero
             */
            function add(component) {

                // Define component ID
                component.id = dashboardObject.id + '-' + dashboardObject.nbComponent;
                dashboardObject.nbComponent++;
                // Add in list
                dashboardObject.components.push(component);

                return component;
            }

            /**
             * Put all components in grid based on algo OR defined position saved in string.
             */
            function drawGrid() {
                // If is on sorting mode, we stop it
                if (dashboardObject.isStateSorting) {
                    dashboardObject.toggleSortable();
                }

                dashboardObject.grid = [];
                for (var i = dashboardObject.options['columns'] - 1; i >= 0; i--) {
                    dashboardObject.grid[i] = [];
                }

                dashboardObject.sortable = null;
                // For each component, we define its position and inject it in our grid object.
                // Grid is displayed in DOM by dashboard.directive.js
                dashboardObject.components.forEach(function (component) {

                    var column = 0, position = 0;
                    var nbColumn = dashboardObject.options['columns'];

                    // Check if position is define
                    if (component.positions && component.positions[nbColumn]) {
                        column = component.positions[nbColumn]['column'];
                        position = component.positions[nbColumn]['position'];
                    } else {

                        // We use algo to define component position
                        if (dashboardObject.options['algo'] === 'shorter') {
                            // For each column starting by the end, we check size
                            for (var i = dashboardObject.options['columns'] - 1; i >= 0; i--) {
                                // if column i in grid does not exist
                                if (!dashboardObject.grid[i]) {
                                    column = i;
                                    dashboardObject.grid[i] = [];
                                } else {
                                    // Si it exist
                                    if (dashboardObject.grid[i].length <= dashboardObject.grid[column].length) {
                                        column = i;
                                    }
                                }
                            }
                        } else if (dashboardObject.options['algo'] === 'random'){
                            column = Math.floor(Math.random() * dashboardObject.options['columns']);
                        } else {
                            column = 0;
                        }

                        // define position of defined column. Get last position.
                        if (dashboardObject.grid[column]) {
                            position = dashboardObject.grid[column].length;
                        }

                        // We save new position in our
                        if (!component.positions) {
                            component.positions = {};
                        }
                        component.positions[nbColumn] = {};
                        component.positions[nbColumn]['column'] = column;
                        component.positions[nbColumn]['position'] = position;
                    }

                    // If grid never used this column before, create one.
                    if (!dashboardObject.grid[column]) {
                        dashboardObject.grid[column] = [];
                    }
                    // Add compoment in grid to defined position
                    dashboardObject.grid[column].splice(position, 0, component);

                });
            }

            /**
             * Set dashboard options.
             */
            function setOptions(newOptions) {
                // For each new option we override current one.
                Object.keys(newOptions).forEach(function(key) {
                    if (newOptions[key]) {
                        dashboardObject.options[key] = newOptions[key];
                    }
                });
            }

            /**
             * Convert the dashboard to a String
             * @return {String} Dashboard as a String
             */
            function toString() {
                var componentList = [];

                // For each column in grid
                dashboardObject.grid.forEach(function(column) {
                    column.forEach(function(component) {
                        componentList.push({
                            name: component.name,
                            params: component.params,
                            positions: component.positions
                        });
                    });
                });

                return JSON.stringify(componentList);
            }

            /**
             * Create a dashboard from a String
             * @param  {String} dashboardString Dashboard as a String
             */
            function fromString(dashboardString) {
                var componentList = JSON.parse(dashboardString);
                var nbColumns = 0;

                componentList.forEach(function(component) {
                    if ($injector.has(component.name)) {
                        var componentObject = add(new $injector.get(component.name)(component.params));
                        componentObject.positions = component.positions;
                    }
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

                // Update component position
                //
                var nbColumn = dashboardObject.options['columns'];

                component.positions[nbColumn].column = newColumn;

                // Add component to new location
                dashboardObject.grid[newColumn].splice(evt.newIndex, 0, component);

                // Update old position index
                dashboardObject.grid[oldColumn].forEach(function (component, index) {
                    component.positions[nbColumn].column = parseInt(oldColumn);
                    component.positions[nbColumn].position = parseInt(index);
                });

                // Update new position index
                dashboardObject.grid[newColumn].forEach(function (component, index) {
                    component.positions[nbColumn].column = parseInt(newColumn);
                    component.positions[nbColumn].position = parseInt(index);
                });

            }

            /**
             * Apply Sortable to HTML and make it draggable/droppable
             */
            function makeItSortable() {

                // If columns have already been initialize
                if (!dashboardObject.sortable) {
                    dashboardObject.sortable = [];

                    // apply sortable on each column.
                    for (var i = 0; i < dashboardObject.grid.length; i++) {

                        dashboardObject.sortable.push(
                            Sortable.create(document.getElementById('column' + i), {
                                group: dashboardObject.id,
                                draggable: '.component',
                                disabled: !dashboardObject.isStateSorting, // No databinding here, need to be updated
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
                    dashboardObject.isStateSorting = !dashboardObject.isStateSorting;
                    // Change disable option for each column
                    dashboardObject.sortable.forEach(function(sort) {
                        sort.option('disabled', !dashboardObject.isStateSorting);
                    });
                }
            }

            function enableExtended() {
                dashboardObject.isExtended = true;
            }

            /**
             * This function disable extended dashboard to make it as default
             */
            function disableExtended() {
                dashboardObject.isExtended = false;

                dashboardObject.components.forEach(function(component) {
                    if (component.isExtended) {
                        component.isExtended = false;
                    }
                });
            }
        };
    }
})();
