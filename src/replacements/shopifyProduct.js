module.exports = {
    name: 'shopifyProduct',
    re: /\[\[shopifyProduct\s+.+\]\]/,
    html: true,
    sub: require('./shopify/common')('product'),
    default: true
};
