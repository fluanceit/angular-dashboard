'use strict';

var lodash = require('lodash');

module.exports = function generateNavigationProcessor(log) {

    var debug = log.debug;

    var AREA_NAMES = {
        presentation: 'Presentation',
        guide: 'Developer Guide'
    };

    var mappers = {
        presentation: function(pages, key) {
            var res = {
                name: 'Presentation',
                type: 'groups',
                href: key,
                navItems: []
            };

            lodash(pages).forEach(function(page) {
                res.navItems.push({
                    name: page.name,
                    type: '',
                    href: page.path,
                    priority: page.priority
                });
            });

            return [res];
        },
        guide: function(pages, key) {
            var res = {
                name: 'Developer Guide',
                type: 'groups',
                href: key,
                navItems: []
            };

            lodash(pages).forEach(function(page) {
                res.navItems.push({
                    name: page.name,
                    type: '',
                    href: page.path,
                    priority: page.priority
                });
            });

            return [res];
        }
    };

    return {
        $runAfter: ['paths-computed'],
        $runBefore: ['rendering-docs'],
        $process: function(docs) {

            var areas = {},
                areaIds = [];
            var pages = lodash(docs)
                .filter(function(it) {
                    return it.area;
                });

            lodash(pages).groupBy('area').forEach(function(pages, key) {
                debug('start process area:', key);
                if (mappers[key]) {
                    areas[key] = {
                        id: key,
                        name: AREA_NAMES[key] || key,
                        navGroups: mappers[key](pages, key)
                    };
                    areaIds.push(key);
                }
            });

            docs.push({
                docType: 'nav-data',
                id: 'nav-data',
                template: 'nav-data.template.js',
                outputPath: 'src/nav-data.js',
                areas: areas
            });

            docs.push({
                template: 'area-data.template.js',
                outputPath: 'src/area-data.js',
                areaIds: areaIds
            });

        }
    };
};
