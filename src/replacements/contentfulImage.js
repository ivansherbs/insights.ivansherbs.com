const querystring = require('querystring');


function replacer(s, frontMatter) {
    var completePattern = /\[\[contentfulImage\s+(\w+)(\s+.*)*\]\]/;

    var match = s.match(completePattern);
    if (!match) {
        return '';
    }

    var imageId;
    var options = ((frontMatter.contentful || {}).imageOptions || { fm: 'jpg', q: '50', w: '1080' });

    imageId = match[1];

    // if there are image formatting options
    if (match[2]) {
        var optionStr = match[2].trim().split(/\s+/);

        for (var i in optionStr) {
            if (options[i]) {
                continue;
            }
            match = optionStr[i].match(/(.+)=(.+)/);
            if (match) {
                options[match[1]] = match[2];
            }
        }
    }

    var imageUrl = frontMatter.generated.contentful.images[imageId];
    var queryParams = querystring.stringify(options);
    var url = imageUrl + (queryParams ? '?' + queryParams : '');

    return `<div class="blog-img"><img src="${url}"></div>`;
}


module.exports = {
    name: 'contentfulImage',
    re: /\[\[contentfulImage\s+.+\]\]/,
    html: true,
    sub: replacer,
    default: true
};
