module.exports = function(eleventyConfig) {

    // markdown-it options
    let mdit = require('markdown-it');

    let mdOptions = {
        html: true,
        linkify: true
    };

    let md = mdit(mdOptions);

    // *******************************

    // use link attributes (like open in new tab using target _blank)
    let mila = require('markdown-it-link-attributes');
    md.use(mila, {
        attrs: {
            target: '_blank',
            rel: 'noopener'
        }
    });

    // *******************************

    let mia = require('markdown-it-anchor');
    md.use(mia);

    // use table of contetns
    var supportedTocs = [
        //[1],
        //[2],
        //[3],
        [4]
        //[1, 2],
        //[2, 3],
        //[3, 4],
        //[1, 2, 3],
        //[2, 3, 4],
        //[1, 2, 3, 4]
    ];
    for (var i in supportedTocs) {
        let mitoc = require('markdown-it-table-of-contents');
        let pattern = '^\\[\\[toc *' + supportedTocs[i].join(', *') + '\\]\\]';
        md.use(mitoc, {
            includeLevel: supportedTocs[i],
            markerPattern: new RegExp(pattern)
        });
    }

    // *******************************

    var mir = require('markdown-it-replace-it');
    require('./markdownReplacements').forEach(r => mir.replacements.push(r));
    md.use(mir);

    // *******************************

    // set the configured md as the content generator engine for md files
    eleventyConfig.setLibrary('md', md);
};
