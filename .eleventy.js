module.exports = function(eleventyConfig) {

    // *******************************
    // md configuration and extensions
    // *******************************
    let mdit = require("markdown-it");
    let mila = require('markdown-it-link-attributes')

    let mdOptions = {
        html: true,
        linkify: true
    };

    let md = mdit(mdOptions);
    md.use(mila, {
        attrs: {
            target: '_blank',
            rel: 'noopener'
        }
    });

    eleventyConfig.setLibrary("md", md);

    return {
        dir: {
            input: "content"
        }
    };
};
