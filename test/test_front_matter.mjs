import assert from 'assert';
import glob from 'glob';
import util from 'util';

import * as FrontMatter from './lib/front_matter.mjs';

const CONTENT_PATH = 'content/';
const LANGUAGES = ['en', 'nl'];


describe(`front matter`, function () {

    LANGUAGES.forEach(language => {

        describe(`${language.toUpperCase()}`, function () {

            var mdFiles = [];

            before(function (done) {
                var globOptions = {
                    cwd: CONTENT_PATH + language
                };
                mdFiles = glob.sync('**/*.md', globOptions);
                done();
            });

            describe(`- YAML syntax`, function () {

                it('- has no syntax errors', async function () {

                    const filterOutGoodFiles = async (arr, predicate) => {
                        const results = await Promise.all(arr.map(predicate));
                        return arr.filter((_v, index) => results[index]);
                    }

                    const badFiles = await filterOutGoodFiles(mdFiles, async mdFile => {
                        return await util.promisify(FrontMatter.filterOutFilesWithValidFrontMatterSyntax)(`${CONTENT_PATH}${language}/${mdFile}`);
                    });

                    assert.strictEqual(badFiles.length, 0, `Found YAML syntax errors in the front matter of the following files:\n  ${badFiles.join('\n  ')}`);
                });
            });

            describe('- page layouts', function () {

                const findLayoutProblems = async (arr) =>
                    await Promise.all(arr.map(mdFile => util.promisify(FrontMatter.findProblemsWithLayout)(`${CONTENT_PATH}${language}/${mdFile}`)));

                it('- have valid paths', async function () {

                    const problems = await findLayoutProblems(mdFiles);
                    const badFiles = mdFiles
                        .map((file, index) => problems[index] ? `${file} (${problems[index]})` : undefined)
                        .filter(mdFile => !!mdFile);

                    assert.strictEqual(badFiles.length, 0, `The following pages have invalid layout references:\n  ${badFiles.join('\n  ')}`);
                });
            });

            describe('- page fragments', function () {

                const findFragmentProblems = async (arr) =>
                    await Promise.all(arr.map(mdFile => util.promisify(FrontMatter.findProblemsWithFragments)(`${CONTENT_PATH}${language}/${mdFile}`)));

                it('- have valid paths', async function () {

                    const problems = await findFragmentProblems(mdFiles);
                    const badFiles = mdFiles
                        .map((file, index) => problems[index] ? `${file} (${problems[index].join(', ')})` : undefined)
                        .filter(mdFile => !!mdFile);

                    assert.strictEqual(badFiles.length, 0, `Found broken fragment paths in the front matter of the following files:\n  ${badFiles.join('\n  ')}`);
                });
            });

            describe('- Contentful page options', function () {

                const findContentfulOptionProblems = async (arr) =>
                    await Promise.all(arr.map(mdFile => util.promisify(FrontMatter.findProblemsWithContentfulOption)(`${CONTENT_PATH}${language}/${mdFile}`)));


                it('- have valid image paths', async function () {

                    const problems = await findContentfulOptionProblems(mdFiles);
                    const badFiles = mdFiles
                        .map((file, index) => problems[index] ? `${file} (${problems[index].join(', ')})` : undefined)
                        .filter(mdFile => !!mdFile);

                    assert.strictEqual(badFiles.length, 0, `Found invalid contentful image options in the front matter of the following files:\n  ${badFiles.join('\n  ')}`);
                });
            });
        });
    });
});
