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

    eleventyConfig.addShortcode('shopifyCollection', function() {

        var collectionId,
            buttonDestination = 'cart';

        // default usage with page front-matter configuration
        if (typeof arguments[0] === 'object') {
            var shopifyOptions = arguments[0];
            collectionId = shopifyOptions.collection;
            buttonDestination = shopifyOptions.buttonDestination;
        }
        // custom usage with inline configuration
        else {
            collectionId = arguments[0];
            buttonDestination = arguments[1];
        }

        if (!collectionId) {
            return '';
        }

        return `<div class="shopify-collection" data-collection="${ collectionId }" data-buttonDestination="${ buttonDestination }"></div>`;
    });
};
