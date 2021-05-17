const debug = require('debug')('ih:11ty-custom-filters');

const FITER_SORTED_LOWERCASE_KEYS = 'sorted_lowercase_keys';
const FITER_TITLE_CASE = 'title_case';
const debug_sorted_lowercase_keys = require('debug')('ih:11ty-custom-filter-usage-' + FITER_SORTED_LOWERCASE_KEYS);
const debug_title_case = require('debug')('ih:11ty-custom-filter-usage-' + FITER_TITLE_CASE);

module.exports = function (eleventyConfig) {
    debug('Adding 11ty custom filter configuration');

    debug(`Adding 11ty custom filter: ${FITER_SORTED_LOWERCASE_KEYS}`);
    eleventyConfig.addFilter(FITER_SORTED_LOWERCASE_KEYS, function (object) {
        debug_sorted_lowercase_keys(`Sorting object with keys: ${Object.keys(object).join(', ')}`);

        if (!object || object instanceof Array) {
            return [];
        }

        return Object.keys(object).map(s => s.toLowerCase()).sort();
    });

    // TODO add special EN words to not capitalize
    function titleCaseEn(text) {
        return text.toLowerCase()
            .split(' ')
            .map(word => (word.charAt(0).toUpperCase() + word.slice(1)))
            .join(' ');
    }

    function titleCaseGeneric(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    debug(`Adding 11ty custom filter: ${FITER_TITLE_CASE}`);
    eleventyConfig.addFilter(FITER_TITLE_CASE, function (string, language) {
        debug_title_case(`Using title case filter for: '${string}' ${language || ''}`);

        language = language || 'EN';

        switch (language) {
            case 'EN': return titleCaseEn(string);
            default: return titleCaseGeneric(string);
        }
    });
};
