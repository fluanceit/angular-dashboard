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

                // Here are stored option to manage our dashboard.
                options: {
                    // Full width of entiere dashboard
                    'width': 'auto',
                    // Number of columns in dashboard
                    'columns': '2',
                    // Min widht of columns.
                    'columnsMinWidth': null
                },

                /**
                 * List of function to add
                 */
                add: add,
                set: set,
                saveAsString: saveAsString,
                createFromString: createFromString
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
                    column = 0;
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
                Object.keys(newOptions).forEach(function (key) {
                    if (newOptions[key]) {
                        dashboardObject.options[key] = newOptions[key];
                    }
                });
            }

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
