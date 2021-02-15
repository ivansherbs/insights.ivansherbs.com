module.exports = function(eleventyConfig) {

    eleventyConfig.addFilter('sorted_lowercase_keys', function(object) {
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

    eleventyConfig.addFilter('title_case', function(string, language) {
        language = language || 'EN';

        switch (language) {
            case 'EN': return titleCaseEn(string);
            default: return titleCaseGeneric(string);
        }
    });
};
