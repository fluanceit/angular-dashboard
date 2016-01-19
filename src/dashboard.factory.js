(function() {
    'use strict';

    angular
        .module('dashboard')
        .factory('dashboardFactory', DashboardFactoryFunction);

    DashboardFactoryFunction.$inject = ['dashboardObject'];

    /**
     * @ngdoc service
     * @module dashboard
     * @name dashboardObject
     * @description
     *
     * This is a dashboard object. Allow you to create an object.
     *
     */
    function DashboardFactoryFunction(DashboardObject) {

        /**
         * This object store all dashboards, available by id.
         * @type {Object}
         */
        var store = {};

        var factory = {
            get: get,
            remove: remove,
            reinitialize: reinitialize
        };

        return factory;

        /**
         * Get a dashboard, based on its id
         * @param  {String} id [description]
         * @return {Object}    Index of dashbaords
         */
        function get(id) {
            if (!store[id]) {
                store[id] = new DashboardObject();
                store[id].id = id;
            }
            return store[id];
        }

        /**
         * Remove from a dashboard, based on its id
         * @param  {String} id [description]
         */
        function remove(id) {
            if (store[id]) {
                delete store[id];
            }
        }

        /**
         * Remove all dashboards from factory (used to reinitialize)
         */
        function reinitialize() {
            store = {};
        }

    }
})();
