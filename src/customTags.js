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

    eleventyConfig.addShortcode('image', function() {

        // abort if no arguments
        if (!arguments[0]) {
            return '';
        }

        return `<div class="blog-img"><img src="${arguments[0]}"></div>`;
    });
};
