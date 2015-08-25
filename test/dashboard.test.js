/* jshint -W117, -W030 */
describe('dashboard tests', function() {
    beforeEach(module('dashboard'));

    beforeEach(inject(function(_dashboardFactory_, _imagesComponent_) {
        dashboardFactory = _dashboardFactory_;
        ImagesComponent = _imagesComponent_;
    }));

    it('should create a new Dashboard with the saved String', function() {

        // Create a new Dashboard
        var dashboard = dashboardFactory.get('first');

        // Add some components
        dashboard.add(new ImagesComponent({
            url: 'https://images.unsplash.com/photo-1438368915865-a852ef86fc42?q=80&fm=jpg&w=200&fit=max'
        }), 2);
        dashboard.add(new ImagesComponent({
            url: 'https://images.unsplash.com/photo-1437572848259-df63caa1a552?q=80&fm=jpg&w=200&fit=max'
        }), 1);
        dashboard.add(new ImagesComponent({
            url: 'https://images.unsplash.com/photo-1437422061949-f6efbde0a471?q=80&fm=jpg&w=200&fit=max'
        }));

        // Save the current Dashboard
        var savedDashboard = dashboard.saveAsString();

        // Create a second Dashboard
        var secondDashboard = dashboardFactory.get('second');

        // Add the components with the saved String
        secondDashboard.createFromString(savedDashboard);

        // Compare both Dashboards
        expect(dashboard.saveAsString()).toBe(secondDashboard.saveAsString());
    });
});
