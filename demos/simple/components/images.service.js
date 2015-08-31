(function() {
    'use strict';

    var componentName = 'imagesComponent';

    angular
        .module('dashboard')
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
                /**
                 * @ngdoc property
                 * @name imagesComponent#template
                 * @description URL to display
                 */
                templates: {
                    'default' : '/demos/simple/components/images.templates.html',
                    'extended': '/demos/simple/components/images.templates.extended.html',
                    'settings': '/demos/simple/components/images.templates.settings.html'
                }
            };
        };

    }
})();
