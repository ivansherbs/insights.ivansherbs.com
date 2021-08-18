const ENUM_SHOPIFY_BUTTON_DESTINATIONS = ['cart', 'modal', 'checkout', 'onlineStore'];

const patterns = {
    // captures: key_name=
    key: /(?<key>\S+)/,
    // captures: 'attribute value'
    avalue: /(?:\s*'(?<avalue>(?:\\'|[^'])*)')/,
    // captures: "attribute value"
    qvalue: /(?:\s*"(?<qvalue>(?:\\"|[^"])*)")/,
    // captures unprotexted attribute values
    svalue: /(?:(?<svalue>(?:\\\s|[^\s])*))/
};

const attributeRegExp = new RegExp(`${patterns.key.source}\\s*=(?:${patterns.avalue.source}|${patterns.qvalue.source}|${patterns.svalue.source})`, 'g');

var markdownPatterns = {
    product: /\[\[shopifyProduct\s+(\w+)(?:\s+(.*))?\s*\]\]/,
    collection: /\[\[shopifyCollection\s+(\w+)(?:\s+(.*))?\s*\]\]/
};

var defaultButtonDestinations = {
    product: ENUM_SHOPIFY_BUTTON_DESTINATIONS[1],
    collection: ENUM_SHOPIFY_BUTTON_DESTINATIONS[0],
};

module.exports = function(displayType) {
    if (!markdownPatterns[displayType]) {
        // no-op for invalid type
        return () => '';
    }

    return function (markdownText, frontMatter) {
        var completePattern = markdownPatterns[displayType];

        // no match, no fun
        var match = markdownText.match(completePattern);
        if (!match) {
            return '';
        }

        // option initialization
        var options = (frontMatter.shopify || {});
        options.language = options.language || 'EN';
        var defaultButtonDestination = ENUM_SHOPIFY_BUTTON_DESTINATIONS[defaultButtonDestinations[displayType]];
        options.buttonDestination = options.buttonDestination || defaultButtonDestination;

        options[displayType] = match[1];

        // if there are other options
        if (match[2]) {
            var optionStr = match[2];
            [...optionStr.matchAll(attributeRegExp)].map(match => {
                options[match.groups.key] = match.groups.svalue || match.groups.avalue || match.groups.qvalue || '';
            });
        }

        // extra validations
        if (!options[displayType]) {
            return '';
        }
        if (ENUM_SHOPIFY_BUTTON_DESTINATIONS.indexOf(options.buttonDestination) == -1) {
            options.buttonDestination = defaultButtonDestination;
        }

        // build the data attributes
        var dataAttributes = '';
        for (var key in options) {
            if (options[key]) {
                dataAttributes += ` data-€{ key }="€{ options[key] }"`;
            }
        }

        return `<div class="shopify-€{displayType}" €{ dataAttributes }></div>`;
    };
};
