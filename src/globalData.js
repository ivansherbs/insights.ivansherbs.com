const process = require('process');

module.exports = function(eleventyConfig) {
    eleventyConfig.addGlobalData('env', {
        RESOURCE_BASE_URL: process.env.RESOURCE_BASE_URL
    });
};
