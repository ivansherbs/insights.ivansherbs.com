module.exports = function(eleventyConfig) {

    // *******************************
    // md configuration and extensions
    // *******************************
    let mdit = require("markdown-it");

    let mdOptions = {
        html: true,
        linkify: true
    };

    let md = mdit(mdOptions);

    // use link attributes (like open in new tab using target _blank)
    let mila = require('markdown-it-link-attributes');
    md.use(mila, {
        attrs: {
            target: '_blank',
            rel: 'noopener'
        }
    });

    // use table of contets
    let mia = require("markdown-it-anchor");
    let mitoc = require("markdown-it-table-of-contents");
    md.use(mia);
    md.use(mitoc);

    // set the configured md as the content generator engine for md files
    eleventyConfig.setLibrary("md", md);


    // **********************
    // eleventy configuration
    // **********************
    return {
        dir: {
            input: "content"
        }
    };
};