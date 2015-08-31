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
            get: get
        };

        return factory;

        /**
         * Get a dashboard, based on its id
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        function get(id) {
            if (!store[id]) {
                store[id] = new DashboardObject();
                store[id].id = id;
            }
            return store[id];
        }

    }
})();
