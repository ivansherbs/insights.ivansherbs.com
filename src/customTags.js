let process = require('process');

module.exports = function(eleventyConfig) {
    eleventyConfig.addLiquidTag('resourceDomain', function() {
        return {
            render: function() {
                console.log(process.env.RESOURCE_BASE_URL);
                return Promise.resolve(process.env.RESOURCE_BASE_URL);
            }
        };
    });
};
