(function() {
    'use strict';

    angular
        .module('components', ['dashboard']);

    angular
        .module('docApp')
        .controller('exempleController', ['dashboardFactory', 'imagesComponent', Exemple1Controller])
        .controller('exemple2Controller', ['$scope', 'dashboardFactory', 'imagesComponent', Exemple2Controller]);

    function Exemple1Controller(fluanceDashboard, ImageComponent) {

        var dashboard = fluanceDashboard.get('components-simple-exemple');

        if (dashboard.nbComponent === 0) {
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
        } else {
            dashboard.disableExtended();
        }
    }

    function Exemple2Controller($scope, fluanceDashboard, ImageComponent) {

        var dashboard = fluanceDashboard.get('components-simple-exemple2');

        $scope.toggleSortable = function() {
            dashboard.toggleSortable();
        };

        if (dashboard.nbComponent === 0) {
            var img = [
                'https://images.unsplash.com/photo-1445251836269-d158eaa028a6?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1442188950719-e8a67aea613a?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1442029739115-ce733f0de45e?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1444090542259-0af8fa96557e?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1443827423664-eac70d49dd0d?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1438368915865-a852ef86fc42?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1443453489887-98f56bc5bb38?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1441966055611-30ea468880a2?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1441155472722-d17942a2b76a?q=80&fm=jpg&w=800&fit=max',
                'https://images.unsplash.com/photo-1439546743462-802cabef8e97?q=80&fm=jpg&w=800&fit=max'
            ];

            img.forEach(function(url) {
                dashboard.add(new ImageComponent({
                    'url': url
                }));
            });
        } else {
            dashboard.disableExtended();
        }
    }

})();
