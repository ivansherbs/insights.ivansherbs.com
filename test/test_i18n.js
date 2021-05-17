const assert = require('assert');
const fs = require('fs');
const yaml = require('yaml');
const yamllint = require('yaml-lint');

const I18N_PATH = 'content/_data/i18n.yml';

describe('i18n', function () {

    describe('- YAML syntax', function () {
        it('- as no syntax errors', function (done) {
            yamllint.lint(fs.readFileSync(I18N_PATH, 'utf8')).then(done).catch((error) => {
                console.error(`Invalid YAML syntax in i18n translation file (${I18N_PATH})`);
                done(error);
            });
        });
    });

    describe('- key syntax', function () {

        var i18nContent;

        before(function (done) {
            i18nContent = yaml.parse(fs.readFileSync(I18N_PATH, 'utf8'));
            done();
        });

        it('- no empty translation keys', function () {
            var badKeys = [];
            for (const key in i18nContent) {
                var value = i18nContent[key];
                if (value == null || typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length == 0) {
                    badKeys.push(key);
                }
            }
            assert.strictEqual(badKeys.length, 0, `The following i18n keys are empty (have no language child): ${badKeys.join(', ')}`);
        });

        it('- all translation keys have children (no simple key: value)', function () {
            var badKeys = [];
            for (const key in i18nContent) {
                var value = i18nContent[key];
                if (typeof value !== 'object' || Array.isArray(value)) {
                    badKeys.push(key);
                }
            }
            assert.strictEqual(badKeys.length, 0, `The following i18n keys must be parent keys with language children: ${badKeys.join(', ')}`);
        });

        it('- no spaces in the tranlsation keys', function () {
            var badKeys = [];
            for (const key in i18nContent) {
                if (key.match(/\s/)) {
                    badKeys.push(key);
                }
            }
            assert.strictEqual(badKeys.length, 0, `The following i18n keys contain spaces: ${badKeys.join(', ')}`);
        });

        it('- translation keys using dot notation are correct', function () {
            var badKeys = [];
            for (const key in i18nContent) {
                var segments = key.split('.');
                for (const segment of segments) {
                    if (segment.length == 0) {
                        badKeys.push(key);
                        break;
                    }
                }
            }
            assert.strictEqual(badKeys.length, 0, `The following i18n keys using dot notation are not compliant: ${badKeys.join(', ')}`);
        });
    });

});
