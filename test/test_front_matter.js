const assert = require('assert');
const fs = require('fs');
const glob = require('glob');
const readline = require('readline');
const util = require('util');
const yaml = require('yaml');
const yamllint = require('yaml-lint');

const CONTENT_PATH = 'content/';
const LANGUAGES = ['en', 'nl'];

const CONTENTFUL_IMAGE_API_OPTIONS = [
    'fm', 'fl', 'w', 'h', 'fit', 'f', 'r', 'q', 'bg'
];

function readFrontMatter(filePath, callback) {
    const rl = readline.createInterface(fs.createReadStream(filePath));
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

function filterOutFilesWithValidFrontMatterSyntax(filePath, callback) {
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

function findProblemsWithContentfulOption(filePath, callback) {
    readFrontMatter(filePath, (err, frontMatter) => {
        // no front matter
        if (!frontMatter) {
            callback(null);
            return;
        }

        var frontMatterObject = yaml.parse(frontMatter);

        // no contentful options declared
        if (!frontMatterObject.contentful) {
            callback(null);
            return;
        }

        var errors = [];

        // contentful options defined
        if (frontMatterObject.contentful.imageOptions) {
            for (var option in frontMatterObject.contentful.imageOptions) {
                if (!CONTENTFUL_IMAGE_API_OPTIONS.includes(option)) {
                    errors.push(option);
                }
            }
        }

        if (errors.length) {
            callback(null, errors);
            return;
        }

        callback(null);
    });
}

function findProblemsWithLayout(filePath, callback) {
    readFrontMatter(filePath, (err, frontMatter) => {
        // no front matter
        if (!frontMatter) {
            callback(null);
            return;
        }

        var frontMatterObject = yaml.parse(frontMatter);

        // no layout declared
        if (!frontMatterObject.layout) {
            callback(null, 'missing layout');
            return;
        }

        // layout defined
        try {
            fs.statSync(CONTENT_PATH + '/_includes/' + frontMatterObject.layout);
        } catch (error) {
            callback(null, `layout: ${frontMatterObject.layout}`);
            return;
        }

        callback(null);
    });
}

function findProblemsWithFragments(filePath, callback) {
    readFrontMatter(filePath, (err, frontMatter) => {
        // no front matter
        if (!frontMatter) {
            callback(null);
            return;
        }

        var frontMatterObject = yaml.parse(frontMatter);

        // no fragments declared
        if (!frontMatterObject.fragments) {
            callback(null);
            return;
        }

        var errors = [];

        // header fragment defined
        var header = frontMatterObject.fragments.header;
        if (header) {
            var headerPath = header + '.md';
            try {
                fs.statSync(CONTENT_PATH + headerPath);
            } catch (error) {
                errors.push(`header: ${header}`);
            }
        }

        // footer fragment defined
        var footer = frontMatterObject.fragments.footer;
        if (footer) {
            var footerPath = footer + '.md';
            try {
                fs.statSync(CONTENT_PATH + footerPath);
            } catch (error) {
                errors.push(`footer: ${footer}`);
            }
        }

        if (errors.length) {
            callback(null, errors);
            return;
        }

        callback(null);
    });
}

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
                        return await util.promisify(filterOutFilesWithValidFrontMatterSyntax)(`${CONTENT_PATH}${language}/${mdFile}`);
                    });

                    assert.strictEqual(badFiles.length, 0, `Found YAML syntax errors in the front matter of the following files:\n  ${badFiles.join('\n  ')}`);
                });
            });

            describe('- page layouts', function () {

                const findLayoutProblems = async (arr) =>
                    await Promise.all(arr.map(mdFile => util.promisify(findProblemsWithLayout)(`${CONTENT_PATH}${language}/${mdFile}`)));

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
                    await Promise.all(arr.map(mdFile => util.promisify(findProblemsWithFragments)(`${CONTENT_PATH}${language}/${mdFile}`)));

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
                    await Promise.all(arr.map(mdFile => util.promisify(findProblemsWithContentfulOption)(`${CONTENT_PATH}${language}/${mdFile}`)));


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
