(function() {
    'use strict';

    angular
        .module('components', ['dashboard']);

    angular
        .module('docApp')
        .controller('exempleController', ['dashboardFactory', 'imagesComponent', Exemple1Controller]);

    function Exemple1Controller(fluanceDashboard, ImageComponent) {

        var dashboard = fluanceDashboard.get('components-simple-exemple');

        var img = [
            'https://images.unsplash.com/photo-1445251836269-d158eaa028a6?q=80&fm=jpg&w=800&fit=max',
            'https://images.unsplash.com/photo-1443479579455-1860f114bf77?q=80&fm=jpg&w=800&fit=max',
            'https://images.unsplash.com/photo-1439546743462-802cabef8e97?q=80&fm=jpg&w=800&fit=max'
        ];

        img.forEach(function(url) {
            dashboard.add(new ImageComponent({
                'url': url
            }));
        });
    }

})();
