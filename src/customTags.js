const fs = require('fs');
const process = require('process');

const I18N = require('../content/_data/i18n');

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

    eleventyConfig.addPairedShortcode('i18n', function(defaultText, key, forceLanguage) {
        var pageLocationLanguage = (this.page.filePathStem.match(/^\/([a-zA-Z]{2})\//) || [])[1];
        var language = (forceLanguage || pageLocationLanguage || 'EN').toUpperCase();
        return (I18N[key] || {})[language] || defaultText || `? I18N:${key}:${language} ?`;
    });
};
