module.exports = function(eleventyConfig) {

    // TODO add when 11ty v1.0 is released with the addGlobalData feature
    //require('./src/globalData')(eleventyConfig);

    require('./src/customTags')(eleventyConfig);
    require('./src/customFilters')(eleventyConfig);

    require('./src/markdown')(eleventyConfig);

    // eleventy configuration
    return {
        dir: {
            input: 'content'
        }
    };
};
