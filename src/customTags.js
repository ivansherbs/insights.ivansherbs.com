let fs = require('fs');
let process = require('process');

module.exports = function(eleventyConfig) {
    eleventyConfig.addLiquidTag('resourceDomain', function() {
        return {
            render: function() {
                return Promise.resolve(process.env.RESOURCE_BASE_URL);
            }
        };
    });

    eleventyConfig.addShortcode('articleFragment', function(path) {
        var fullPath = '_site/' + path + '/index.html';
        return fs.readFileSync(fullPath);
    });
};
