const assert = require('assert');
const fs = require('fs');
const glob = require('glob');
const readline = require('readline');
const util = require('util');
const yaml = require('yaml');
const yamllint = require('yaml-lint');

const CONTENT_PATH = 'content/';
const LANGUAGES = ['en', 'nl'];

function readFrontMatter(path, callback) {
    const rl = readline.createInterface(fs.createReadStream(path));
    var frontMatter = '';
    var readingFrontMatter = false;
    rl.on('line', (line) => {
        if (line.trim() === '---') {
            if (!readingFrontMatter) {
                readingFrontMatter = true;
            } else {
                rl.close();
            }
        } else {
            if (!readingFrontMatter) {
                rl.close();
            } else {
                frontMatter += line + '\n';
            }
        }
    });

    rl.on('close', () => {
        callback(null, frontMatter);
    });

}

function validateFrontMatterSyntax(filePath, callback) {
    readFrontMatter(filePath, (err, frontMatter) => {
        if (!frontMatter) {
            callback(null, false);
            return;
        }
        yamllint.lint(frontMatter)
            .then(() => callback(null, false))
            .catch(error => callback(null, true));
    });
}

describe('content front matter', function () {

    LANGUAGES.forEach(language => {

        describe(`YAML syntax (${language})`, function () {

            var mdFiles = [];

            before(function (done) {
                var globOptions = {
                    cwd: CONTENT_PATH + language
                };
                mdFiles = glob.sync('**/*.md', globOptions);
                done();
            });

            it('has no syntax errors', async function () {

                const filterGoodFiles = async (arr, predicate) => {
                    const results = await Promise.all(arr.map(predicate));
                    return arr.filter((_v, index) => results[index]);
                }

                const badFiles = await filterGoodFiles(mdFiles, async mdFile => {
                    return await util.promisify(validateFrontMatterSyntax)(`${CONTENT_PATH}${language}/${mdFile}`);
                });

                assert.strictEqual(badFiles.length, 0, `Found YAML syntax errors in the front matter of the following files:\n  ${badFiles.join('\n  ')}`);
            });
        });
    });
});