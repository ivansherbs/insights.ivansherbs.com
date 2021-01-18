let fs = require('fs');
let process = require('process');

const ENUM_SHOPIFY_BUTTON_DESTINATIONS = ['cart', 'modal', 'checkout', 'onlineStore'];

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

        // abort if no arguments
        if (!arguments[0]) {
            return '';
        }

        // initializations
        var collectionId,
            buttonText,
            buttonDestination = ENUM_SHOPIFY_BUTTON_DESTINATIONS[0];

        // default usage with page front-matter configuration
        if (typeof arguments[0] === 'object') {
            var shopifyOptions = arguments[0];
            collectionId = shopifyOptions.collection;
            buttonDestination = shopifyOptions.buttonDestination;
            buttonText = shopifyOptions.buttonText;
        }
        // custom usage with inline configuration
        else {
            collectionId = arguments[0];
            buttonDestination = arguments[1];
        }

        // validations
        if (!collectionId) {
            return '';
        }
        if (ENUM_SHOPIFY_BUTTON_DESTINATIONS.indexOf(buttonDestination) == -1) {
            buttonDestination = ENUM_SHOPIFY_BUTTON_DESTINATIONS[0];
        }

        var buttonTextAttribute = '';
        if (buttonText) {
            buttonTextAttribute = `data-buttonText="${ buttonText }"`;
        }

        return `<div class="shopify-collection" data-collection="${ collectionId }" data-buttonDestination="${ buttonDestination }" ${ buttonTextAttribute }></div>`;
    });
};
