const fs = require('fs');
const path = require('path');

var replacements = [];
var dirname = module.path;

const REPLACEMENT_DIR_NAME = '/replacements';

fs.readdirSync(`${dirname}/${REPLACEMENT_DIR_NAME}`).forEach(file => {
    if (path.extname(file) == '.js') {
        replacements.push(require(`./${REPLACEMENT_DIR_NAME}/${file}`));
    }
});

module.exports = replacements;
