(function() {
    'use strict';

    angular
        .module('dashboard')
        .service('imagesComponent', ImagesComponent);

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
        return function (url) {
            return {
                // SOME DATA, NOT REQUIRED
                url: url,
                /**
                 * @ngdoc property
                 * @name imagesComponent#template
                 * @description URL to display
                 */
                templates: {
                    'default' : '/src/components/images.templates.html',
                    'extended': '/src/components/images.templates.extended.html',
                    'settings': '/src/components/images.templates.settings.html'
                }
            };

        };

    }
})();
