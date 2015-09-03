(function() {
    'use strict';

    angular
        .module('dashboard')
        .service('dashboardObject', DashboardObjectFunction);

    DashboardObjectFunction.$inject = ['$injector', '$rootScope'];

    /**
     * @ngdoc service
     * @module dashboard
     * @name dashboardObject
     * @description
     *
     * This is a dashboard object. Allow you to create an object.
     *
     */
    function DashboardObjectFunction($injector, $scope) {

        // Return a function to be used as new User();
        return function(params) {
            var DEFAULT_DASHBOARD = {
                id: null,
                /**
                 * @ngdoc property
                 * @name dashboard#columns
                 * @description Number of columns to display
                 */
                nbColumns: 2,
                nbComponent: 0,

                isExtended: false,

                isSorted: false,
                sortComponents: false,
                sortable: [],
                sortableDisabled: true,

                /**
                 * @ngdoc property
                 * @name dashboard#components
                 * @description List of component to display
                 */
                columns: [],
                tmpColumns: [],
                order: '',

                /**
                 * List of function to add
                 */
                add: add,
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
                    column = 0;
                }
                // create id to select easily
                component.id = dashboardObject.id + '-' + dashboardObject.nbComponent;
                dashboardObject.nbComponent++;
                // If nocolumn yet, create one.
                if (!dashboardObject.columns[column % dashboardObject.nbColumns]) {
                    dashboardObject.columns[column % dashboardObject.nbColumns] = [];
                }
                // Add in column
                dashboardObject.columns[column % dashboardObject.nbColumns].push(component);
            }

            function sortAllComponents(evt) {
                var oldColumn = evt.from.id.replace('column', '');
                var newColumn = evt.to.id.replace('column', '');
                var oldPosition = evt.oldIndex;
                var newPosition = evt.newIndex;
                var component = dashboardObject.tmpColumns[oldColumn][oldPosition];

                dashboardObject.tmpColumns[oldColumn].splice(oldPosition, 1);
                if (oldColumn === newColumn && oldPosition < newPosition) {
                    newPosition = newPosition - 1;
                }
                dashboardObject.tmpColumns[newColumn].splice(newPosition, 0, component);
            }

            function makeItSortable() {
                if (!dashboardObject.sortComponents) {
                    dashboardObject.sortComponents = true;
                    var actIndex = 0;
                    dashboardObject.columns.forEach(function(column) {
                        dashboardObject.tmpColumns.push([]);
                        column.forEach(function(component) {
                            dashboardObject.tmpColumns[actIndex].push(component);
                        });
                        actIndex = actIndex + 1;
                    });
                    for (var i = 0; i < dashboardObject.columns.length; i++) {
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

            /**
             * Convert the dashboard to a String
             * @return {String} Dashboard as a String
             */
            function saveAsString() {
                var tmpColumns = [];
                var tmpColumn = [];

                dashboardObject.tmpColumns.forEach(function(column) {
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
