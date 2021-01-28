var defaults = {
    markerPattern: /^\[\[shop (.+)\]\]/im,
};

module.exports = function (md, o) {
    var options = Object.assign({}, defaults, o);
    var shopifyRegexp = options.markerPattern;

    function shopify(state, silent) {
        var token;
        var match;

        // Reject if the token does not start with [
        if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */ ) {
            return false;
        }
        // Don't run any pairs in validation mode
        if (silent) {
            return false;
        }

        // Detect TOC markdown
        match = shopifyRegexp.exec(state.src.substr(state.pos));
        match = !match ? [] : match.filter(function(m) { return m; });
        if (match.length < 1) {
            return false;
        }

        // Build content
        token = state.push('shopify', 'shopify', 0);
        token.markup = '[[shopify]]';

        // Update pos so the parser can continue
        var newline = state.src.indexOf('\n', state.pos);
        if (newline !== -1) {
            state.pos = newline;
        } else {
            state.pos = state.pos + state.posMax + 1;
        }

        return true;
    }

    md.renderer.rules.shopify = function (tokens, idx, options, env, self) {
        var token = tokens[idx];
        console.dir(token);
        console.dir(options);
        //console.dir(env);

        //if (shopifyRegexp.test(token.attrs[aIndex][1])) {
        //    var id = token.attrs[aIndex][1].match(shopifyRegexp)[2];

        //    return `{% shopifyCollection ${ id } "modal" %}`;
        //}

        var id = '123';
        return `{% shopifyCollection ${ id } "modal" %}`;
    };

    md.inline.ruler.after('emphasis', 'shopify', shopify);
};
