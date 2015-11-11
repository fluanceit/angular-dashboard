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
                states: {
                    'default': {
                        template: '/demos/simple/components/images.templates.html',
                        controller: function () {
                            console.log('Open default state');
                        }
                    },
                    'extended': {
                        template: '/demos/simple/components/images.templates.extended.html'
                    },
                    'settings': {
                        template: '/demos/simple/components/images.templates.settings.html',
                        controller: function () {
                            console.log('Open settings state');
                        }
                    }
                }
            };
        };

    }
})();
