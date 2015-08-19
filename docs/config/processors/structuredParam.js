'use strict';

module.exports = function structuredParamProcessor(log) {

    var lodash = require('lodash');

    var debug = function() {
        log.debug.apply(this, arguments);
    };

    var processParams = function(params) {
        var newParams = [],
            parent = null;
        lodash(params)
            .forEach(function(param) {
                var splitted = param.name.split('.');
                if (splitted.length === 1) {
                    parent = param;
                    parent.level = 0;
                    newParams.push(parent);
                } else if (splitted.length === 2 && parent && parent.name === splitted[0]) {
                    if (!parent.nestedParams) {
                        parent.nestedParams = [];
                    }
                    param.name = splitted[1];
                    param.level = 1;
                    parent.nestedParams.push(param);
                } else {
                    param.level = 0;
                    newParams.push(param);
                }
            });
        debug('parameters: ', newParams);
        return newParams;
    };

    return {
        $runAfter: ['paths-computed'],
        $runBefore: ['rendering-docs'],
        $process: function(docs) {
            lodash(docs)
                .filter('methods').forEach(function(doc) {
                    lodash(doc.methods).filter('params').forEach(function(method) {
                        method.params = processParams(method.params);
                    });
                });
            lodash(docs)
                .filter('params').forEach(function(doc) {
                    doc.params = processParams(doc.params);
                });

        }
    };
};
