const debug = require('debug')('ih:i18n');
const fs = require('fs');

const yaml = require('yaml');
const I18N_PATH = 'content/_data/i18n.yml';

try {
    debug(`Loading i18n translation file from ${I18N_PATH}`);
    module.exports = yaml.parse(fs.readFileSync(I18N_PATH, 'utf8'));
} catch (err) {
    var message = `Error processing i18n translation file (${I18N_PATH}): ${err.message}`;
    debug(message);
    throw new Error(message);
}
