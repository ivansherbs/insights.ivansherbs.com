module.exports = {
    name: 'shopifyCollection',
    re: /\[\[shopifyCollection\s+.+\]\]/,
    html: true,
    sub: require('./shopify/common')('collection'),
    default: true
};
