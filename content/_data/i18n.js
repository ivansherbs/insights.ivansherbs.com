const fs = require('fs');

const yaml = require('yaml');
const I18N_PATH = 'content/_data/i18n.yml';

module.exports = yaml.parse(fs.readFileSync(I18N_PATH, 'utf8'));
