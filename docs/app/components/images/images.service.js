(function() {
    'use strict';

    var componentName = 'imagesComponent';

    angular
        .module('components')
        .service(componentName, ImagesComponent);

    ImagesComponent.$inject = [];

    /**
     * @ngdoc service
     * @module dashboard
     * @name imagesComponent
     * @description
     *
     * This is a dashboard object. Allow you to create an object.
     *
     */
    function ImagesComponent() {
        // Return a function to be used as new User();
        return function(params) {
            return {
                // SOME DATA, NOT REQUIRED
                name: componentName,
                params: params,
                states: {
                    'default': {
                        template: 'components/images/images.templates.html',
                        controller: function() {}
                    },
                    'extended': {
                        template: 'components/images/images.templates.extended.html'
                    },
                    'settings': {
                        template: 'components/images/images.templates.settings.html',
                        controller: function() {}
                    }
                }
            };
        };

    }
})();
