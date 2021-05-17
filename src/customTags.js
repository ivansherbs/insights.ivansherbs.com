const debug = require('debug')('ih:11ty-custom-tags');
const fs = require('fs');

const I18N = require('../content/_data/i18n');

const TAG_FRAGMENT = 'articleFragment';
const TAG_I18N = 'i18n';
const debug_fragment = require('debug')('ih:11ty-custom-tag-' + TAG_FRAGMENT);
const debug_i18n = require('debug')('ih:11ty-custom-tag-' + TAG_I18N);

module.exports = function (eleventyConfig) {
    debug('Adding 11ty custom tag configuration');

    debug(`Adding 11ty custom shortcode: ${TAG_FRAGMENT}`);
    eleventyConfig.addShortcode(TAG_FRAGMENT, function (path) {
        debug_fragment(`Processing custom shortcode: ${TAG_FRAGMENT} '${path}'`);

        var fullPath = '_site/' + path + '/index.html';
        return fs.readFileSync(fullPath);
    });

    debug(`Adding 11ty custom paired shortcode: ${TAG_I18N}`);
    eleventyConfig.addPairedShortcode(TAG_I18N, function (defaultText, key, forceLanguage) {
        debug_i18n(`Processing custom paired shortcode: ${TAG_I18N} '${key}' ${forceLanguage || ''}`);

        var pageLocationLanguage = (this.page.filePathStem.match(/^\/([a-zA-Z]{2})\//) || [])[1];
        var language = (forceLanguage || pageLocationLanguage || 'EN').toUpperCase();
        return (I18N[key] || {})[language] || defaultText || `? I18N:${key}:${language} ?`;
    });
};
